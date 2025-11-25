"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { marketIntelligenceAPI, JobStatusResponse } from '@/lib/market-intelligence-api';
import { useAuthStore } from '@/lib/store';

interface ActiveJob {
  jobId: string;
  segmentName: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  progress?: number; // Progress percentage 0-100
}

interface UseMarketPullReturn {
  activeJobs: Map<string, ActiveJob>;
  jobResults: Map<string, JobStatusResponse>;
  loading: boolean;
  error: string | null;
  activeJobsCount: number;
  startPull: (
    segmentName: string,
    productName: string,
    productId: string,
    industry: string
  ) => Promise<{ job_id: string; status: string; message: string }>;
  cancelPull: (segmentName: string) => Promise<void>;
  getJobStatus: (segmentName: string) => ActiveJob | undefined;
  getJobResult: (segmentName: string) => JobStatusResponse | undefined;
  refreshJobStatus: (segmentName: string) => Promise<JobStatusResponse | null>;
  refreshAllJobs: () => Promise<void>;
  reset: () => void;
  setProductId: (productId: string | null) => void;
}

export function useMarketPull(): UseMarketPullReturn {
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [activeJobs, setActiveJobs] = useState<Map<string, ActiveJob>>(new Map());
  const [jobResults, setJobResults] = useState<Map<string, JobStatusResponse>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [jobsApiAvailable, setJobsApiAvailable] = useState(true); // Track if API is available
  const { user } = useAuthStore();

  // Fetch all user jobs and populate activeJobs state
  const fetchUserJobs = useCallback(async () => {
    if (!user?.uid || !jobsApiAvailable || !currentProductId) return;

    try {
      const allJobs = await marketIntelligenceAPI.getUserJobs(user.uid);
      
      // Filter jobs by current product ID
      const productJobs = allJobs.jobs.filter(job => job.product_id === currentProductId);
      
      // Update activeJobs map with running jobs for this product
      const updatedActiveJobs = new Map<string, ActiveJob>();
      const updatedJobResults = new Map<string, JobStatusResponse>();
      
      for (const job of productJobs) {
        if (job.status === 'running') {
          updatedActiveJobs.set(job.segment_name, {
            jobId: job.job_id,
            segmentName: job.segment_name,
            status: 'running',
            startedAt: job.started_at,
          });
        } else if (job.status === 'completed') {
          // Fetch full job result for completed jobs
          try {
            const fullResult = await marketIntelligenceAPI.getJobStatus(job.job_id, user.uid);
            updatedJobResults.set(job.segment_name, fullResult);
          } catch (err) {
            console.error(`Failed to fetch result for completed job ${job.job_id}:`, err);
          }
        }
      }
      
      // Update state with fetched jobs
      setActiveJobs(updatedActiveJobs);
      setJobResults(updatedJobResults);
      
      // Count active (running) jobs for this product
      const runningCount = productJobs.filter(job => job.status === 'running').length;
      setActiveJobsCount(runningCount);
    } catch (err) {
      // Silently fail and disable further attempts on 404 or 500
      if (err instanceof Error && (err.message.includes('404') || err.message.includes('500'))) {
        setJobsApiAvailable(false);
      }
      
      // Fallback: count from local activeJobs map
      const localRunningCount = Array.from(activeJobs.values()).filter(
        job => job.status === 'running'
      ).length;
      setActiveJobsCount(localRunningCount);
    }
  }, [user?.uid, jobsApiAvailable, currentProductId]); // Added currentProductId to dependencies

  // Fetch user jobs on mount and when user or product changes
  useEffect(() => {
    if (user?.uid && jobsApiAvailable && currentProductId) {
      fetchUserJobs();
    }
  }, [user?.uid, jobsApiAvailable, currentProductId, fetchUserJobs]);

  const startPull = useCallback(async (
    segmentName: string,
    productName: string,
    productId: string,
    industry: string
  ) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    // Check if job already running for this segment
    const existingJob = activeJobs.get(segmentName);
    if (existingJob && existingJob.status === 'running') {
      throw new Error('Job already running for this segment');
    }

    try {
      setLoading(true);
      setError(null);

      const result = await marketIntelligenceAPI.startMarketPull({
        segment_name: segmentName,
        product_data: { product_name: productName },
        market_data: {
          target_region: 'Canada',
          industry: industry,
        },
        user_id: user.uid,
        product_id: productId,
      });

      // Add to active jobs
      setActiveJobs(prev => new Map(prev).set(segmentName, {
        jobId: result.job_id,
        segmentName,
        status: 'running',
        startedAt: new Date().toISOString(),
        progress: 0,
      }));

      // Update local count immediately
      setActiveJobsCount(prev => prev + 1);

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start market pull';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, activeJobs]);

  const cancelPull = useCallback(async (segmentName: string) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    const job = activeJobs.get(segmentName);
    if (!job) {
      throw new Error('No active job for this segment');
    }

    try {
      await marketIntelligenceAPI.cancelJob(job.jobId, user.uid);
      
      // Remove from active jobs
      setActiveJobs(prev => {
        const updated = new Map(prev);
        updated.delete(segmentName);
        return updated;
      });

      // Update local count
      setActiveJobsCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to cancel job:', err);
      throw err;
    }
  }, [user, activeJobs]);

  const getJobStatus = useCallback((segmentName: string): ActiveJob | undefined => {
    return activeJobs.get(segmentName);
  }, [activeJobs]);

  const getJobResult = useCallback((segmentName: string): JobStatusResponse | undefined => {
    return jobResults.get(segmentName);
  }, [jobResults]);

  const refreshJobStatus = useCallback(async (segmentName: string): Promise<JobStatusResponse | null> => {
    if (!user?.uid) return null;

    const job = activeJobs.get(segmentName);
    if (!job) {
      return null;
    }

    try {
      const status = await marketIntelligenceAPI.getJobStatus(job.jobId, user.uid);
      
      // Update the jobResults with the fresh data
      setJobResults(prev => new Map(prev).set(segmentName, status));
      
      return status;
    } catch (err) {
      console.error('[refreshJobStatus] Failed to fetch job status:', err);
      return null;
    }
  }, [user, activeJobs]);

  // New function to refresh all running jobs
  const refreshAllJobs = useCallback(async () => {
    if (!user?.uid || !currentProductId) return;

    try {
      setLoading(true);
      
      // Fetch all jobs for this product
      await fetchUserJobs();
      
      // Update progress for all running jobs
      const runningJobs = Array.from(activeJobs.entries()).filter(
        ([_, job]) => job.status === 'running'
      );

      for (const [segmentName, job] of runningJobs) {
        try {
          const status = await marketIntelligenceAPI.getJobStatus(job.jobId, user.uid);
          
          // Calculate progress based on runtime (2 hours max = 7200000 ms)
          const startTime = new Date(job.startedAt).getTime();
          const currentTime = Date.now();
          const elapsedMs = currentTime - startTime;
          const maxDurationMs = 2 * 60 * 60 * 1000; // 2 hours
          const calculatedProgress = Math.min(Math.round((elapsedMs / maxDurationMs) * 100), 99);
          
          // Update job status
          setActiveJobs(prev => {
            const updated = new Map(prev);
            const existingJob = updated.get(segmentName);
            if (existingJob) {
              existingJob.status = status.status;
              existingJob.progress = status.status === 'completed' ? 100 : calculatedProgress;
              updated.set(segmentName, existingJob);
            }
            return updated;
          });

          // Store result if completed or failed
          if (status.status === 'completed' || status.status === 'failed') {
            setJobResults(prev => new Map(prev).set(segmentName, status));
          } else if (status.status === 'running' && status.steps && status.steps.length > 0) {
            // Store partial results for running jobs
            setJobResults(prev => new Map(prev).set(segmentName, status));
          }
        } catch (err) {
          console.error(`Error refreshing job ${job.jobId}:`, err);
        }
      }
      
      // Update local count
      const localRunningCount = Array.from(activeJobs.values()).filter(
        j => j.status === 'running'
      ).length;
      setActiveJobsCount(localRunningCount);
    } catch (err) {
      console.error('Error refreshing all jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh jobs');
    } finally {
      setLoading(false);
    }
  }, [user, currentProductId, activeJobs, fetchUserJobs]);

  const reset = useCallback(() => {
    setActiveJobs(new Map());
    setJobResults(new Map());
    setActiveJobsCount(0);
    setError(null);
  }, []);

  const setProductId = useCallback((productId: string | null) => {
    setCurrentProductId(productId);
    // Reset when product changes
    if (productId === null) {
      reset();
    }
  }, [reset]);

  return {
    activeJobs,
    jobResults,
    loading,
    error,
    activeJobsCount,
    startPull,
    cancelPull,
    getJobStatus,
    getJobResult,
    refreshJobStatus,
    refreshAllJobs,
    reset,
    setProductId,
  };
}

