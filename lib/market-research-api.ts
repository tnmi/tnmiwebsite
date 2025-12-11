"use client"

import { getAuthInstance } from "@/lib/firebase"

// Use Next.js API routes as proxy (with /api prefix)
// This ensures proper CORS handling and security
const API_BASE = '/api'

// Data types based on the market research API
export interface MarketResearchJob {
  job_id: string
  product_id: string
  status: 'running' | 'completed' | 'failed'
  started_at: string
  completed_at?: string
  segment_name: string
  product_name: string
  user_id?: string
  environment?: string
  input_data?: any
  steps?: any[]
  final_output?: string
  error?: string | null
}

export interface StartMarketResearchRequest {
  product_id: string
  segment_name: string
  product_data: {
    product_name: string
  }
  market_data: {
    industry: string
    target_region: string
  }
}

export interface StartMarketResearchResponse {
  job_id: string
  status: string
  message: string
  user_id: string
  product_id: string
}

export interface UserJobsResponse {
  user_id: string
  total_jobs: number
  jobs: MarketResearchJob[]
}

export interface ProductJobsResponse {
  product_id: string
  total_jobs: number
  jobs: MarketResearchJob[]
}

export interface CancelJobResponse {
  job_id: string
  status: string
  message: string
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  service: string
  upstream_status: number
}

class MarketResearchAPI {
  private baseURL: string
  
  constructor() {
    this.baseURL = API_BASE
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const user = getAuthInstance().currentUser
      
      if (user) {
        const token = await user.getIdToken()
        return {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    } catch (error) {
      console.error('[MarketResearch] Failed to get auth headers:', error)
    }
    
    throw new Error('User not authenticated')
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `API Error ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
        if (errorData.error_id) {
          console.error(`[MarketResearch] Error ID: ${errorData.error_id}`)
        }
      } catch {
        errorMessage = await response.text()
      }
      throw new Error(errorMessage)
    }
    
    return response.json()
  }

  /**
   * Start a new market research job
   * Rate Limited: 5 requests per hour
   */
  async startMarketResearch(request: StartMarketResearchRequest): Promise<StartMarketResearchResponse> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${this.baseURL}/market-research/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request)
    })
    return this.handleResponse<StartMarketResearchResponse>(response)
  }

  /**
   * Get all jobs for the authenticated user
   */
  async getUserJobs(): Promise<UserJobsResponse> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${this.baseURL}/market-research/jobs`, {
      headers
    })
    return this.handleResponse<UserJobsResponse>(response)
  }

  /**
   * Get detailed status for a specific job
   */
  async getJobStatus(jobId: string): Promise<MarketResearchJob> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${this.baseURL}/market-research/jobs/${jobId}`, {
      headers
    })
    return this.handleResponse<MarketResearchJob>(response)
  }

  /**
   * Cancel a running job
   * Rate Limited: 10 requests per hour
   */
  async cancelJob(jobId: string, productId?: string): Promise<CancelJobResponse> {
    const headers = await this.getAuthHeaders()
    const url = new URL(`${this.baseURL}/market-research/jobs/${jobId}/cancel`)
    if (productId) {
      url.searchParams.set('product_id', productId)
    }
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers
    })
    return this.handleResponse<CancelJobResponse>(response)
  }

  /**
   * Get all jobs for a specific product
   */
  async getProductJobs(productId: string): Promise<ProductJobsResponse> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${this.baseURL}/market-research/product/${productId}/jobs`, {
      headers
    })
    return this.handleResponse<ProductJobsResponse>(response)
  }

  /**
   * Health check - no authentication required
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${this.baseURL}/market-research/health`)
    return this.handleResponse<HealthCheckResponse>(response)
  }

  /**
   * Poll job status until completion
   * @param jobId Job identifier
   * @param onProgress Callback for progress updates
   * @param maxPolls Maximum number of polls (default: 300 = 2.5 hours at 30s intervals)
   * @param pollInterval Interval between polls in ms (default: 30000 = 30s)
   */
  async pollJobStatus(
    jobId: string,
    onProgress?: (status: MarketResearchJob) => void,
    maxPolls: number = 300,
    pollInterval: number = 30000
  ): Promise<MarketResearchJob> {
    let polls = 0
    
    while (polls < maxPolls) {
      const status = await this.getJobStatus(jobId)
      
      if (onProgress) {
        onProgress(status)
      }
      
      if (status.status === 'completed' || status.status === 'failed') {
        return status
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval))
      polls++
    }
    
    throw new Error('Job polling timeout - job did not complete within expected time')
  }
}

export const marketResearchAPI = new MarketResearchAPI()

