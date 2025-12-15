"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { marketIntelligenceAPI, JobStatusResponse, MarketPullResponse } from '@/lib/market-intelligence-api';
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
  ) => Promise<MarketPullResponse>;
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
      
      const jobsArray = Array.isArray(allJobs.jobs) ? allJobs.jobs : (Array.isArray((allJobs as any).items) ? (allJobs as any).items : []);
      
      // Filter jobs by current product ID
      let productJobs = jobsArray.filter((job: any) => {
        const jobProductId = job.product_id || job.productId; // Handle both cases
        return String(jobProductId) === String(currentProductId);
      });
      
      // Group jobs by segment to only process the latest one per segment
      const jobsBySegment = new Map<string, any[]>();
      
      for (const job of productJobs) {
        const segmentName = job.segment_name || job.segmentName;
        if (segmentName) {
          if (!jobsBySegment.has(segmentName)) {
            jobsBySegment.set(segmentName, []);
          }
          jobsBySegment.get(segmentName)!.push(job);
        }
      }
      
      // Update activeJobs map with running jobs for this product
      const updatedActiveJobs = new Map<string, ActiveJob>();
      const updatedJobResults = new Map<string, JobStatusResponse>();
      
      // If no jobs found, log it for debugging
      if (allJobs.jobs.length > 0 && productJobs.length === 0) {
        // console.log('Found jobs but none match current product:', currentProductId);
      }
      
      // Process only the latest job for each segment
      for (const [segmentName, jobs] of jobsBySegment.entries()) {
        // Sort by started_at descending (newest first)
        jobs.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
        const latestJob = jobs[0];
        
        if (latestJob.status === 'running') {
          updatedActiveJobs.set(segmentName, {
            jobId: latestJob.job_id,
            segmentName: segmentName,
            status: 'running',
            startedAt: latestJob.started_at,
          });
        } else {
          // For completed/failed job, try to fetch its result if we don't have it
          if (!jobResults.has(segmentName)) {
            try {
              // Add a small delay to avoid hitting rate limits if processing many segments
              await new Promise(resolve => setTimeout(resolve, 100)); 
              const fullResult = await marketIntelligenceAPI.getJobStatus(latestJob.job_id, user.uid);
              updatedJobResults.set(segmentName, fullResult);
            } catch (err) {
              console.error(`Failed to fetch result for job ${latestJob.job_id}:`, err);
            }
          } else {
             // Keep existing result
             updatedJobResults.set(segmentName, jobResults.get(segmentName)!);
          }
        }
      }
      
      // Update state with fetched jobs
      setActiveJobs(updatedActiveJobs);
      // Only update jobResults if we fetched new ones, merge with existing
      setJobResults(prev => {
        const newMap = new Map(prev);
        updatedJobResults.forEach((val, key) => newMap.set(key, val));
        return newMap;
      });
      
      // Count active (running) jobs for this product
      const runningCount = Array.from(updatedActiveJobs.values()).filter(job => job.status === 'running').length;
      setActiveJobsCount(runningCount);
    } catch (err) {
      // Silently fail and disable further attempts ONLY on 404 (API not found)
      // 500/503 errors are transient or server-side, so we should keep trying
      if (err instanceof Error && err.message.includes('404')) {
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
      // Reset results when switching products to prevent showing wrong data
      setJobResults(new Map());
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
      // Reset availability to try again in case it was disabled by a transient error
      setJobsApiAvailable(true);
      
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
          } else if (
            status.status === 'running' &&
            ((status as any).partial_output || (status as any).final_output || (status.steps && status.steps.length > 0))
          ) {
            // Store partial results for running jobs (new: partial_output)
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

