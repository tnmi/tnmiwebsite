"use client"

import { auth } from "@/lib/firebase"

// Using local Next.js API proxy to avoid CORS issues
const API_BASE_URL = "/api/market-research"

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
      
      if (effectiveUserId) {
        return {
          'X-User-ID': effectiveUserId,
          'Content-Type': 'application/json'
        }
      }
    } catch (error) {
      console.error('Failed to get user ID:', error)
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

  // 1. List user orders (GET /api/v1/users/{user_id}/orders)
  async getUserOrders(userId: string): Promise<Order[]> {
    const headers = await this.getAuthHeaders(userId)
    const response = await fetch(`${this.baseURL}/user/${userId}/orders`, {
      headers
    })
    return this.handleResponse<Order[]>(response)
  }

  // 2. Get user analytics (GET /api/v1/users/{user_id}/analytics)
  async getUserAnalytics(userId: string): Promise<any> {
    const headers = await this.getAuthHeaders(userId)
    const response = await fetch(`${this.baseURL}/user/${userId}/analytics`, {
      headers
    })
    return this.handleResponse<any>(response)
  }

  // 3. Get order full report (GET /api/v1/orders/{order_id}/full-report)
  async getOrderReport(orderId: string, userId: string): Promise<any> {
    const headers = await this.getAuthHeaders(userId)
    const response = await fetch(`${this.baseURL}/order/${orderId}/full-report`, {
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
    const response = await fetch(`${this.baseURL}/health`)
    return this.handleResponse<{ status: string }>(response)
  }
}

export const marketResearchAPI = new MarketResearchAPI()
