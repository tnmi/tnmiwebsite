// API interfaces and client for Market Intelligence and Market Pull agents
import { getAuthInstance } from './firebase';

const API_BASE = '/api';

// ========== INTERFACES ==========

export interface MarketIntelligenceRequest {
  product_id: string;
  session_id?: string;
}

export interface MarketSegment {
  name: string;
  share_pct: number;
  description: string;
  source_url?: string;
  estimation_method?: string;
  found_with_query?: string;
}

export interface MarketIntelligenceResponse {
  session_id: string;
  user_id: string;
  product_id: string;
  market_segments: {
    market_segments: MarketSegment[];
    year: number;
    data_year_range: string;
    sources: string[];
    data_quality: string;
  };
  metadata: {
    execution_time_seconds: number;
    completed_at?: string;
    architecture: string;
  };
}

export interface MarketPullRequest {
  segment_name: string;
  product_data: {
    product_name: string;
  };
  market_data: {
    target_region: string;
    industry: string;
  };
  user_id: string;
  product_id: string;
}

export interface MarketPullResponse {
  job_id: string;
  status: string;
  message: string;
  user_id: string;
  product_id: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  user_id: string;
  product_id: string;
  environment: string;
  input_data?: any;
  steps?: any[];
  final_output?: {
    industry_report: string;
    supply_chain: string;
    consumer_demand: string;
    regulatory: string;
    financial: string;
  };
  error?: string;
}

export interface UserJob {
  job_id: string;
  product_id: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  segment_name: string;
  product_name: string;
}

export interface UserJobsResponse {
  user_id: string;
  total_jobs: number;
  jobs: UserJob[];
}

export interface MarketIntelligenceHistoryItem {
  session_id: string;
  product_id: string;
  created_at: string;
  timestamp: string;
  output: MarketIntelligenceResponse;
}

export interface MarketIntelligenceHistoryResponse {
  user_id: string;
  product_id: string;
  count: number;
  history: MarketIntelligenceHistoryItem[];
}

// ========== API CLIENT ==========

export const marketIntelligenceAPI = {
  /**
   * Get Firebase auth token
   */
  async getAuthToken(): Promise<string> {
    const user = getAuthInstance().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.getIdToken();
  },

  /**
   * Analyze a product and get market segments
   */
  async analyzeProduct(data: MarketIntelligenceRequest): Promise<MarketIntelligenceResponse> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE}/market-intelligence/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to analyze product: ${response.status} - ${errorText}`);
    }

    return response.json();
  },

  /**
   * Start a Market Pull analysis for a segment
   */
  async startMarketPull(data: MarketPullRequest): Promise<MarketPullResponse> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE}/market-research/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start market pull: ${response.status} - ${errorText}`);
    }

    return response.json();
  },

  /**
   * Get the status of a Market Pull job
   */
  async getJobStatus(jobId: string, userId: string): Promise<JobStatusResponse> {
    const token = await this.getAuthToken();
    
    const response = await fetch(
      `${API_BASE}/market-research/jobs/${encodeURIComponent(jobId)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('API_ERROR_500');
      }
      const errorText = await response.text();
      throw new Error(`Failed to get job status: ${response.status} - ${errorText}`);
    }

    return response.json();
  },

  /**
   * Cancel a Market Pull job
   */
  async cancelJob(jobId: string, userId: string): Promise<void> {
    const token = await this.getAuthToken();
    
    const response = await fetch(
      `${API_BASE}/market-research/jobs/${encodeURIComponent(jobId)}/cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to cancel job: ${response.status} - ${errorText}`);
    }
  },

  /**
   * Get all Market Pull jobs for a user
   */
  async getUserJobs(userId: string): Promise<UserJobsResponse> {
    const token = await this.getAuthToken();
    
    const response = await fetch(
      `${API_BASE}/market-research/jobs`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('API_NOT_AVAILABLE');
      }
      if (response.status === 500) {
        throw new Error('API_ERROR_500');
      }
      const errorText = await response.text();
      throw new Error(`Failed to get user jobs: ${response.status} - ${errorText}`);
    }

    return response.json();
  },

  /**
   * Get Market Intelligence history for a product
   */
  async getMarketIntelligenceHistory(userId: string, productId: string): Promise<MarketIntelligenceHistoryResponse> {
    const token = await this.getAuthToken();
    
    const response = await fetch(
      `${API_BASE}/market-intelligence/history?product_id=${encodeURIComponent(productId)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // No history found, return empty
        return {
          user_id: userId,
          product_id: productId,
          count: 0,
          history: [],
        };
      }
      const errorText = await response.text();
      throw new Error(`Failed to get history: ${response.status} - ${errorText}`);
    }

    return response.json();
  },
};




