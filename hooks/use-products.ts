"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/lib/store'

// ========== INTERFACES ==========

export interface ProductFile {
  id: string
  original_filename: string
  category: string
  download_url: string | null
  content_type?: string
  uploaded_at: string
}

export interface Product {
  id: string
  product_name?: string
  description?: string
  trl_level?: string
  files_by_category?: Record<string, string[]>
  files?: Record<string, ProductFile[]>
  file_counts?: Record<string, number>
  total_files?: number
  created_at?: string
  user_id?: string
}

export interface PaginationInfo {
  limit: number
  returned: number
  has_more: boolean
  next_offset: string | null
}

export interface PaginatedProductsResponse {
  products: Product[]
  pagination: PaginationInfo
}

export interface ProductFilesResponse {
  files: Record<string, ProductFile[]>
  total_files: number
}

// ========== HOOK: useProducts (Paginated) ==========

interface UseProductsOptions {
  pageSize?: number
  autoLoad?: boolean
}

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  totalLoaded: number
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  reset: () => void
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const { pageSize = 20, autoLoad = true } = options
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [nextOffset, setNextOffset] = useState<string | null>(null)
  
  const { user } = useAuthStore()
  const lastUserIdRef = useRef<string | null>(null)

  const fetchProducts = useCallback(async (offset?: string, isLoadMore = false) => {
    if (!user?.uid) return
    
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError(null)
    
    try {
      const token = await user.getIdToken()
      
      // Build URL with pagination params
      const params = new URLSearchParams()
      params.append('limit', pageSize.toString())
      if (offset) params.append('offset', offset)
      
      const response = await fetch(`/api/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // Auth-scoped data must never be reused across users.
        cache: 'no-store'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Handle both old format (array or {products: []}) and new paginated format
      let productsList: Product[]
      let pagination: PaginationInfo | undefined
      
      if (data.pagination) {
        // New paginated response
        productsList = data.products || []
        pagination = data.pagination
      } else {
        // Old format - backwards compatible
        productsList = data.products || (Array.isArray(data) ? data : [])
        pagination = undefined
      }
      
      if (isLoadMore) {
        // Append to existing products
        setProducts(prev => [...prev, ...productsList])
      } else {
        // Replace products (first load or refresh)
        setProducts(productsList)
      }
      
      // Update pagination state
      if (pagination) {
        setHasMore(pagination.has_more)
        setNextOffset(pagination.next_offset)
      } else {
        // Old format - assume no more if we got less than page size
        setHasMore(productsList.length >= pageSize)
        setNextOffset(null)
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch products'
      setError(errorMsg)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [user, pageSize])

  // Load more products
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return
    await fetchProducts(nextOffset || undefined, true)
  }, [fetchProducts, hasMore, loadingMore, loading, nextOffset])

  // Refresh (reload from start)
  const refresh = useCallback(async () => {
    setNextOffset(null)
    setHasMore(true)
    await fetchProducts(undefined, false)
  }, [fetchProducts])

  // Reset state
  const reset = useCallback(() => {
    setProducts([])
    setLoading(false)
    setLoadingMore(false)
    setError(null)
    setHasMore(true)
    setNextOffset(null)
  }, [])

  // Reset + refetch when the authenticated user changes (prevents cross-account stale UI).
  useEffect(() => {
    const currentUid = user?.uid ?? null
    if (lastUserIdRef.current !== currentUid) {
      lastUserIdRef.current = currentUid
      reset()
      if (autoLoad && user) {
        fetchProducts()
      }
    }
  }, [user?.uid, autoLoad, user, fetchProducts, reset])

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad && user) {
      fetchProducts()
    }
  }, [autoLoad, user, fetchProducts])

  return {
    products,
    loading,
    loadingMore,
    error,
    hasMore,
    totalLoaded: products.length,
    loadMore,
    refresh,
    reset
  }
}

// ========== HOOK: useProductFiles (Lazy Loading) ==========

interface UseProductFilesReturn {
  files: Record<string, ProductFile[]> | null
  loading: boolean
  error: string | null
  fetchFiles: () => Promise<void>
  reset: () => void
}

export function useProductFiles(productId: string | null): UseProductFilesReturn {
  const [files, setFiles] = useState<Record<string, ProductFile[]> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { user } = useAuthStore()
  const lastUserIdRef = useRef<string | null>(null)

  const fetchFiles = useCallback(async () => {
    if (!user?.uid || !productId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const token = await user.getIdToken()
      
      const response = await fetch(`/api/product/${productId}/files`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product files: ${response.status}`)
      }
      
      const data = await response.json()
      setFiles(data.files || {})
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch files'
      setError(errorMsg)
      console.error('Error fetching product files:', err)
    } finally {
      setLoading(false)
    }
  }, [user, productId])

  const reset = useCallback(() => {
    setFiles(null)
    setLoading(false)
    setError(null)
  }, [])

  // Reset when product changes
  useEffect(() => {
    reset()
  }, [productId, reset])

  // Reset when user changes
  useEffect(() => {
    const currentUid = user?.uid ?? null
    if (lastUserIdRef.current !== currentUid) {
      lastUserIdRef.current = currentUid
      reset()
    }
  }, [user?.uid, reset])

  return {
    files,
    loading,
    error,
    fetchFiles,
    reset
  }
}

// ========== HOOK: useProduct (Single Product with Optional Files) ==========

interface UseProductOptions {
  includeFiles?: boolean
}

interface UseProductReturn {
  product: Product | null
  files: Record<string, ProductFile[]> | null
  loading: boolean
  filesLoading: boolean
  error: string | null
  fetchProduct: () => Promise<void>
  fetchFiles: () => Promise<void>
  reset: () => void
}

export function useProduct(productId: string | null, options: UseProductOptions = {}): UseProductReturn {
  const { includeFiles = false } = options
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { user } = useAuthStore()
  const productFiles = useProductFiles(productId)

  const fetchProduct = useCallback(async () => {
    if (!user?.uid || !productId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const token = await user.getIdToken()
      
      // Optionally include files in the request
      const url = includeFiles 
        ? `/api/product/${productId}?include_files=true`
        : `/api/product/${productId}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`)
      }
      
      const data = await response.json()
      setProduct(data)
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch product'
      setError(errorMsg)
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }, [user, productId, includeFiles])

  const reset = useCallback(() => {
    setProduct(null)
    setLoading(false)
    setError(null)
    productFiles.reset()
  }, [productFiles])

  // Reset when product ID changes
  useEffect(() => {
    // If user logs out or changes, clear local state immediately.
    if (!user?.uid) {
      reset()
      return
    }

    if (productId) {
      fetchProduct()
    } else {
      reset()
    }
  }, [productId, user?.uid, includeFiles, fetchProduct, reset])

  return {
    product,
    files: productFiles.files,
    loading,
    filesLoading: productFiles.loading,
    error: error || productFiles.error,
    fetchProduct,
    fetchFiles: productFiles.fetchFiles,
    reset
  }
}
