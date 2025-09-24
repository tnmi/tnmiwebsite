"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
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
    <div className="space-y-4 sm:space-y-6 font-satoshi px-4 sm:px-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-tn-primary-blue/20 via-tn-deep-blue/20 to-tn-dark-bg/20 text-white backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-light tracking-wide text-white">Market Insights</CardTitle>
              <p className="text-white/80 font-light tracking-wide text-sm sm:text-base">Comprehensive market research analytics</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-xl border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 text-gray-700">Overview</TabsTrigger>
          <TabsTrigger value="start-research" className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 text-gray-700">Start Research</TabsTrigger>
        </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">

            {/* Recent Research Requests */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-500 shadow-xl hover:shadow-2xl">
              <CardHeader>
                <CardTitle className="text-gray-900 font-medium tracking-wide">Recent Research Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mr-2 text-gray-700" />
                    <span className="text-gray-700">Loading research requests...</span>
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-8 text-red-600">
                    <p>Failed to load research requests: {ordersError}</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.order_id} className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/30 transition-all duration-200">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-medium text-gray-900 tracking-wide drop-shadow-sm">{order.product_id}</p>
                            <p className="text-sm text-gray-700 font-light tracking-wide drop-shadow-sm">Request ID: {order.order_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <span className="text-sm text-gray-700 font-light tracking-wide drop-shadow-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-700">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-light tracking-wide">No research requests found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Start Research Tab */}
          <TabsContent value="start-research" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-500 shadow-xl hover:shadow-2xl">
              <CardHeader>
                <CardTitle className="text-gray-900 font-medium tracking-wide">Initiate New Market Research</CardTitle>
                <CardDescription className="text-gray-700 font-light tracking-wide">
                  Select a product from your inventory to begin a new market research analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2 tracking-wide">Select Product</label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-gray-900 hover:bg-white/30 transition-colors">
                      <SelectValue placeholder={`Choose a product to research (${availableProducts.length} available)`} className="text-gray-600" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50">
                      {availableProducts && Array.isArray(availableProducts) && availableProducts.length > 0 ? (
                        availableProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id} className="text-gray-900 hover:bg-white/50">
                            {product.product_name || 'Unnamed Product'}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-products" disabled className="text-gray-500">
                          No products available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleStartResearch}
                  disabled={!selectedProductId || startResearchLoading}
                  className="w-full bg-gradient-to-r from-tn-primary-blue to-tn-deep-blue hover:from-tn-deep-blue hover:to-tn-primary-blue text-white font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl"
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
                  <p className="text-red-600 text-sm mt-2 font-light tracking-wide">{startResearchError}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
    </div>
  )
}