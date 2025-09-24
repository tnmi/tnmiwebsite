"use client"

import { auth } from "@/lib/firebase"

// Using production Market Research API directly
const API_BASE_URL = "https://market-research-api-26pkzuizfq-uc.a.run.app/api/v1"
// Agent and Orders specific endpoint
const AGENT_BASE_URL = "https://market-finder-agent-194429268019.us-central1.run.app"

// Data types based on the market research API
export interface Order {
  order_id: string
  product_id: string
  user_id: string
  status: 'completed' | 'processing' | 'failed' | 'pending'
  created_at: string
  updated_at?: string
}

export interface OrderStatus {
  order_id: string
  status: 'completed' | 'processing' | 'failed' | 'pending'
  progress?: number
  message?: string
  result?: any
}

export interface StartResearchRequest {
  user_id: string
  product_id: string
}

class MarketResearchAPI {
  private baseURL: string
  
  constructor() {
    this.baseURL = API_BASE_URL
  }

  private async getAuthHeaders(userId?: string): Promise<Record<string, string>> {
    try {
      const user = auth.currentUser
      const effectiveUserId = userId || user?.uid
      
      if (user && effectiveUserId) {
        const token = await user.getIdToken()
        return {
          'Authorization': `Bearer ${token}`,
          'X-User-ID': effectiveUserId,
          'Content-Type': 'application/json'
        }
      }
    } catch (error) {
      console.error('Failed to get auth headers:', error)
    }
    
    // Return basic headers if no auth
    return {
      'Content-Type': 'application/json'
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return data
  }

  // 1. List user orders (GET /user/{user_id}/orders) - using proxy to avoid CORS
  async getUserOrders(userId: string): Promise<any> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      const token = await user.getIdToken()
      
      // Use our Next.js API proxy to avoid CORS issues
      const response = await fetch(`/api/market-research/orders?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Orders response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Orders proxy error:', errorText)
        // Return empty orders instead of throwing to prevent UI from breaking
        return { data: { items: [] } }
      }
      
      const data = await response.json()
      console.log('Orders response data:', data)
      return data
    } catch (error) {
      console.error('Failed to get user orders:', error)
      // Return empty orders instead of throwing to prevent UI from breaking
      console.log('Returning empty orders due to error')
      return { data: { items: [] } }
    }
  }

  // Get order details (GET /order/{order_id}/details) - using proxy to avoid CORS
  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      const token = await user.getIdToken()
      
      console.log('Fetching order details for:', orderId)
      
      // Use our Next.js API proxy to avoid CORS issues
      const response = await fetch(`/api/market-research/order-details?order_id=${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Order details response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Order details proxy error:', errorText)
        throw new Error(`Failed to fetch order details: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Order details response data:', data)
      return data
    } catch (error) {
      console.error('Failed to get order details:', error)
      throw error
    }
  }

  // 2. Get user analytics (GET /api/v1/users/{user_id}/analytics)
  async getUserAnalytics(userId: string): Promise<any> {
    const headers = await this.getAuthHeaders(userId)
    const response = await fetch(`${this.baseURL}/users/${userId}/analytics`, {
      headers
    })
    return this.handleResponse<any>(response)
  }

  // 3. Get order full report (GET /api/v1/orders/{order_id}/full-report)
  async getOrderReport(orderId: string, userId: string): Promise<any> {
    const headers = await this.getAuthHeaders(userId)
    const response = await fetch(`${this.baseURL}/orders/${orderId}/full-report`, {
      headers
    })
    return this.handleResponse<any>(response)
  }

  // 4. Search companies (GET /api/v1/search/companies)
  async searchCompanies(query: string, userId: string): Promise<any> {
    const headers = await this.getAuthHeaders(userId)
    const response = await fetch(`${this.baseURL}/search/companies?query=${encodeURIComponent(query)}`, {
      headers
    })
    return this.handleResponse<any>(response)
  }

  // 5. Export order to PDF (POST /api/v1/export/orders/{order_id}/pdf)
  async exportOrderPDF(orderId: string, userId: string): Promise<Blob> {
    const headers = await this.getAuthHeaders(userId)
    const response = await fetch(`${this.baseURL}/export/orders/${orderId}/pdf`, {
      method: 'POST',
      headers
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error ${response.status}: ${errorText}`)
    }
    
    return response.blob()
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${AGENT_BASE_URL}/health`)
    return this.handleResponse<{ status: string }>(response)
  }

  // Create new market research order (POST /invoke) - using proxy to avoid CORS
  async startResearch(userId: string, productId: string): Promise<{ order_id: string }> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      const token = await user.getIdToken()
      const payload = {
        user_id: userId,
        product_id: productId
      }
      
      console.log('Starting research via proxy with payload:', payload)
      
      // Use our Next.js API proxy to avoid CORS issues
      const response = await fetch('/api/market-research/invoke', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      console.log('Start research response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Start research proxy error:', errorText)
        throw new Error(`Failed to start research: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('Start research result:', result)
      return { order_id: result.order_id || result.data?.order_id || result.id || 'research-started' }
    } catch (error) {
      console.error('Failed to start research:', error)
      throw error
    }
  }
}

export const marketResearchAPI = new MarketResearchAPI()
