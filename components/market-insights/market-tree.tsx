"use client"

import { FlowTree } from "./flow-tree"
import { TreeNodeData } from "./tree-node"
import { Loader2, BarChart3, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MarketTreeProps {
  treeData: TreeNodeData | null;
  isLoading?: boolean;
  hasProductSelected?: boolean;
  selectedProductName?: string;
  onNodeClick: (nodeId: string) => void;
  onRunAnalysis?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function MarketTree({ 
  treeData, 
  isLoading, 
  hasProductSelected,
  selectedProductName,
  onNodeClick,
  onRunAnalysis,
  onRefresh,
  isRefreshing
}: MarketTreeProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white/[0.02] backdrop-blur-[40px] font-satoshi" style={{
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white font-medium text-lg">Analyzing market segments...</p>
          <p className="text-white/70 text-sm mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  // Show "Get Started" when product is selected but no tree data
  if (hasProductSelected && !treeData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white/[0.02] backdrop-blur-[40px]" style={{
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      }}>
        <div className="text-center max-w-2xl px-8">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-white/[0.08] backdrop-blur-[30px] rounded-2xl flex items-center justify-center mx-auto border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]" style={{
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            }}>
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-[#FF94B4]/30 rounded-full opacity-50 blur-xl"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">
            Ready to Analyze {selectedProductName}
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Run Market Intelligence to discover market segments, identify opportunities, 
            and gain insights into your product's potential markets.
          </p>

          <div className="flex flex-col items-center gap-4">
            {onRunAnalysis && (
              <Button 
                onClick={onRunAnalysis}
                size="lg"
                className="bg-gradient-to-r from-[#3A29FF] to-[#FF3232] hover:from-[#3A29FF]/90 hover:to-[#FF3232]/90 text-white px-8 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all"
              >
                <Play className="w-5 h-5 mr-2" />
                Run Market Intelligence
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show "Select Product" when no product is selected
  if (!hasProductSelected && !treeData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white/[0.02] backdrop-blur-[40px]" style={{
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      }}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-white/[0.08] backdrop-blur-[30px] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/[0.15] shadow-xl" style={{
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          }}>
            <BarChart3 className="w-10 h-10 text-white/80" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">Select a Product</h3>
          <p className="text-white/70 leading-relaxed">
            Choose a product from the Sources panel to begin market analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden font-satoshi" style={{
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // 80% transparent
    }}>
      <FlowTree 
        treeData={treeData} 
        onNodeClick={onNodeClick} 
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
    </div>
  );
}

