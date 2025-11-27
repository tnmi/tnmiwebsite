"use client"

import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TreeNodeData } from './tree-node';
import { Play, CheckCircle, Loader2, XCircle, RefreshCw } from 'lucide-react';
import { useState, useRef } from 'react';

interface FlowTreeProps {
  treeData: TreeNodeData | null;
  onNodeClick: (nodeId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

// Define typed node data interfaces
interface ProductNodeData {
  label: string;
  description?: string;
  status?: string;
  hasData?: boolean;
  onRunIntelligence?: () => void;
  onClick?: () => void;
}

interface SegmentNodeData {
  label: string;
  description?: string;
  status?: string;
  progress?: number;
  share_pct?: number;
  onClick?: () => void;
  onAnalyze?: () => void; // Add this prop
}

interface ResultNodeData {
  label: string;
  description?: string;
  status?: string;
  progress?: number;
  onClick?: () => void;
}

// Custom Product Node Component
function ProductNode({ data }: { data: ProductNodeData }) {
  const hasNoData = !data.hasData;
  const isAnalyzing = data.status === 'running';
  
  return (
    <div className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 min-w-[280px] font-satoshi shadow-xl">
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-400" />
      <div>
        <h3 className="text-lg font-semibold text-white">{data.label}</h3>
        
        {/* Show analyzing state */}
        {isAnalyzing && (
          <div className="mt-3 flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <p className="text-sm text-white font-medium">Analyzing market segments...</p>
            <p className="text-xs text-white/60">This may take a few moments</p>
          </div>
        )}
        
        {/* Show description when not analyzing */}
        {!isAnalyzing && data.description && (
          <p className="text-xs text-white/60 mt-1">{data.description}</p>
        )}
        
        {/* Show Run Market Intelligence button if no data */}
        {hasNoData && data.onRunIntelligence && !isAnalyzing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onRunIntelligence?.();
            }}
            className="w-full mt-3 px-4 py-2 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded backdrop-blur-md flex items-center justify-center gap-2 transition-all relative overflow-hidden group"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#3A29FF]/30 to-[#FF3232]/30 group-hover:from-[#3A29FF]/40 group-hover:to-[#FF3232]/40 transition-all" />
            <Play className="w-3 h-3 relative z-10" />
            <span className="relative z-10">Run Market Intelligence</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Custom Segment Node Component
function SegmentNode({ data }: { data: SegmentNodeData }) {
  const getStatusIcon = () => {
    switch (data.status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Play className="w-3 h-3 text-purple-300" />;
    }
  };

  return (
    <div className="px-5 py-4 rounded-xl bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/15 min-w-[240px] font-satoshi shadow-xl transition-all">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white/50" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white/50" />
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-medium text-white leading-tight">{data.label}</h3>
          {data.share_pct !== undefined && (
            <p className="text-sm text-white/70 mt-1">Market Share: {data.share_pct}%</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {getStatusIcon()}
          {data.status === 'running' && data.progress !== undefined && (
            <span className="text-xs font-semibold text-blue-400">{data.progress}%</span>
          )}
        </div>
      </div>

      {data.status === 'running' && data.progress !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        </div>
      )}

      {data.status === 'idle' && data.onAnalyze && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onAnalyze?.();
          }}
          className="w-full mt-2 px-3 py-1.5 text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border border-purple-500/20 rounded backdrop-blur-md flex items-center justify-center gap-1 transition-all"
        >
          <Play className="w-3 h-3" />
          Analyze
        </button>
      )}
    </div>
  );
}

// Custom Result Node Component
function ResultNode({ data }: { data: ResultNodeData }) {
  const isCompleted = data.status === 'completed';
  const isRunning = data.status === 'running';
  const isFailed = data.status === 'failed';
  const isClickable = isCompleted || isRunning;
  
  let bgColor = 'bg-white/10 border-white/20';
  if (isCompleted) {
    bgColor = 'bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500/30';
  } else if (isRunning) {
    bgColor = 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30';
  } else if (isFailed) {
    bgColor = 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30';
  }

  return (
    <div 
      className={`px-5 py-4 rounded-xl ${bgColor} border-2 min-w-[240px] font-satoshi shadow-xl transition-all ${
        isClickable ? 'hover:scale-105 cursor-pointer hover:shadow-2xl' : ''
      }`}
      onClick={(e) => {
        if (isClickable && data.onClick) {
          e.stopPropagation();
          data.onClick();
        }
      }}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white/50" />
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-medium text-white">{data.label}</h3>
          {data.description && (
            <p className="text-xs text-white/70 mt-1">{data.description}</p>
          )}
        </div>
        {isRunning && data.progress !== undefined && (
          <span className="text-xs font-semibold text-blue-400">{data.progress}%</span>
        )}
      </div>
      
      {isRunning && data.progress !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function FlowTree({ treeData, onNodeClick, onRefresh, isRefreshing = false }: FlowTreeProps) {
  const nodeTypes = useMemo(() => ({
    product: ProductNode,
    segment: SegmentNode,
    result: ResultNode,
  }), []);

  // Convert tree data to React Flow format
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!treeData) return { nodes: [], edges: [] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    const processNode = (
      nodeData: TreeNodeData,
      x: number,
      y: number,
      level: number = 0,
      parentId?: string
    ) => {
      
      const node: Node = {
        id: nodeData.id,
        type: nodeData.type,
        position: { x, y },
        data: {
          label: nodeData.label,
          description: nodeData.description,
          share_pct: nodeData.share_pct,
          status: nodeData.status,
          progress: nodeData.progress,
          hasData: nodeData.hasData,
          onRunIntelligence: nodeData.onRunIntelligence,
          onAnalyze: nodeData.onAnalyze, // Pass this prop
          onClick: nodeData.onClick ? () => {
            nodeData.onClick?.();
            onNodeClick(nodeData.id);
          } : undefined,
        },
      };
      
      nodes.push(node);

      if (parentId) {
        edges.push({
          id: `${parentId}-${nodeData.id}`,
          source: parentId,
          target: nodeData.id,
          type: 'smoothstep',
          animated: nodeData.status === 'running',
          style: { 
            stroke: nodeData.status === 'running' ? '#3b82f6' : '#6b7280',
            strokeWidth: 2
          },
        });
      }

      // Process children - now supporting multiple results per segment
      if (nodeData.children && nodeData.children.length > 0) {
        const horizontalSpacing = 450;
        const verticalSpacing = level === 0 ? 220 : 150;
        
        
        nodeData.children.forEach((child, index) => {
          const childY = y + (index - (nodeData.children!.length - 1) / 2) * verticalSpacing;
          processNode(child, x + horizontalSpacing, childY, level + 1, nodeData.id);
        });
      }
    };

    processNode(treeData, 0, 0);
    
    return { nodes, edges };
  }, [treeData, onNodeClick]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const hasFittedRef = useRef(false);

  // Check if we only have a single product node (no children)
  const hasSingleProductNode = useMemo(() => {
    return initialNodes.length === 1 && initialNodes[0]?.type === 'product';
  }, [initialNodes]);

  // Update nodes and edges when initialNodes/initialEdges change
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Initial fit view logic
  useEffect(() => {
    if (nodes.length > 0 && !hasFittedRef.current && rfInstance) {
      // Small delay to ensure nodes are rendered
      const timeout = setTimeout(() => {
        if (!rfInstance) return;
        rfInstance.fitView({
          padding: 0.2,
          minZoom: hasSingleProductNode ? 0.5 : 0.2,
          maxZoom: hasSingleProductNode ? 0.7 : 3,
          duration: 800,
        });
        hasFittedRef.current = true;
      }, 500); // Increased delay to ensure layout is ready

      return () => clearTimeout(timeout);
    }
  }, [nodes.length, rfInstance, hasSingleProductNode]);

  const onNodeClickHandler = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.data.onClick && typeof node.data.onClick === 'function') {
      node.data.onClick();
    }
  }, []);

  if (!treeData) return null;

  return (
    <div className="w-full h-full bg-black/20 font-satoshi">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickHandler}
        nodeTypes={nodeTypes}
        onInit={setRfInstance}
        minZoom={0.2}
        maxZoom={3}
        defaultViewport={hasSingleProductNode ? { x: 100, y: 100, zoom: 0.6 } : { x: 0, y: 0, zoom: 1 }} // Set initial viewport for single node
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          gap={40} 
          size={2} 
          color="rgba(255, 255, 255, 0.15)"
          className="bg-transparent"
        />
        <Controls 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg [&>button]:bg-white/10 [&>button]:backdrop-blur-md [&>button]:border-white/10 [&>button]:text-white [&>button:hover]:bg-white/20 [&>button]:transition-all"
          showInteractive={false}
          showFitView={true}
          showZoom={true}
        />
        
        {/* Manual Refresh Button - Top Left */}
        {onRefresh && (
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2.5 text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Refresh job status"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        )}
        
        {/* Custom Zoom Info Overlay */}
        <div className="absolute top-4 right-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-2 text-white/70 text-xs font-satoshi">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded text-[10px]">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-white/10 rounded text-[10px]">Scroll</kbd>
            <span>to zoom</span>
          </div>
        </div>
      </ReactFlow>
    </div>
  );
}

