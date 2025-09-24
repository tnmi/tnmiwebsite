"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  FileText,
  RefreshCw,
  Plus,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import { useAuthStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { useUserOrders, useStartResearch } from "@/hooks/use-market-research"

interface Product {
  id: string;
  product_name: string;
}

export default function MarketInsightsPage() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  // API hooks
  const { data: orders, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useUserOrders(user?.uid)
  const { startResearch, loading: startResearchLoading, error: startResearchError } = useStartResearch()

  // Fetch available products from the existing /api/products endpoint
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.uid) {
        return
      }
      
      try {
        const token = await user.getIdToken()
        const response = await fetch('/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          // Ensure products is always an array (same logic as main dashboard)
          const productsArray = Array.isArray(data) ? data : (data.products || data.data || [])
          setAvailableProducts(productsArray)
        } else {
          const errorText = await response.text()
          console.error('Failed to fetch products:', response.status, errorText)
          setAvailableProducts([])
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setAvailableProducts([])
      }
    }

    if (user) {
      fetchProducts()
    }
  }, [user])

  const handleStartResearch = async () => {
    if (!user?.uid) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a new research order.",
        variant: "destructive"
      })
      return
    }
    if (!selectedProductId) {
      toast({
        title: "Product Not Selected",
        description: "Please select a product to start market research.",
        variant: "destructive"
      })
      return
    }

    try {
      const result = await startResearch(user.uid, selectedProductId)
      toast({
        title: "Research Started!",
        description: `Research request ${result.order_id} initiated successfully.`,
      })
      refetchOrders() // Refresh the orders list
    } catch (error) {
      toast({
        title: "Failed to Start Research",
        description: error instanceof Error ? error.message : "An unexpected error occurred while creating the research order.",
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }


  return (
    <div className="min-h-screen bg-gray-50/50 backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Market Insights</h1>
                <p className="text-sm text-gray-500">Comprehensive market research analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="start-research">Start Research</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">

            {/* Recent Research Requests */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-900">Recent Research Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading research requests...</span>
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-8 text-red-600">
                    <p>Failed to load research requests: {ordersError}</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.order_id} className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-medium text-gray-900">{order.product_id}</p>
                            <p className="text-sm text-gray-600">Request ID: {order.order_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No research requests found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Start Research Tab */}
          <TabsContent value="start-research" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-900">Initiate New Market Research</CardTitle>
                <CardContent className="text-gray-600">
                  Select a product from your inventory to begin a new market research analysis.
                </CardContent>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger className="bg-white/20 border-white/30">
                      <SelectValue placeholder="Choose a product to research" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts && Array.isArray(availableProducts) && availableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.product_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleStartResearch}
                  disabled={!selectedProductId || startResearchLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {startResearchLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Starting Research...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Start Research
                    </>
                  )}
                </Button>
                {startResearchError && (
                  <p className="text-red-600 text-sm mt-2">{startResearchError}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}