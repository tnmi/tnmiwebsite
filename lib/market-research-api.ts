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

  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const user = auth.currentUser
      if (user) {
        const token = await user.getIdToken()
        return {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    } catch (error) {
      console.error('Failed to get auth token:', error)
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

  // 1. Start market research (POST /invoke)
  async startResearch(userId: string, productId: string): Promise<{ order_id: string }> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${this.baseURL}/invoke`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        user_id: userId,
        product_id: productId
      })
    })
    return this.handleResponse<{ order_id: string }>(response)
  }

  // 2. Check order status (GET /order/{order_id}/status)
  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${this.baseURL}/order/${orderId}/status`, {
      headers
    })
    return this.handleResponse<OrderStatus>(response)
  }

  // 3. List user orders (GET /user/{user_id}/orders)
  async getUserOrders(userId: string): Promise<Order[]> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${this.baseURL}/user/${userId}/orders`, {
      headers
    })
    return this.handleResponse<Order[]>(response)
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseURL}/health`)
    return this.handleResponse<{ status: string }>(response)
  }
}

export const marketResearchAPI = new MarketResearchAPI()
