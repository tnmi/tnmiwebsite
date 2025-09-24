"use client"

import { auth } from "@/lib/firebase"

// Using production Market Research API directly
const API_BASE_URL = "https://market-finder-agent-194429268019.us-central1.run.app/api/v1"

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

  // 1. List user orders (GET /user/{user_id}/orders)
  async getUserOrders(userId: string): Promise<any> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      const token = await user.getIdToken()
      const url = `${this.baseURL.replace('/api/v1', '')}/user/${userId}/orders`
      console.log('Fetching orders from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Orders response status:', response.status)
      return this.handleResponse<any>(response)
    } catch (error) {
      console.error('Failed to get user orders:', error)
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
    const response = await fetch(`https://market-finder-agent-194429268019.us-central1.run.app/health`)
    return this.handleResponse<{ status: string }>(response)
  }

  // Create new market research order (POST /invoke)
  async startResearch(userId: string, productId: string): Promise<{ order_id: string }> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      const token = await user.getIdToken()
      const url = `${this.baseURL.replace('/api/v1', '')}/invoke`
      const payload = {
        user_id: userId,
        product_id: productId
      }
      
      console.log('Starting research with URL:', url)
      console.log('Payload:', payload)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      console.log('Start research response status:', response.status)
      const result = await this.handleResponse<any>(response)
      console.log('Start research result:', result)
      return { order_id: result.order_id || result.data?.order_id || result.id || 'research-started' }
    } catch (error) {
      console.error('Failed to start research:', error)
      throw error
    }
  }
}

export const marketResearchAPI = new MarketResearchAPI()
