"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  Search, 
  Download, 
  TrendingUp, 
  Building2, 
  Globe, 
  Filter,
  Calendar,
  Users,
  Target,
  FileText,
  Eye,
  Share2,
  RefreshCw,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import { useAuthStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { useUserOrders, useOrderStatus, useStartResearch, useHealthCheck } from "@/hooks/use-market-research"

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
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // API hooks
  const { data: orders, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useUserOrders(user?.uid)
  const { data: orderStatus, loading: orderStatusLoading, error: orderStatusError } = useOrderStatus(currentOrderId)
  const { startResearch, loading: startResearchLoading, error: startResearchError } = useStartResearch()
  const { isHealthy, loading: healthLoading } = useHealthCheck()

  // Fetch available products from the existing /api/products endpoint
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.uid) return
      
      try {
        const token = await user.getIdToken()
        const response = await fetch('/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const products = await response.json()
          setAvailableProducts(Array.isArray(products) ? products : [])
        } else {
          console.error('Failed to fetch products:', response.status)
          setAvailableProducts([])
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setAvailableProducts([])
      }
    }

    fetchProducts()
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
      setCurrentOrderId(result.order_id)
      toast({
        title: "Research Started!",
        description: `Order ${result.order_id} initiated. Tracking progress...`,
      })
      refetchOrders() // Refresh the orders list
      setActiveTab("status") // Switch to status tab
    } catch (error) {
      toast({
        title: "Failed to Start Research",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
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

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
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
            <div className="flex items-center space-x-3">
              {/* API Health Indicator */}
              {!healthLoading && (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-500">
                    API {isHealthy ? 'Connected' : 'Offline'}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchOrders()}
                disabled={ordersLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="start-research">Start Research</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="status">Current Status</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {orders.filter(o => o.status === 'completed').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Processing</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {orders.filter(o => o.status === 'processing').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Failed</p>
                      <p className="text-2xl font-bold text-red-600">
                        {orders.filter(o => o.status === 'failed').length}
                      </p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading orders...</span>
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-8 text-red-600">
                    <p>Failed to load orders: {ordersError}</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.order_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-medium text-gray-900">{order.product_id}</p>
                            <p className="text-sm text-gray-500">Order ID: {order.order_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No orders found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Start Research Tab */}
          <TabsContent value="start-research" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Initiate New Market Research</CardTitle>
                <CardContent className="text-gray-600">
                  Select a product from your inventory to begin a new market research analysis.
                </CardContent>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger>
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

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Research Orders</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="Search orders..." 
                      className="w-64" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading orders...</span>
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-8 text-red-600">
                    <p>Failed to load orders: {ordersError}</p>
                    <Button variant="outline" onClick={() => refetchOrders()} className="mt-2">
                      Retry
                    </Button>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div key={order.order_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(order.status)}
                              <h3 className="font-semibold text-gray-900">{order.product_id}</h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                              <span>Order ID: {order.order_id}</span>
                              <span>Created: {new Date(order.created_at).toLocaleDateString()}</span>
                              {order.updated_at && (
                                <span>Updated: {new Date(order.updated_at).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setCurrentOrderId(order.order_id)
                                setActiveTab('status')
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" /> View Status
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No research orders found</p>
                    {searchTerm && <p className="text-sm">Try adjusting your search terms</p>}
                    <Button onClick={() => setActiveTab('start-research')} className="mt-4">
                      Start New Research
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Current Status Tab */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Research Status</CardTitle>
              </CardHeader>
              <CardContent>
                {!currentOrderId ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No active research order selected.</p>
                    <p className="text-sm">Start a new research or select an order from "My Orders" tab.</p>
                    <Button onClick={() => setActiveTab('start-research')} className="mt-4">
                      Start New Research
                    </Button>
                  </div>
                ) : orderStatusLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading order status...</span>
                  </div>
                ) : orderStatusError ? (
                  <div className="text-center py-8 text-red-600">
                    <p>Failed to load status for {currentOrderId}: {orderStatusError}</p>
                    <Button variant="outline" onClick={() => refetchOrders()} className="mt-2">
                      Retry
                    </Button>
                  </div>
                ) : orderStatus ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Order ID: {orderStatus.order_id}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Product: {orders.find(o => o.order_id === orderStatus.order_id)?.product_id || 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(orderStatus.status)}
                        <Badge className={getStatusColor(orderStatus.status)}>
                          {orderStatus.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {orderStatus.status === 'processing' && orderStatus.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{orderStatus.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${orderStatus.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {orderStatus.message && (
                      <p className="text-sm text-gray-700 mt-2 p-3 bg-blue-50 rounded-lg">{orderStatus.message}</p>
                    )}
                    
                    {orderStatus.status === 'completed' && orderStatus.result && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Research Results:</h4>
                        <pre className="text-sm text-green-700 whitespace-pre-wrap break-all max-h-96 overflow-y-auto">
                          {JSON.stringify(orderStatus.result, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {orderStatus.status === 'failed' && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-2">Research Failed:</h4>
                        <p className="text-sm text-red-700">{orderStatus.message || "An error occurred during research."}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No status information available for this order.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}