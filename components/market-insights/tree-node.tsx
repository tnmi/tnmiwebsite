"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Loader2, CheckCircle, XCircle, Play } from "lucide-react"
import { cn } from "@/lib/utils"

export type NodeType = 'product' | 'segment' | 'result';

export interface TreeNodeData {
  id: string;
  type: NodeType;
  label: string;
  description?: string;
  share_pct?: number;
  status?: 'idle' | 'running' | 'completed' | 'failed';
  progress?: number; // Progress percentage 0-100
  onClick?: () => void;
  onAnalyze?: () => void; // New prop for Analyze button
  children?: TreeNodeData[];
  hasData?: boolean; // For product node to show/hide button
  onRunIntelligence?: () => void; // For product node button
}

interface TreeNodeProps {
  data: TreeNodeData;
  level: number;
}

export function TreeNode({ data, level }: TreeNodeProps) {
  const getNodeStyles = () => {
    switch (data.type) {
      case 'product':
        return 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 min-w-[280px] font-satoshi';
      case 'segment':
        return 'bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 min-w-[240px] font-satoshi';
      case 'result':
        return 'bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500/30 min-w-[240px] font-satoshi';
      default:
        return 'bg-white/10 border-white/20 font-satoshi';
    }
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    if (!data.status || data.status === 'idle') return null;
    
    const variants: Record<string, string> = {
      running: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
      completed: 'bg-green-500/20 border-green-500/50 text-green-300',
      failed: 'bg-red-500/20 border-red-500/50 text-red-300'
    };

    const statusText = data.status === 'running' && data.progress !== undefined 
      ? `${data.progress}%` 
      : data.status;

    return (
      <Badge variant="outline" className={variants[data.status]}>
        {statusText}
      </Badge>
    );
  };

  return (
    <div className="flex items-start gap-4">
      {/* Node Card */}
      <Card
        className={cn(
          'border-2 transition-all duration-300 shadow-lg hover:shadow-xl',
          getNodeStyles(),
          data.onClick && (data.type === 'result' || data.type === 'segment') && 'hover:scale-105 cursor-pointer'
        )}
        onClick={(data.type === 'result' || data.type === 'segment') ? data.onClick : undefined}
      >
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'font-medium text-gray-100 leading-tight',
                data.type === 'product' && 'text-lg'
              )}>
                {data.label}
              </h3>
              {data.share_pct !== undefined && (
                <p className="text-sm text-gray-400 mt-1">
                  Market Share: {data.share_pct}%
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              {getStatusIcon()}
              {getStatusBadge()}
            </div>
          </div>

          {data.description && (
            <p className="text-xs text-gray-400 line-clamp-2">
              {data.description}
            </p>
          )}

          {/* Progress Bar for running jobs */}
          {data.status === 'running' && data.progress !== undefined && (
            <div className="mt-2">
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-out"
                  style={{ width: `${data.progress}%` }}
                />
              </div>
            </div>
          )}

          {data.type === 'segment' && data.status === 'idle' && data.onAnalyze && (
            <Button
              size="sm"
              variant="ghost"
              className="w-full mt-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30"
              onClick={(e) => {
                e.stopPropagation();
                data.onAnalyze?.();
              }}
            >
              <Play className="w-3 h-3 mr-2" />
              Analyze Segment
            </Button>
          )}
        </div>
      </Card>

      {/* Connector Line and Arrow */}
      {data.children && data.children.length > 0 && (
        <div className="flex items-center">
          <div className="w-8 h-0.5 bg-gradient-to-r from-white/20 to-white/5" />
          <ChevronRight className="w-5 h-5 text-white/30" />
        </div>
      )}

      {/* Children */}
      {data.children && data.children.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.children.map((child) => (
            <TreeNode key={child.id} data={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

