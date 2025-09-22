"use client"

import { useState, useEffect } from "react"
import { 
  marketResearchAPI, 
  type Order, 
  type OrderStatus
} from "@/lib/market-research-api"
import { useAuthStore } from "@/lib/store"

// User Orders Hook
export function useUserOrders(userId?: string) {
  const [data, setData] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()

  const effectiveUserId = userId || user?.uid

  useEffect(() => {
    if (!effectiveUserId) {
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const orders = await marketResearchAPI.getUserOrders(effectiveUserId)
        setData(orders)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders')
        console.error('Orders fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [effectiveUserId])

  const refetch = async () => {
    if (effectiveUserId) {
      setLoading(true)
      try {
        const orders = await marketResearchAPI.getUserOrders(effectiveUserId)
        setData(orders)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }
  }

  return { data, loading, error, refetch }
}

// Order Status Hook with polling for processing orders
export function useOrderStatus(orderId: string | null) {
  const [data, setData] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setData(null)
      setLoading(false)
      return
    }

    const fetchStatus = async () => {
      try {
        setLoading(true)
        setError(null)
        const status = await marketResearchAPI.getOrderStatus(orderId)
        setData(status)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order status')
        console.error('Order status fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()

    // Poll for status updates if processing
    const interval = setInterval(async () => {
      if (data?.status === 'processing') {
        try {
          const status = await marketResearchAPI.getOrderStatus(orderId)
          setData(status)
        } catch (err) {
          console.error('Status polling error:', err)
        }
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [orderId, data?.status])

  return { data, loading, error }
}

// Start Research Hook
export function useStartResearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startResearch = async (userId: string, productId: string): Promise<{ order_id: string }> => {
    try {
      setLoading(true)
      setError(null)
      const result = await marketResearchAPI.startResearch(userId, productId)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start research'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { startResearch, loading, error }
}

// Health Check Hook
export function useHealthCheck() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await marketResearchAPI.healthCheck()
        setIsHealthy(result.status === 'ok' || result.status === 'healthy')
      } catch {
        setIsHealthy(false)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  return { isHealthy, loading }
}
