"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Package, Loader2, RefreshCw, Play, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Product {
  id: string;
  product_name?: string;
}

interface MarketIntelligenceHistory {
  session_id: string;
  created_at: string;
  segment_count: number;
}

interface SourcesPanelProps {
  products: Product[];
  selectedProductId: string | null;
  onProductSelect: (productId: string) => void;
  isLoading?: boolean;
  marketIntelligenceStatus: 'idle' | 'running' | 'completed' | 'error';
  marketPullEnabled: boolean;
  activeJobsCount: number;
  marketIntelligenceHistory?: MarketIntelligenceHistory[];
  selectedHistorySessionId?: string | null;
  onHistorySelect?: (sessionId: string) => void;
  onReset?: () => void;
  onRunAnalysis?: () => void;
  hasData?: boolean;
  // Pagination props
  hasMoreProducts?: boolean;
  onLoadMoreProducts?: () => void;
  loadingMoreProducts?: boolean;
}

export function SourcesPanel({
  products,
  selectedProductId,
  onProductSelect,
  isLoading = false,
  marketIntelligenceStatus,
  marketPullEnabled,
  activeJobsCount,
  marketIntelligenceHistory = [],
  selectedHistorySessionId,
  onHistorySelect,
  onReset,
  onRunAnalysis,
  hasData = false,
  hasMoreProducts = false,
  onLoadMoreProducts,
  loadingMoreProducts = false,
  className
}: SourcesPanelProps & { className?: string }) {
  return (
    <div className={`h-full bg-white/5 backdrop-blur-3xl border-r border-white/10 p-4 shadow-2xl flex flex-col font-satoshi ${className || 'w-64'}`}>
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-xs font-semibold text-white/90 uppercase tracking-wider mb-2 font-satoshi">
          SOURCES
        </h2>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1">
        <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 font-satoshi">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white/95 flex items-center gap-2 font-satoshi">
            <Package className="w-4 h-4 text-white/80" />
            Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedProductId || undefined}
            onValueChange={onProductSelect}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white/10 backdrop-blur-2xl border-white/20 text-white hover:bg-white/15 transition-colors">
              <SelectValue placeholder={isLoading ? "Loading products..." : "Select a product..."} />
            </SelectTrigger>
            <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-white/60 mr-2" />
                  <span className="text-white/60 text-sm">Loading products...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="py-4 text-center text-white/60 text-sm">
                  No products available
                </div>
              ) : (
                <>
                  {products.map((product) => (
                    <SelectItem
                      key={product.id}
                      value={product.id}
                      className="text-white hover:bg-white/20 focus:bg-white/20"
                    >
                      {product.product_name || 'Unnamed Product'}
                    </SelectItem>
                  ))}
                  {hasMoreProducts && onLoadMoreProducts && (
                    <div 
                      className="py-2 px-3 text-center cursor-pointer hover:bg-white/10 text-white/70 text-sm border-t border-white/10"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onLoadMoreProducts()
                      }}
                    >
                      {loadingMoreProducts ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Loading more...</span>
                        </div>
                      ) : (
                        'Load more products...'
                      )}
                    </div>
                  )}
                </>
              )}
            </SelectContent>
          </Select>
        </CardContent>
        </Card>

        {/* AI Agents Section */}
        <div>
          <h2 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3 px-2 font-satoshi">
            AI AGENTS
          </h2>
        </div>

        {/* Market Intelligence Agent */}
        <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white">
            Market Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {marketIntelligenceStatus === 'running' && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-blue-300" />
              <Badge className="bg-blue-500/30 text-blue-100 border-blue-400/30 backdrop-blur-sm">
                Running
              </Badge>
            </div>
          )}
          {marketIntelligenceStatus === 'error' && (
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500/30 text-red-100 border-red-400/30 backdrop-blur-sm">
                Error
              </Badge>
            </div>
          )}
          <p className="text-xs text-white/70">
            Analyzes market segments
          </p>
          
          {/* History Dropdown */}
          {marketIntelligenceHistory.length > 0 && (
            <div className="mt-3">
              <Select
                value={selectedHistorySessionId || undefined}
                onValueChange={onHistorySelect}
              >
                <SelectTrigger className="bg-white/5 backdrop-blur-md border-white/10 text-white hover:bg-white/10 transition-colors text-xs h-9">
                  <div className="flex items-center gap-2">
                    <History className="w-3 h-3 text-white/70" />
                    <SelectValue placeholder="Select analysis run..." />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-900/90 backdrop-blur-xl border-white/20">
                  {marketIntelligenceHistory.map((item, index) => {
                    const date = new Date(item.created_at);
                    const timeAgo = formatTimeAgo(date);
                    
                    return (
                      <SelectItem
                        key={item.session_id}
                        value={item.session_id}
                        className="text-white hover:bg-white/20 focus:bg-white/20 text-xs"
                      >
                        <div className="flex flex-col py-0.5">
                          <span className="font-medium text-xs">
                            {timeAgo}
                          </span>
                          <span className="text-[10px] text-white/60 mt-0.5">
                            {date.toLocaleDateString()} • {item.segment_count} segments
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Run/Re-run Analysis Button */}
          {selectedProductId && onRunAnalysis && (
            <Button
              onClick={onRunAnalysis}
              disabled={marketIntelligenceStatus === 'running'}
              className="w-full mt-3 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white disabled:opacity-50 shadow-lg text-xs relative overflow-hidden group"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#3A29FF]/30 to-[#FF3232]/30 group-hover:from-[#3A29FF]/40 group-hover:to-[#FF3232]/40 transition-all" />
              {marketIntelligenceStatus === 'running' ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-2 animate-spin relative z-10" />
                  <span className="relative z-10">Analyzing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-2 relative z-10" />
                  <span className="relative z-10">{hasData ? 'Re-run Analysis' : 'Run Analysis'}</span>
                </>
              )}
            </Button>
          )}
        </CardContent>
        </Card>

        {/* Market Pull Agent */}
        <Card className={`bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl transition-all duration-300 ${
          marketPullEnabled ? 'hover:shadow-2xl hover:bg-white/15' : 'opacity-50'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white">
              Market Pull
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marketPullEnabled ? (
              <>
                {activeJobsCount > 0 && (
                  <p className="text-xs text-white/70">
                    {activeJobsCount} active job{activeJobsCount !== 1 ? 's' : ''}
                  </p>
                )}
                <p className="text-xs text-white/70 mt-2">
                  Deep-dives into segments
                </p>
              </>
            ) : (
              <p className="text-xs text-white/70">
                Run Market Intelligence first to unlock segment analysis
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer - fixed at bottom */}
      <div className="flex-shrink-0 pt-4 text-xs text-white/70 font-medium border-t border-white/10">
        <p className="mb-3">
          {products.length} product{products.length !== 1 ? 's' : ''} loaded
          {hasMoreProducts && ' (more available)'}
        </p>
      </div>
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

