"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuthStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { useMarketIntelligence } from "@/hooks/use-market-intelligence"
import { useMarketPull } from "@/hooks/use-market-pull"
import { marketIntelligenceAPI } from "@/lib/market-intelligence-api"
import { SourcesPanel } from "@/components/market-insights/sources-panel"
import { MarketTree } from "@/components/market-insights/market-tree"
import { SegmentDetailsPanel } from "@/components/market-insights/segment-details-panel"
import { TreeNodeData } from "@/components/market-insights/tree-node"
import { Button } from "@/components/ui/button"
import { Play, LayoutList } from "lucide-react"
import { useSidebar } from "@/hooks/use-sidebar"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import dynamic from 'next/dynamic'

// Lazy load LightRays to prevent SSR issues
const LightRays = dynamic(
  () => import('@/components/ui/LightRays'),
  { ssr: false }
)

interface Product {
  id: string;
  product_name: string;
}

export default function MarketInsightsPage() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black font-satoshi">
      {/* Background Light Rays */}
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ff88"
          raysSpeed={1.0}
          lightSpread={0.8}
          rayLength={0.5}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </div>
      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        <MarketInsightsContent />
      </div>
    </div>
  )
}

// Helper to safely extract segments from various API response structures
const extractSegments = (data: any): any[] => {
  if (!data || !data.market_segments) return [];
  
  // Case 1: Direct array
  if (Array.isArray(data.market_segments)) {
    return data.market_segments;
  }
  
  // Case 2: Nested object
  if (typeof data.market_segments === 'object') {
    // Check for 'market_segments' key
    if (Array.isArray(data.market_segments.market_segments)) {
      return data.market_segments.market_segments;
    }
    // Check for 'segments' key (common alternative)
    if (Array.isArray(data.market_segments.segments)) {
      return data.market_segments.segments;
    }
    // Check if values are the segments (if it's a map)
    const values = Object.values(data.market_segments);
    if (values.length > 0) {
      // Filter for objects that look like segments (have a 'name' property or are just non-null objects)
      // Relaxed check: just needs to be an object with at least one key
      const potentialSegments = values.filter(v => typeof v === 'object' && v !== null);
      if (potentialSegments.length > 0) {
         return potentialSegments;
      }
    }
  }
  
  return [];
};

function MarketInsightsContent() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  
  // State
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [treeData, setTreeData] = useState<TreeNodeData | null>(null)
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [panelViewMode, setPanelViewMode] = useState<'details' | 'analysis'>('details')
  const [productsLoading, setProductsLoading] = useState(true)
  const [jobHistory, setJobHistory] = useState<any[]>([])
  const [marketIntelligenceHistory, setMarketIntelligenceHistory] = useState<any[]>([])
  const [selectedHistorySessionId, setSelectedHistorySessionId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // API Hooks
  const marketIntelligence = useMarketIntelligence()
  const marketPull = useMarketPull()

  // Helper function to fetch Market Intelligence history
  const fetchMarketIntelligenceHistory = async () => {
    if (!user?.uid || !selectedProductId) return;
    
    try {
      const history = await marketIntelligenceAPI.getMarketIntelligenceHistory(user.uid, selectedProductId);
      const historyItems: any[] = [];
      
      // Always include current analysis if it exists
      if (marketIntelligence.data) {
        historyItems.push({
          session_id: marketIntelligence.data.session_id,
          product_id: selectedProductId,
          created_at: marketIntelligence.data.metadata?.completed_at || new Date().toISOString(),
          // Helper to safely get segments count
          segment_count: extractSegments(marketIntelligence.data).length,
          data: marketIntelligence.data,
        });
      }
      
      // Add historical analyses from API (using history.history, not history.analyses)
      if (history.history && history.history.length > 0) {
        // Convert API format to our format and filter duplicates
        const historicalItems = history.history
          .filter((item: any) => !marketIntelligence.data || item.session_id !== marketIntelligence.data.session_id)
          .map((item: any) => ({
            session_id: item.session_id,
            product_id: selectedProductId,
            created_at: item.created_at,
            segment_count: extractSegments(item.output).length,
            data: item.output,
          }));
        historyItems.push(...historicalItems);
      }
      
      // Sort by most recent first (descending order)
      historyItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setMarketIntelligenceHistory(historyItems);
      
      if (historyItems.length > 0) {
        // Auto-load latest if nothing is currently loaded
        if (!marketIntelligence.data && historyItems[0].data) {
          marketIntelligence.loadCached(historyItems[0].data);
          setSelectedHistorySessionId(historyItems[0].session_id);
          
          toast({
            title: "Analysis Loaded",
            description: "Most recent analysis loaded automatically."
          });
        } else if (marketIntelligence.data && marketIntelligence.data.session_id) {
          // If data IS loaded, select the corresponding session ID
          setSelectedHistorySessionId(marketIntelligence.data.session_id);
        } else {
          // Fallback to first item
          setSelectedHistorySessionId(historyItems[0].session_id);
        }
      }
    } catch (err) {
      // Even on error, include current analysis if available
      if (marketIntelligence.data) {
        const fallbackItem = {
          session_id: marketIntelligence.data.session_id,
          product_id: selectedProductId,
          created_at: marketIntelligence.data.metadata?.completed_at || new Date().toISOString(),
          segment_count: extractSegments(marketIntelligence.data).length,
          data: marketIntelligence.data,
        };
        setMarketIntelligenceHistory([fallbackItem]);
        setSelectedHistorySessionId(fallbackItem.session_id);
      } else {
        setMarketIntelligenceHistory([]);
      }
    }
  };

  // Fetch products
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
          const data = await response.json()
          // Check if data.products exists, otherwise fallback to data if it's an array
          const productsList = data.products || (Array.isArray(data) ? data : [])
          setProducts(productsList)
          
          // Auto-load last selected product
          const lastProductId = localStorage.getItem(`mi_last_product_${user.uid}`)
          if (lastProductId && !selectedProductId && productsList.find((p: Product) => p.id === lastProductId)) {
            handleProductSelect(lastProductId)
          }
        } else {
          throw new Error(`Failed to fetch products: ${response.status}`)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setProductsLoading(false)
      }
    }

      fetchProducts()
  }, [user])

  // Check for cached Market Intelligence results when product is selected
  useEffect(() => {
    if (selectedProductId && user?.uid) {
      const cacheKey = `mi_${user.uid}_${selectedProductId}`
      const cached = localStorage.getItem(cacheKey)
      
      if (cached) {
        try {
          const cachedData = JSON.parse(cached)
          const cacheAge = Date.now() - cachedData.timestamp
          const maxAge = 24 * 60 * 60 * 1000 // 24 hours
          
          // Use cached data if less than 24 hours old
          if (cacheAge < maxAge) {
            // Load cached data into the hook
            marketIntelligence.loadCached(cachedData.data)
            
      toast({
              title: "Previous Analysis Loaded",
              description: `Using cached results from ${new Date(cachedData.timestamp).toLocaleString()}`,
            })
          } else {
            // Clear old cache
            localStorage.removeItem(cacheKey)
          }
        } catch (err) {
          console.error('Failed to load cached results:', err)
          localStorage.removeItem(cacheKey)
        }
      }
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId, user?.uid])

  // Fetch history when product is selected, or market intelligence data changes
  useEffect(() => {
    if (selectedProductId && user?.uid) {
      fetchMarketIntelligenceHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId, user?.uid, marketIntelligence.data])

  // Update selected product and set product ID for market pull filtering
  useEffect(() => {
    if (selectedProductId) {
      const product = products.find(p => p.id === selectedProductId)
      setSelectedProduct(product || null)
      marketPull.setProductId(selectedProductId)
    } else {
      setSelectedProduct(null)
      marketPull.setProductId(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId, products]) // Removed marketPull from dependencies

  // Update job history from active jobs and completed jobs
  useEffect(() => {
    const history: any[] = [];
    
    // Add active jobs
    marketPull.activeJobs.forEach((job, segmentName) => {
      history.push({
        job_id: job.jobId,
        segment_name: segmentName,
        product_name: selectedProduct?.product_name || '',
        status: job.status,
        started_at: job.startedAt,
        completed_at: undefined,
      });
    });
    
    // Add completed jobs from jobResults
    marketPull.jobResults.forEach((result, segmentName) => {
      // Only add if not already in active jobs
      if (!marketPull.activeJobs.has(segmentName)) {
        history.push({
          job_id: result.job_id,
          segment_name: segmentName,
          product_name: selectedProduct?.product_name || '',
          status: result.status,
          started_at: result.started_at,
          completed_at: result.completed_at,
        });
      }
    });
    
    // Sort by most recent first
    history.sort((a, b) => {
      const aTime = new Date(a.completed_at || a.started_at).getTime();
      const bTime = new Date(b.completed_at || b.started_at).getTime();
      return bTime - aTime;
    });
    
    setJobHistory(history);
  }, [marketPull.activeJobs, marketPull.jobResults, selectedProduct])

    // Build tree data when market intelligence data or market pull jobs change
    // Also refresh every second to update elapsed time for running jobs
    useEffect(() => {
    const buildTree = () => {
      
      if (selectedProduct) {
        // If we have market intelligence data, show full tree
        if (marketIntelligence.data) {
          
          const segments = extractSegments(marketIntelligence.data);
          
          const treeNode: TreeNodeData = {
            id: selectedProduct.id,
            type: 'product',
            label: selectedProduct.product_name,
            description: `${segments.length} market segments identified`,
            hasData: true, // We have data
            children: segments.map((segment) => {
            const jobStatus = marketPull.getJobStatus(segment.name)
            const jobResult = marketPull.getJobResult(segment.name)
            
            // Calculate elapsed time for running jobs
            let elapsedTime = '';
            if (jobStatus?.status === 'running' && jobStatus.startedAt) {
              const startTime = new Date(jobStatus.startedAt).getTime();
              const now = Date.now();
              const seconds = Math.floor((now - startTime) / 1000);
              const minutes = Math.floor(seconds / 60);
              const remainingSeconds = seconds % 60;
              elapsedTime = minutes > 0 
                ? `${minutes}m ${remainingSeconds}s` 
                : `${seconds}s`;
            }
            
              // Build children based on job status
            let children: TreeNodeData[] | undefined = undefined;
            
            // Check if there are completed versions (we'll need to get count from API later)
            const hasCompletedVersions = jobResult?.status === 'completed';
            const completedVersionsCount = hasCompletedVersions ? 1 : 0; // TODO: Get actual count from API
            
            if (jobStatus?.status === 'running') {
              // Show running analysis node (clickable to view partial results)
              children = [{
                id: `${segment.name}-running`,
                type: 'result',
                label: `Deep analysis into ${segment.name} (${elapsedTime})`,
                description: 'Market Pull analysis in progress - Click to view partial results',
                status: 'running',
                progress: jobStatus.progress,
                onClick: () => {
                  setSelectedSegment(segment.name);
                  setPanelViewMode('analysis');
                }
              }];
              
              // If there are completed versions, add a second node for them
              if (hasCompletedVersions) {
                children.push({
                  id: `${segment.name}-result`,
                  type: 'result',
                  label: `Analysis Complete`,
                  description: 'Click to view results',
                  status: 'completed',
                  onClick: () => {
                    setSelectedSegment(segment.name);
                    setPanelViewMode('analysis');
                  }
                });
              }
            } else if (jobStatus?.status === 'failed') {
              // Show failed node
              children = [{
                id: `${segment.name}-failed`,
                type: 'result',
                label: 'Analysis Failed',
                description: 'An error occurred during analysis',
                status: 'failed',
                // Make sure failed nodes are visible in tree
                children: [] 
              }];
              
              // If there are completed versions, still show them
              if (hasCompletedVersions) {
                children.push({
                  id: `${segment.name}-result`,
                  type: 'result',
                  label: `Analysis Complete`,
                  description: 'Click to view results',
                  status: 'completed',
                  onClick: () => {
                    setSelectedSegment(segment.name);
                    setPanelViewMode('analysis');
                  }
                });
              }
            } else if (hasCompletedVersions) {
              // Only completed versions, no running job
              children = [{
                id: `${segment.name}-result`,
                type: 'result',
                label: `Analysis Complete`,
                description: 'Click to view results',
                status: 'completed',
                onClick: () => {
                  setSelectedSegment(segment.name);
                  setPanelViewMode('analysis');
                }
              }];
            }
            
            const segmentNode: TreeNodeData = {
              id: segment.name,
              type: 'segment',
              label: segment.name,
              description: segment.description,
              share_pct: segment.share_pct,
              status: startingSegments.has(segment.name) ? 'running' : (jobStatus?.status || 'idle'), // Show as running if being started
              progress: jobStatus?.progress,
              // Clicking node opens details
              onClick: () => {
                setSelectedSegment(segment.name);
                setPanelViewMode('details');
              },
              // Analyze button starts market pull
              onAnalyze: () => handleStartMarketPull(segment.name), 
              children
            }
            return segmentNode
          })
        }
        setTreeData(treeNode)
      } else {
        // No data yet - show product node with Run Market Intelligence button or analyzing state
        const treeNode: TreeNodeData = {
          id: selectedProduct.id,
          type: 'product',
          label: selectedProduct.product_name,
          description: 'Run Market Intelligence to identify market segments',
          hasData: false, // No data yet
          status: marketIntelligence.loading ? 'running' : 'idle', // Show analyzing state if loading
          onRunIntelligence: handleRunIntelligence, // Pass the function to run MI
        }
        setTreeData(treeNode)
      }
    } else {
      setTreeData(null)
    }
    };

    buildTree();
    
    // Remove auto-refresh polling completely as requested
    /* 
    const interval = setInterval(() => {
      if (marketPull.activeJobs.size > 0) {
        buildTree();
      }
    }, 15000);

    return () => clearInterval(interval); 
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketIntelligence.data, marketIntelligence.loading, selectedProduct, marketPull.activeJobs, marketPull.jobResults])

  // Handle running market intelligence
  const handleRunIntelligence = async () => {
    if (!selectedProductId) {
      toast({
        title: "No Product Selected",
        description: "Please select a product first",
        variant: "destructive"
      })
      return
    }

    try {
      const result = await marketIntelligence.analyze(selectedProductId)
      
      // Cache the results
      if (user?.uid) {
        const cacheKey = `mi_${user.uid}_${selectedProductId}`
        const cacheData = {
          data: result,
          timestamp: Date.now(),
          productId: selectedProductId
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))
      }
      
      toast({
        title: "Analysis Complete",
        description: "Market segments have been identified"
      })
      
      // Fetch history after analysis completes
      fetchMarketIntelligenceHistory();
    } catch (err) {
      toast({
        title: "Analysis Failed",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive"
      })
    }
  }

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    // Clear previous analysis when changing products
    setTreeData(null)
    marketIntelligence.reset()
    marketPull.reset()
    marketPull.setProductId(productId) // Set the product ID for filtering jobs
    setSelectedProductId(productId)
    
    // Save last used product
    if (user?.uid) {
      localStorage.setItem(`mi_last_product_${user.uid}`, productId)
    }
  }

  // Handle node click (both segment click to start market pull, and result click to view details)
  const handleNodeClick = async (nodeId: string) => {
    if (!selectedProduct || !marketIntelligence.data) return

    // Check if it's a versions node
    if (nodeId.endsWith('-versions')) {
      const segmentName = nodeId.replace('-versions', '')
      // TODO: In the future, show a version selector modal here
      // For now, just show the latest version
      setSelectedSegment(segmentName)
      return
    }

    // Check if it's a result node (ends with "-result")
    if (nodeId.endsWith('-result')) {
      const segmentName = nodeId.replace('-result', '')
      setSelectedSegment(segmentName)
      setPanelViewMode('analysis')
      return
    }
    
    // Check if it's a running node (show details of running job with partial results)
    if (nodeId.endsWith('-running')) {
      const segmentName = nodeId.replace('-running', '')

      await marketPull.refreshJobStatus(segmentName);
      
      setSelectedSegment(segmentName)
      setPanelViewMode('analysis')
      return
    }

    // Otherwise, it's a segment node - just select it (don't auto-start)
    // Helper to safely find a segment
    const findSegment = (data: any, name: string) => {
      const segments = extractSegments(data);
      return segments.find(s => s.name === name);
    };

    const segment = findSegment(marketIntelligence.data, nodeId);
    
    if (!segment) return

    // Just select the segment, let the Analyze button in the node trigger the job
    setSelectedSegment(nodeId)
    setPanelViewMode('details')
  }

  // Track segments that are currently being started (to prevent double-clicks)
  const [startingSegments, setStartingSegments] = useState<Set<string>>(new Set())

  // Handle starting market pull analysis (triggered by Analyze button)
  const handleStartMarketPull = async (segmentName: string) => {
    if (!selectedProduct || !marketIntelligence.data) return

    // Prevent double-clicks
    if (startingSegments.has(segmentName)) {
      return
    }

    // Helper to safely find a segment
    const findSegmentForStart = (data: any, name: string) => {
      const segments = extractSegments(data);
      return segments.find(s => s.name === name);
    };

    const segment = findSegmentForStart(marketIntelligence.data, segmentName);
    
    if (!segment) return

    const existingJob = marketPull.getJobStatus(segmentName)
    if (existingJob && existingJob.status === 'running') {
      toast({
        title: "Job Already Running",
        description: `Market pull for "${segmentName}" is already in progress`,
        variant: "destructive"
      })
      return
    }

    try {
      // Mark as starting
      setStartingSegments(prev => new Set(prev).add(segmentName))

      await marketPull.startPull(
        segmentName,
        selectedProduct.product_name,
        selectedProduct.id,
        segmentName // Using segment name as industry for now
      )

      toast({
        title: "Market Pull Started",
        description: `Analyzing "${segmentName}"...`
      })
    } catch (err) {
      toast({
        title: "Failed to Start Analysis",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive"
      })
    } finally {
      // Remove from starting set after a delay
      setTimeout(() => {
        setStartingSegments(prev => {
          const newSet = new Set(prev)
          newSet.delete(segmentName)
          return newSet
        })
      }, 2000) // Wait 2 seconds before allowing another click
    }
  }

  // Handle reset
  const handleReset = () => {
    setTreeData(null)
    marketIntelligence.reset()
    setMarketIntelligenceHistory([])
    setSelectedHistorySessionId(null)
    if (user?.uid && selectedProductId) {
      const cacheKey = `mi_${user.uid}_${selectedProductId}`
      localStorage.removeItem(cacheKey)
    }
  }

  // Handle history selection
  const handleHistorySelect = async (sessionId: string) => {
    setSelectedHistorySessionId(sessionId);
    
    // Find the history item
    const historyItem = marketIntelligenceHistory.find(h => h.session_id === sessionId);
    
    if (historyItem && historyItem.data) {
      // Load the historical data (this will trigger tree rebuild via useEffect)
      marketIntelligence.loadCached(historyItem.data);
      
      toast({
        title: "Historical Analysis Loaded",
        description: `Viewing analysis from ${new Date(historyItem.created_at).toLocaleString()} (${historyItem.segment_count} segments)`,
      });
    } else {
      console.error('[History Select] No data found for session:', sessionId);
    }
  }

  // Get market intelligence status
  const getIntelligenceStatus = () => {
    if (marketIntelligence.loading) return 'running'
    if (marketIntelligence.error) return 'error'
    if (marketIntelligence.data) return 'completed'
    return 'idle'
  }

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await marketPull.refreshAllJobs()
      toast({
        title: "Refreshed",
        description: "Job statuses updated successfully"
      })
    } catch (err) {
      console.error('Failed to refresh:', err)
      toast({
        title: "Refresh Failed",
        description: "Failed to update job statuses",
        variant: "destructive"
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const { isMobile } = useSidebar()

  // Derive selected segment data for the panel
  const selectedSegmentData = useMemo(() => {
    if (!marketIntelligence.data || !selectedSegment) return undefined
    
    const segments = extractSegments(marketIntelligence.data);
    return segments.find(s => s.name === selectedSegment)
  }, [marketIntelligence.data, selectedSegment])

  // Derive product data for the panel
  const selectedProductData = useMemo(() => {
    if (!marketIntelligence.data) return undefined
    return {
      pricing: {
        min_usd: marketIntelligence.data.pricing_data?.min_usd_per_unit,
        max_usd: marketIntelligence.data.pricing_data?.max_usd_per_unit,
        unit: marketIntelligence.data.pricing_data?.unit,
        time_series: marketIntelligence.data.pricing_data?.time_series,
        data_quality: marketIntelligence.data.pricing_data?.data_quality,
      },
      materials: {
        technical_properties: marketIntelligence.data.materials_passport?.technical_properties
      }
    }
  }, [marketIntelligence.data])

  // Prepare SVG tree component by grouping by levels
  const processedTreeData = useMemo(() => {
    if (!treeData) return null
    
    // Helper to add x, y coordinates for rendering
    const assignCoordinates = (node: TreeNodeData, level: number, index: number): any => {
      return {
        ...node,
        level,
        index,
        children: node.children?.map((child, idx) => assignCoordinates(child, level + 1, idx))
      }
    }
    
    const processed = assignCoordinates(treeData, 0, 0);

    if (processed.children && processed.children.length > 0) {
      processed.children.forEach((child: any) => {
        if (child.children && child.children.length > 0) {
          child.children.forEach((grandChild: any) => {
          });
        }
      });
    }
    
    return processed;
  }, [treeData])

  return (
    <div className="h-full flex flex-col">
      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sources Panel Trigger - positioned to the left of the global menu button */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-4 right-16 z-50 bg-black/50 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
              >
                <LayoutList className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80 bg-transparent border-none">
              <VisuallyHidden>
                <SheetTitle>Sources Panel</SheetTitle>
                <SheetDescription>List of products and market intelligence history</SheetDescription>
              </VisuallyHidden>
              <SourcesPanel
                products={products}
                selectedProductId={selectedProductId}
                onProductSelect={handleProductSelect}
                isLoading={productsLoading}
                marketIntelligenceStatus={getIntelligenceStatus()}
                marketPullEnabled={!!marketIntelligence.data}
                activeJobsCount={marketPull.activeJobsCount}
                marketIntelligenceHistory={marketIntelligenceHistory}
                selectedHistorySessionId={selectedHistorySessionId}
                onHistorySelect={handleHistorySelect}
                onReset={handleReset}
                onRunAnalysis={handleRunIntelligence}
                hasData={!!marketIntelligence.data}
                className="w-full border-r-0"
              />
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop Sources Panel */}
        {!isMobile && (
        <SourcesPanel
          products={products}
          selectedProductId={selectedProductId}
          onProductSelect={handleProductSelect}
          isLoading={productsLoading}
          marketIntelligenceStatus={getIntelligenceStatus()}
          marketPullEnabled={!!marketIntelligence.data}
          activeJobsCount={marketPull.activeJobsCount}
          marketIntelligenceHistory={marketIntelligenceHistory}
          selectedHistorySessionId={selectedHistorySessionId}
          onHistorySelect={handleHistorySelect}
          onReset={handleReset}
          onRunAnalysis={handleRunIntelligence}
          hasData={!!marketIntelligence.data}
        />
        )}

        {/* Market Tree (Center) */}
        <MarketTree
          treeData={processedTreeData}
          isLoading={marketIntelligence.loading && !selectedProductId}
          hasProductSelected={!!selectedProductId}
          selectedProductName={selectedProduct?.product_name}
          onNodeClick={handleNodeClick}
          onRunAnalysis={handleRunIntelligence}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
                    </div>
                    
      {/* Segment Details Modal */}
      {selectedSegment && (
        <SegmentDetailsPanel
          segmentName={selectedSegment}
          segmentData={selectedSegmentData}
          productData={selectedProductData}
          jobResult={marketPull.getJobResult(selectedSegment) || null}
          isRunning={marketPull.getJobStatus(selectedSegment)?.status === 'running'}
          viewMode={panelViewMode} // Pass viewMode state
          onRefresh={async () => {
            await marketPull.refreshJobStatus(selectedSegment);
          }}
          onClose={() => setSelectedSegment(null)}
          onAnalyze={async () => {
            await handleStartMarketPull(selectedSegment);
          }}
        />
      )}
    </div>
  )
}
