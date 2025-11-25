"use client"

import { useRef, useEffect, useState } from "react"
import { TreeNodeData } from "./tree-node"

interface SVGTreeProps {
  treeData: TreeNodeData | null;
  onNodeClick: (nodeId: string) => void;
}

interface TreeNode {
  id: string;
  label: string;
  type: 'product' | 'segment' | 'result';
  status?: 'idle' | 'running' | 'completed' | 'failed';
  share_pct?: number;
  progress?: number;
  children?: TreeNode[];
  onClick?: () => void;
}

export function SVGTree({ treeData, onNodeClick }: SVGTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  // Handle mouse wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const delta = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(0.1, transform.scale + delta), 3);
        
        // Zoom towards mouse position
        const scaleRatio = newScale / transform.scale;
        const newX = mouseX - (mouseX - transform.x) * scaleRatio;
        const newY = mouseY - (mouseY - transform.y) * scaleRatio;
        
        setTransform({
          scale: newScale,
          x: newX,
          y: newY
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [transform]);

  // Handle mouse drag panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsPanning(true);
      setStartPoint({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - startPoint.x,
        y: e.clientY - startPoint.y
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Convert TreeNodeData to simpler TreeNode format
  const convertNode = (node: TreeNodeData): TreeNode => ({
    id: node.id,
    label: node.label,
    type: node.type,
    status: node.status,
    share_pct: node.share_pct,
    onClick: node.onClick,
    children: node.children?.map(convertNode)
  });

  if (!treeData) return null;

  const rootNode = convertNode(treeData);
  const nodeHeight = 80;
  const segmentSpacing = 220; // Reduced spacing between segments (level 1)
  const resultNodeSpacing = 120; // Spacing between result nodes (level 2+)
  const horizontalSpacing = 700; // Increased to accommodate wider dynamic nodes

  // Calculate positions for all nodes
  const calculateLayout = (node: TreeNode, x: number, y: number, level: number = 0): any[] => {
    const nodes: any[] = [{
      ...node,
      x,
      y
    }];

    if (node.children && node.children.length > 0) {
      // Level 0 (product) -> Level 1 (segments): use segmentSpacing
      // Level 1 (segments) -> Level 2+ (results): use resultNodeSpacing
      const spacing = level === 0 ? segmentSpacing : resultNodeSpacing;
      const totalHeight = node.children.length * (nodeHeight + spacing) - spacing;
      let currentY = y - totalHeight / 2;

      node.children.forEach((child) => {
        const childNodes = calculateLayout(child, x + horizontalSpacing, currentY + nodeHeight / 2, level + 1);
        nodes.push(...childNodes);
        currentY += nodeHeight + spacing;
      });
    }

    return nodes;
  };

  const nodes = calculateLayout(rootNode, 100, dimensions.height / 2);

  // Calculate SVG viewBox
  const minY = Math.min(...nodes.map(n => n.y)) - 50;
  const maxY = Math.max(...nodes.map(n => n.y)) + 50;
  const maxX = Math.max(...nodes.map(n => n.x)) + 400;
  const viewBoxHeight = maxY - minY;

  // Generate curve paths for connections
  const generatePath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
  };

  // Get color for node based on type and status
  const getNodeColor = (node: any) => {
    if (node.type === 'product') return '#4E5166';
    if (node.type === 'result') {
      if (node.status === 'running') return '#3b82f6'; // Blue for running
      if (node.status === 'completed') return '#10b981'; // Green for completed
      if (node.status === 'failed') return '#ef4444'; // Red for failed
      return '#10b981';
    }
    if (node.status === 'running') return '#3b82f6';
    if (node.status === 'completed') return '#10b981';
    return '#424B54';
  };

  const getTextColor = () => '#ffffff';

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative"
      style={{ 
        cursor: isPanning ? 'grabbing' : 'grab',
        backgroundColor: 'rgba(0, 0, 0, 0.2)' // 80% transparent black
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.2, 3) }))}
          className="bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded hover:bg-white/20 transition-colors border border-white/20"
          title="Zoom In (Ctrl + Scroll)"
        >
          +
        </button>
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.2, 0.1) }))}
          className="bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded hover:bg-white/20 transition-colors border border-white/20"
          title="Zoom Out (Ctrl + Scroll)"
        >
          −
        </button>
        <button
          onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
          className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded hover:bg-white/20 transition-colors border border-white/20 text-xs"
          title="Reset View"
        >
          Reset
        </button>
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ minWidth: '100%', minHeight: '100%' }}
      >
        <defs>
          {/* Define the dot pattern */}
          <pattern id="dotPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="rgba(255, 255, 255, 0.15)" />
          </pattern>
          
          {/* Glassmorphic blur filter */}
          <filter id="glassBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
        </defs>
        
        {/* Background with dots */}
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
        
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* Render connections first */}
          {nodes.map((node) => {
            if (!node.children) return null;
            
            const parentNode = nodes.find(n => n.id === node.id);
            if (!parentNode) return null;

            return node.children.map((child: TreeNode) => {
              const childNode = nodes.find(n => n.id === child.id);
              if (!childNode) return null;

              // Calculate parent node width dynamically
              const baseWidth = node.type === 'product' ? 320 : 280;
              const estimatedTextWidth = node.label.length * 9;
              const parentNodeWidth = Math.max(baseWidth, estimatedTextWidth + 60);

              return (
                <path
                  key={`${node.id}-${child.id}`}
                  className="link"
                  d={generatePath(
                    parentNode.x + parentNodeWidth - 20,
                    parentNode.y,
                    childNode.x - 20,
                    childNode.y
                  )}
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
              );
            });
          })}

        {/* Render nodes */}
        {nodes.map((node, index) => {
          const nodeColor = getNodeColor(node);
          const textColor = getTextColor();
          
          // Calculate dynamic width based on text length with padding
          const baseWidth = node.type === 'product' ? 320 : 280;
          const maxWidth = 600; // Maximum width before forcing wrap
          const estimatedTextWidth = node.label.length * 9; // Rough estimate: 9px per character
          
          // If text fits in one line (with padding), use it; otherwise cap at maxWidth
          const singleLineWidth = Math.min(estimatedTextWidth + 100, maxWidth);
          const nodeWidth = Math.max(baseWidth, singleLineWidth);
          
          // Determine if wrapping is needed
          const needsWrapping = estimatedTextWidth + 100 > maxWidth;
          const hasSharePct = node.share_pct !== undefined;
          
          // For wrapping: find a good break point (prefer word boundaries)
          let firstLine = node.label;
          let secondLine = '';
          
          if (needsWrapping) {
            const maxCharsFirstLine = Math.floor((maxWidth - 100) / 9);
            // Try to break at a space near the middle
            const breakPoint = node.label.lastIndexOf(' ', maxCharsFirstLine);
            if (breakPoint > 0) {
              firstLine = node.label.substring(0, breakPoint);
              secondLine = node.label.substring(breakPoint + 1);
            } else {
              // If no space found, just break at character limit
              firstLine = node.label.substring(0, maxCharsFirstLine);
              secondLine = node.label.substring(maxCharsFirstLine);
            }
          }
          
          // Calculate vertical positioning for centered text
          let textY = 0; // Center by default
          if (needsWrapping && hasSharePct) {
            textY = -15; // Move up if we have wrapped text + share %
          } else if (hasSharePct) {
            textY = -8; // Move up slightly if we have share %
          }
          
          // Determine fill color with tints for result nodes
          let nodeFill = "rgba(255, 255, 255, 0.1)";
          if (node.type === 'result') {
            // Alternate between green and blue tints for result nodes
            nodeFill = index % 2 === 0 
              ? "rgba(98, 255, 50, 0.15)"  // Green tint (#62ff32)
              : "rgba(58, 41, 255, 0.15)";  // Blue tint (#3A29FF)
          }

          return (
            <g
              key={node.id}
              className="node"
              transform={`translate(${node.x}, ${node.y})`}
            >
              {/* Glassmorphic background blur layer */}
              <rect
                rx="12"
                ry="12"
                x="-20"
                y={-nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                fill="rgba(255, 255, 255, 0.05)"
                filter="url(#glassBlur)"
              />
              
              {/* Node rectangle with glassmorphic effect */}
              <rect
                rx="12"
                ry="12"
                x="-20"
                y={-nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                fill={nodeFill}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
                className="hover:opacity-90 transition-opacity"
                style={{ cursor: node.type === 'result' ? 'pointer' : 'default' }}
                onClick={(e) => {
                  if (node.type === 'result' && (node.status === 'completed' || node.status === 'running')) {
                    e.stopPropagation();
                    onNodeClick(node.id);
                  }
                }}
              >
                {/* Pulse animation for running nodes */}
                {node.status === 'running' && (
                  <animate
                    attributeName="opacity"
                    values="1;0.6;1"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                )}
              </rect>

              {/* Node text - centered with wrapping for long text */}
              <text
                className="node-name"
                textAnchor="start"
                x="0"
                y={textY}
                fontSize="15"
                fontFamily="Satoshi, sans-serif"
                fontWeight="500"
                dominantBaseline="middle"
                fill={textColor}
                pointerEvents="none"
              >
                {needsWrapping ? (
                  <>
                    <tspan x="0" dy="0">{firstLine}</tspan>
                    <tspan x="0" dy="18">{secondLine}</tspan>
                  </>
                ) : (
                  node.label
                )}
              </text>

              {/* Progress percentage for running nodes */}
              {node.status === 'running' && node.progress !== undefined && (
                <text
                  x={nodeWidth - 60}
                  y={-nodeHeight / 2 + 16}
                  fontSize="14"
                  fontFamily="Satoshi, sans-serif"
                  fontWeight="600"
                  fill="#60A5FA"
                  pointerEvents="none"
                >
                  {node.progress}%
                </text>
              )}

              {/* Market share percentage - centered below text */}
              {node.share_pct !== undefined && (
                <text
                  x="0"
                  y={needsWrapping ? 18 : 12}
                  fontSize="12"
                  fontFamily="Satoshi, sans-serif"
                  fontWeight="500"
                  fill={textColor}
                  fillOpacity="0.8"
                  pointerEvents="none"
                >
                  Market Share: {node.share_pct}%
                </text>
              )}

              {/* Expand circle with ">" - for segments that don't have children yet */}
              {node.type === 'segment' && (!node.children || node.children.length === 0) && (
                <g
                  onClick={(e) => {
                    e.stopPropagation();
                    node.onClick?.();
                  }}
                  style={{ cursor: 'pointer' }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <circle
                    r="16"
                    fill="rgba(255, 255, 255, 0.15)"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="1"
                    transform={`translate(${nodeWidth - 36}, 0)`}
                  >
                    {node.status === 'running' && (
                      <animate
                        attributeName="opacity"
                        values="1;0.5;1"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                  <text
                    transform={`translate(${nodeWidth - 36}, 0)`}
                    fontSize="20"
                    fontWeight="600"
                    textAnchor="middle"
                    fontFamily="Satoshi, sans-serif"
                    fill={textColor}
                    pointerEvents="none"
                    dominantBaseline="middle"
                  >
                    &gt;
                  </text>
                </g>
              )}

              {/* Expand indicator for nodes with children */}
              {node.children && node.children.length > 0 && (
                <>
                  <circle
                    r="12"
                    fill="rgba(255, 255, 255, 0.15)"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="1"
                    transform={`translate(${nodeWidth - 32}, 0)`}
                  />
                  <text
                    transform={`translate(${nodeWidth - 32}, 0)`}
                    fontSize="18"
                    textAnchor="middle"
                    fontFamily="Satoshi, sans-serif"
                    fill={textColor}
                    pointerEvents="none"
                    dominantBaseline="middle"
                  >
                    &gt;
                  </text>
                </>
              )}

              {/* Status indicator - positioned better from edge */}
              {node.status && node.status !== 'idle' && node.type === 'segment' && (
                <circle
                  r="6"
                  cx={nodeWidth - 50}
                  cy={-nodeHeight / 2 + 16}
                  fill={node.status === 'running' ? '#3b82f6' : node.status === 'completed' ? '#10b981' : '#ef4444'}
                >
                  {node.status === 'running' && (
                    <animate
                      attributeName="opacity"
                      values="1;0.5;1"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              )}
            </g>
          );
        })}
        </g>
      </svg>
    </div>
  );
}

