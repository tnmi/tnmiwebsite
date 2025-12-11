/**
 * Centralized API client with error handling and type safety
 */

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errorId?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Get the API base URL based on environment
export function getApiBaseUrl(): string {
  // In production, use relative URLs (same domain)
  // In development, also use relative URLs (Next.js dev server handles it)
  return '';
}

/**
 * Centralized API client for making HTTP requests
 */
export const apiClient = {
  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any, token: string): Promise<T> {
    try {
      const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Try to parse error response
        let errorData: any;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          // Non-JSON error (e.g., HTML 404 page)
          const text = await response.text();
          throw new ApiError(
            response.status,
            `API request failed: ${response.statusText}`,
            'NON_JSON_RESPONSE',
            { responseText: text.substring(0, 200) }
          );
        }

        throw new ApiError(
          response.status,
          errorData.error || 'API request failed',
          errorData.error_id,
          errorData
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network error or other unexpected error
      throw new ApiError(
        500,
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR'
      );
    }
  },

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, token: string): Promise<T> {
    try {
      const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorData: any;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          const text = await response.text();
          throw new ApiError(
            response.status,
            `API request failed: ${response.statusText}`,
            'NON_JSON_RESPONSE',
            { responseText: text.substring(0, 200) }
          );
        }

        throw new ApiError(
          response.status,
          errorData.error || 'API request failed',
          errorData.error_id,
          errorData
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        500,
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR'
      );
    }
  },

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, token: string): Promise<T> {
    try {
      const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorData: any;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          const text = await response.text();
          throw new ApiError(
            response.status,
            `API request failed: ${response.statusText}`,
            'NON_JSON_RESPONSE',
            { responseText: text.substring(0, 200) }
          );
        }

        throw new ApiError(
          response.status,
          errorData.error || 'API request failed',
          errorData.error_id,
          errorData
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        500,
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR'
      );
    }
  },
};
