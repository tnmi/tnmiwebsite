"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { X, Download, ExternalLink, ChevronDown, Clock, Loader2, RefreshCw, PieChart, AlignLeft, TrendingUp, BarChart3 } from "lucide-react"
import { JobStatusResponse } from "@/lib/market-intelligence-api"
import ReactMarkdown from 'react-markdown'
import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, TooltipProps } from 'recharts';

interface SegmentDetailsPanelProps {
  segmentName: string;
  segmentData?: {
    share_pct?: number;
    description?: string;
    estimation_method?: string;
    source_url?: string;
    found_with_query?: string;
  };
  productData?: {
    pricing?: {
      min_usd?: number;
      max_usd?: number;
      unit?: string;
      time_series?: any[];
      data_quality?: string;
    };
    materials?: {
      technical_properties?: Record<string, string>;
    };
  };
  jobResult: JobStatusResponse | null;
  isRunning?: boolean;
  onRefresh?: () => Promise<void>;
  onClose: () => void;
  onAnalyze?: () => Promise<void>;
  viewMode?: 'details' | 'analysis';
}

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 border border-white/20 p-3 rounded-lg text-xs text-white font-satoshi shadow-xl">
        <p className="font-semibold mb-1">{data.notes || label}</p>
        <p className="text-blue-300">Price: ${data.avg_price_usd?.toLocaleString()}</p>
        <p className="text-white/50 mt-1">Year: {data.year}</p>
      </div>
    );
  }
  return null;
};

// Helper function to clean and format analysis text
function cleanAnalysisText(text: string): string {
  if (!text) return '';
  
  let cleaned = text;
  
  // Check if the text starts with JSON structure like { "analysis": "..."
  // This happens when the API returns improperly formatted data
  const jsonMatch = cleaned.match(/^\s*\{\s*"analysis"\s*:\s*"([\s\S]*)$/);
  if (jsonMatch) {
    // Extract just the content after "analysis": "
    cleaned = jsonMatch[1];
    
    // Remove trailing quotes and brackets if present
    cleaned = cleaned.replace(/["}]+\s*$/g, '');
  }
  
  // Replace escaped newlines with actual newlines
  cleaned = cleaned.replace(/\\n/g, '\n');
  
  // Replace escaped quotes
  cleaned = cleaned.replace(/\\"/g, '"');
  
  // Remove trailing backslashes at the end of lines AND at the end of the string
  // This fixes: "text\n" → "text\n" and "text\" → "text"
  cleaned = cleaned.replace(/\\+\s*(\n|$)/g, '$1'); // Remove backslashes before newlines or end of string
  cleaned = cleaned.replace(/\\+$/gm, ''); // Remove backslashes at end of each line (multiline mode)
  
  // Remove or replace any remaining standalone backslashes
  // But preserve escaped characters if any remain
  cleaned = cleaned.replace(/\\(?!["\\/bfnrtu])/g, ''); // Remove backslashes not followed by valid escape chars
  
  // Clean URLs - remove trailing underscores, backslashes, and weird characters
  // This fixes: https://example.com/_\n\n## → https://example.com/
  cleaned = cleaned.replace(/(https?:\/\/[^\s]+?)(_+|\\n|\\|_\\n\\n\\n##)+/g, '$1');
  cleaned = cleaned.replace(/(https?:\/\/[^\s]+?)_+(?=\s|$)/g, '$1'); // Remove trailing underscores from URLs
  
  // Replace non-breaking spaces with regular spaces
  cleaned = cleaned.replace(/\xa0/g, ' ');
  
  // Remove or format XML-like tags (using [\s\S]* instead of .*? with s flag)
  cleaned = cleaned.replace(/<url>\s*([\s\S]*?)\s*<\/url>/g, '\n**Source URL:** $1\n');
  cleaned = cleaned.replace(/<query>\s*([\s\S]*?)\s*<\/query>/g, '\n**Query:** $1\n');
  cleaned = cleaned.replace(/<result>\s*([\s\S]*?)\s*<\/result>/g, '\n**Result:**\n$1\n');
  cleaned = cleaned.replace(/<content>\s*([\s\S]*?)\s*<\/content>/g, '\n$1\n');
  
  // Clean up excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();
  
  return cleaned;
}

// Helper function to get agent data from steps
function getAgentData(jobResult: JobStatusResponse, agentName: string) {
  if (!jobResult.steps) return null;
  
  const step = jobResult.steps.find(s => s.agent_name === agentName);
  if (!step || !step.output) return null;
  
  return {
    analysis: cleanAnalysisText(step.output.analysis || ''),
    sources: step.output.sources || [],
    timestamp: step.timestamp
  };
}

export function SegmentDetailsPanel({
  segmentName,
  segmentData,
  productData,
  jobResult,
  isRunning = false,
  onRefresh,
  onClose,
  onAnalyze,
  viewMode = 'analysis' // Default to analysis for backward compatibility
}: SegmentDetailsPanelProps) {
  const [selectedVersion, setSelectedVersion] = useState<'current' | string>('current');
  const [refreshing, setRefreshing] = useState(false);

  // Process time series data for chart
  const chartData = useMemo(() => {
    if (!productData?.pricing?.time_series) return [];
    
    // Sort generally by year then we rely on the order provided or notes
    // The provided data seems mixed (quarters, months). 
    // Let's try to parse a sortable date from "notes" + "year" if possible, 
    // otherwise keep original order if it looks chronological, or just sort by year.
    
    // Simple sort by year for now to group them
    const data = [...productData.pricing.time_series];
    
    // Try to add a rough sort key
    // Logic: Year * 100 + Month (approx)
    // Q1=1, Q2=4, Q3=7, Q4=10
    // March=3, June=6, etc.
    const getSortKey = (item: any) => {
      let month = 0;
      const text = (item.notes || '').toLowerCase();
      if (text.includes('q1') || text.includes('jan') || text.includes('feb') || text.includes('mar')) month = 3;
      else if (text.includes('q2') || text.includes('apr') || text.includes('may') || text.includes('jun')) month = 6;
      else if (text.includes('q3') || text.includes('jul') || text.includes('aug') || text.includes('sep')) month = 9;
      else if (text.includes('q4') || text.includes('oct') || text.includes('nov') || text.includes('dec')) month = 12;
      
      return (item.year || 0) * 100 + month;
    };

    return data.sort((a, b) => getSortKey(a) - getSortKey(b)).map(item => ({
      ...item,
      //Create a short label for X-axis
      shortLabel: item.notes?.split(' ')[0] // e.g. "USA", "Japan" - might be too short, maybe use full notes but truncate in tick
    }));
  }, [productData?.pricing?.time_series]);

  // Determine if we should show the details view
  // Show details if viewMode is 'details' OR if we are in legacy mode (no viewMode passed) and no job exists
  const showDetails = viewMode === 'details' || (!jobResult && !isRunning);

  if (showDetails) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-satoshi">
        <Card className="w-full max-w-3xl overflow-hidden bg-white/20 backdrop-blur-3xl shadow-2xl border border-white/30 font-satoshi max-h-[90vh] flex flex-col">
          <CardHeader className="border-b border-white/30 bg-white/10 relative flex-shrink-0">
            <CardTitle className="text-xl text-white">{segmentName}</CardTitle>
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-4 top-4 text-white/70 hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <CardContent className="p-6 flex flex-col gap-6">
              
              {/* Segment Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Market Share & Description */}
                <div className="space-y-4">
                  {segmentData?.share_pct !== undefined && (
                    <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <PieChart className="w-4 h-4 text-blue-300" />
                        <span className="text-sm font-medium text-white/80">Market Share</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{segmentData.share_pct}%</p>
                      {segmentData.estimation_method && (
                        <p className="text-xs text-white/50 mt-1 italic">
                          Method: {segmentData.estimation_method}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {segmentData?.description && (
                    <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <AlignLeft className="w-4 h-4 text-purple-300" />
                        <span className="text-sm font-medium text-white/80">Description</span>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed">
                        {segmentData.description}
                      </p>
                      {segmentData.source_url && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <a 
                            href={segmentData.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1 truncate"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Source: {new URL(segmentData.source_url).hostname}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Level Info (Pricing & Materials) */}
                <div className="space-y-4">
                  {productData?.pricing && (productData.pricing.min_usd || productData.pricing.max_usd) && (
                    <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-300" />
                          <span className="text-sm font-medium text-white/80">Estimated Market Pricing</span>
                        </div>
                        {productData.pricing.data_quality && (
                          <Badge variant="outline" className={`text-[10px] h-5 ${
                            productData.pricing.data_quality === 'high' ? 'border-green-500/50 text-green-200' :
                            productData.pricing.data_quality === 'medium' ? 'border-yellow-500/50 text-yellow-200' :
                            'border-red-500/50 text-red-200'
                          }`}>
                            {productData.pricing.data_quality} confidence
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">
                          ${productData.pricing.min_usd?.toLocaleString()} - ${productData.pricing.max_usd?.toLocaleString()}
                        </span>
                        <span className="text-sm text-white/60">USD / {productData.pricing.unit || 'tonne'}</span>
                      </div>
                      <p className="text-xs text-white/50 mt-2">
                        Based on similar product categories
                      </p>
                    </div>
                  )}

                  {productData?.materials?.technical_properties && Object.keys(productData.materials.technical_properties).length > 0 && (
                    <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-white/80">Technical Properties</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(productData.materials.technical_properties).slice(0, 5).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center text-xs border-b border-white/5 pb-1 last:border-0">
                            <span className="text-white/70">{key}</span>
                            <span className="text-white font-medium">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Chart Section */}
              {chartData.length > 0 && (
                <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-blue-300" />
                    <span className="text-sm font-medium text-white/80">Historical Price Trends</span>
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis 
                          dataKey="notes" 
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} 
                          axisLine={false}
                          tickLine={false}
                          interval={0} // Show all ticks
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} 
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                        <Bar 
                          dataKey="avg_price_usd" 
                          fill="#60a5fa" 
                          radius={[4, 4, 0, 0]} 
                          name="Price (USD)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            </CardContent>
          </div>
        </Card>
      </div>
    );
  }

  if (!jobResult) {
    return null;
  }

  const handleRefresh = async () => {
    if (onRefresh && !refreshing) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  };

  // TODO: Fetch historical versions from API
  // For now, using a placeholder structure
  const versions = [
    { id: 'current', label: isRunning ? 'Current Analysis (In Progress)' : 'Current Analysis', timestamp: jobResult.final_output ? new Date().toISOString() : '' }
    // More versions would be added here from API
  ];

  // PRIORITIZE final_output as it contains the complete consolidated reports
  // The steps array contains intermediate/truncated analysis
  const hasFinalOutput = jobResult.final_output;
  
  // Check if steps have additional fields we can use
  if (jobResult.steps && jobResult.steps.length > 0) {
    // Check if there's a results file or full output somewhere
    const industryStep = jobResult.steps.find(s => s.agent_name === 'browser_industry_analyst');
    if (industryStep?.output?.debug) {
      if (industryStep.output.debug.full_browser_history) {
        const historyPreview = industryStep.output.debug.full_browser_history.substring(0, 1000);
      }
    }
  }
  
  // Only extract from steps if final_output is not available (fallback)
  const industryData = !hasFinalOutput ? getAgentData(jobResult, 'browser_industry_analyst') : null;
  const supplyChainData = !hasFinalOutput ? getAgentData(jobResult, 'browser_supply_chain_analyst') : null;
  const newsData = !hasFinalOutput ? getAgentData(jobResult, 'browser_news_analyst') : null;
  const regulatoryData = !hasFinalOutput ? getAgentData(jobResult, 'browser_regulatory_analyst') : null;
  const financialData = !hasFinalOutput ? getAgentData(jobResult, 'browser_financial_analyst') : null;

  const hasStepsData = industryData || supplyChainData || newsData || regulatoryData || financialData;

  // Allow display for running jobs with partial data OR completed jobs
  if (!hasFinalOutput && !hasStepsData && !isRunning) {
    return null;
  }

  const handleDownload = () => {
    // Create downloadable content from steps
    let content = `Market Pull Analysis: ${segmentName}\nGenerated: ${new Date().toLocaleString()}\n\n`;
    
    if (jobResult.steps && jobResult.steps.length > 0) {
      // Use steps data
      content += `================================================================================\nINDUSTRY REPORT\n================================================================================\n${industryData?.analysis || 'N/A'}\n\nSources:\n${industryData?.sources.map((s: string) => `- ${s}`).join('\n') || 'None'}\n\n`;
      
      content += `================================================================================\nSUPPLY CHAIN ANALYSIS\n================================================================================\n${supplyChainData?.analysis || 'N/A'}\n\nSources:\n${supplyChainData?.sources.map((s: string) => `- ${s}`).join('\n') || 'None'}\n\n`;
      
      content += `================================================================================\nRECENT DEVELOPMENTS\n================================================================================\n${newsData?.analysis || 'N/A'}\n\nSources:\n${newsData?.sources.map((s: string) => `- ${s}`).join('\n') || 'None'}\n\n`;
      
      content += `================================================================================\nREGULATORY LANDSCAPE\n================================================================================\n${regulatoryData?.analysis || 'N/A'}\n\nSources:\n${regulatoryData?.sources.map((s: string) => `- ${s}`).join('\n') || 'None'}\n\n`;
      
      content += `================================================================================\nFINANCIAL ANALYSIS\n================================================================================\n${financialData?.analysis || 'N/A'}\n\nSources:\n${financialData?.sources.map((s: string) => `- ${s}`).join('\n') || 'None'}`;
    } else if (hasFinalOutput) {
      // Fallback to final_output
      const final_output = jobResult.final_output!;
      content += `================================================================================\nINDUSTRY REPORT\n================================================================================\n${final_output.industry_report}\n\n`;
      content += `================================================================================\nSUPPLY CHAIN ANALYSIS\n================================================================================\n${final_output.supply_chain}\n\n`;
      content += `================================================================================\nCONSUMER DEMAND\n================================================================================\n${final_output.consumer_demand}\n\n`;
      content += `================================================================================\nREGULATORY LANDSCAPE\n================================================================================\n${final_output.regulatory}\n\n`;
      content += `================================================================================\nFINANCIAL ANALYSIS\n================================================================================\n${final_output.financial}`;
    }

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-pull-${segmentName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-satoshi">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white/20 backdrop-blur-3xl shadow-2xl border border-white/30 font-satoshi">
        <CardHeader className="border-b border-white/30 bg-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-white">{segmentName}</CardTitle>
                  {isRunning && (
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30 animate-pulse">
                      In Progress
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/80 mt-1">
                  {isRunning ? 'Analysis in progress - Showing partial results' : 'Market Pull Analysis Results'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRunning && onRefresh && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Versions
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900/95 backdrop-blur-xl border-white/20">
                  <DropdownMenuLabel className="text-white/80">Analysis History</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {versions.map((version) => (
                    <DropdownMenuItem
                      key={version.id}
                      onClick={() => setSelectedVersion(version.id)}
                      className={`text-white/70 hover:text-white hover:bg-white/10 cursor-pointer ${
                        selectedVersion === version.id ? 'bg-white/15' : ''
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{version.label}</span>
                        {version.timestamp && (
                          <span className="text-xs text-white/50">
                            {new Date(version.timestamp).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                size="sm"
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Tab Navigation - Moved outside CardContent */}
        <div className="border-b border-white/30 bg-white/10">
          <Tabs defaultValue="industry" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-transparent border-b border-white/10 h-12">
              <TabsTrigger value="industry" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/70 rounded-none border-b-2 border-transparent">Industry</TabsTrigger>
              <TabsTrigger value="supply-chain" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/70 rounded-none border-b-2 border-transparent">Supply Chain</TabsTrigger>
              <TabsTrigger value="news" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/70 rounded-none border-b-2 border-transparent">News</TabsTrigger>
              <TabsTrigger value="regulatory" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/70 rounded-none border-b-2 border-transparent">Regulatory</TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/70 rounded-none border-b-2 border-transparent">Financial</TabsTrigger>
            </TabsList>

            <CardContent className="p-0">
              <ScrollArea className="h-[calc(90vh-180px)]">
                <div className="p-6">

                  {/* Industry Tab */}
                  <TabsContent value="industry" className="mt-0">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Market Demand Analysis</h3>
                    {hasFinalOutput ? (
                      <div className="text-white/90 leading-relaxed prose prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            a: ({node, ...props}) => (
                              <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline" />
                            ),
                            p: ({node, ...props}) => (
                              <p {...props} className="mb-4" />
                            ),
                            ul: ({node, ...props}) => (
                              <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                            ),
                            ol: ({node, ...props}) => (
                              <ol {...props} className="list-decimal pl-6 mb-4 space-y-2" />
                            ),
                          }}
                        >
                          {cleanAnalysisText(jobResult.final_output!.industry_report)}
                        </ReactMarkdown>
                      </div>
                    ) : industryData ? (
                      <>
                        <div className="text-white/90 leading-relaxed prose prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              // Custom link rendering
                              a: ({node, ...props}) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline" />
                              ),
                              // Better paragraph spacing
                              p: ({node, ...props}) => (
                                <p {...props} className="mb-4" />
                              ),
                              // Better list styling
                              ul: ({node, ...props}) => (
                                <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                              ),
                              ol: ({node, ...props}) => (
                                <ol {...props} className="list-decimal pl-6 mb-4 space-y-2" />
                              ),
                            }}
                          >
                            {industryData.analysis}
                          </ReactMarkdown>
                        </div>
                        {industryData.sources.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-white/20">
                            <h4 className="text-sm font-semibold text-white/80 mb-2">Sources</h4>
                            <div className="space-y-1">
                              {industryData.sources.map((source: string, idx: number) => (
                                <a
                                  key={idx}
                                  href={source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {source}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : isRunning ? (
                      <div className="flex items-center gap-3 text-white/70 py-8">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <p className="italic">Analysis in progress... Check back soon for results</p>
                      </div>
                    ) : (
                      <p className="text-white/60 italic">No data available</p>
                    )}
                  </div>
                </TabsContent>

                {/* Supply Chain Tab */}
                <TabsContent value="supply-chain" className="mt-6">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Supply Chain Insights</h3>
                    {hasFinalOutput ? (
                      <div className="text-white/90 leading-relaxed prose prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            a: ({node, ...props}) => (
                              <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline" />
                            ),
                            p: ({node, ...props}) => (
                              <p {...props} className="mb-4" />
                            ),
                            ul: ({node, ...props}) => (
                              <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                            ),
                            ol: ({node, ...props}) => (
                              <ol {...props} className="list-decimal pl-6 mb-4 space-y-2" />
                            ),
                          }}
                        >
                          {cleanAnalysisText(jobResult.final_output!.supply_chain)}
                        </ReactMarkdown>
                      </div>
                    ) : supplyChainData ? (
                      <>
                        <div className="text-white/90 leading-relaxed prose prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              a: ({node, ...props}) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline" />
                              ),
                              p: ({node, ...props}) => (
                                <p {...props} className="mb-4" />
                              ),
                              ul: ({node, ...props}) => (
                                <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                              ),
                              ol: ({node, ...props}) => (
                                <ol {...props} className="list-decimal pl-6 mb-4 space-y-2" />
                              ),
                            }}
                          >
                            {cleanAnalysisText(supplyChainData.analysis)}
                          </ReactMarkdown>
                        </div>
                        {supplyChainData.sources.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-white/20">
                            <h4 className="text-sm font-semibold text-white/80 mb-2">Sources</h4>
                            <div className="space-y-1">
                              {supplyChainData.sources.map((source: string, idx: number) => (
                                <a
                                  key={idx}
                                  href={source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {source}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : isRunning ? (
                      <div className="flex items-center gap-3 text-white/70 py-8">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <p className="italic">Analysis in progress... Check back soon for results</p>
                      </div>
                    ) : (
                      <p className="text-white/60 italic">No data available</p>
                    )}
                  </div>
                </TabsContent>

                {/* News Tab */}
                <TabsContent value="news" className="mt-6">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Developments</h3>
                    {hasFinalOutput ? (
                      <div className="text-white/90 leading-relaxed prose prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            a: ({node, ...props}) => (
                              <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline" />
                            ),
                            p: ({node, ...props}) => (
                              <p {...props} className="mb-4" />
                            ),
                            ul: ({node, ...props}) => (
                              <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                            ),
                            ol: ({node, ...props}) => (
                              <ol {...props} className="list-decimal pl-6 mb-4 space-y-2" />
                            ),
                          }}
                        >
                          {cleanAnalysisText(jobResult.final_output!.consumer_demand)}
                        </ReactMarkdown>
                      </div>
                    ) : newsData ? (
                      <>
                        <div className="text-white/90 leading-relaxed prose prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              a: ({node, ...props}) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline" />
                              ),
                              p: ({node, ...props}) => (
                                <p {...props} className="mb-4" />
                              ),
                              ul: ({node, ...props}) => (
                                <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                              ),
                              ol: ({node, ...props}) => (
                                <ol {...props} className="list-decimal pl-6 mb-4 space-y-2" />
                              ),
                            }}
                          >
                            {newsData.analysis}
                          </ReactMarkdown>
                        </div>
                        {newsData.sources.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-white/20">
                            <h4 className="text-sm font-semibold text-white/80 mb-2">Sources</h4>
                            <div className="space-y-1">
                              {newsData.sources.map((source: string, idx: number) => (
                                <a
                                  key={idx}
                                  href={source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {source}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : isRunning ? (
                      <div className="flex items-center gap-3 text-white/70 py-8">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <p className="italic">Analysis in progress... Check back soon for results</p>
                      </div>
                    ) : (
                      <p className="text-white/60 italic">No data available</p>
                    )}
                  </div>
                </TabsContent>

                {/* Regulatory Tab */}
                <TabsContent value="regulatory" className="mt-6">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Regulatory Landscape</h3>
                    {hasFinalOutput ? (
                      <div className="text-white/90 leading-relaxed prose prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            a: ({node, ...props}) => (
                              <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline" />
                            ),
                            p: ({node, ...props}) => (
                              <p {...props} className="mb-4" />
                            ),
                            ul: ({node, ...props}) => (
                              <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                            ),
                            ol: ({node, ...props}) => (
                              <ol {...props} className="list-decimal pl-6 mb-4 space-y-2" />
                            ),
                          }}
                        >
                          {cleanAnalysisText(jobResult.final_output!.regulatory)}
                        </ReactMarkdown>
                      </div>
                    ) : regulatoryData ? (
                      <>
                        <div className="text-white/90 leading-relaxed prose prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              a: ({node, ...props}) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline" />
                              ),
                              p: ({node, ...props}) => (
                                <p {...props} className="mb-4" />
                              ),
                              ul: ({node, ...props}) => (
                                <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                              ),
                              ol: ({node, ...props}) => (
                                <ol {...props} className="list-decimal pl-6 mb-4 space-y-2" />
                              ),
                            }}
                          >
                            {regulatoryData.analysis}
                          </ReactMarkdown>
                        </div>
                        {regulatoryData.sources.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-white/20">
                            <h4 className="text-sm font-semibold text-white/80 mb-2">Sources</h4>
                            <div className="space-y-1">
                              {regulatoryData.sources.map((source: string, idx: number) => (
                                <a
                                  key={idx}
                                  href={source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {source}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : isRunning ? (
                      <div className="flex items-center gap-3 text-white/70 py-8">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <p className="italic">Analysis in progress... Check back soon for results</p>
                      </div>
                    ) : (
                      <p className="text-white/60 italic">No data available</p>
                    )}
                  </div>
                </TabsContent>

                {/* Financial Tab */}
                <TabsContent value="financial" className="mt-6">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Economic Conditions</h3>
                    {hasFinalOutput ? (
                      <div className="text-white/90 leading-relaxed prose prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            a: ({node, ...props}) => (
                              <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline" />
                            ),
                            p: ({node, ...props}) => (
                              <p {...props} className="mb-4" />
                            ),
                            ul: ({node, ...props}) => (
                              <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                            ),
                            ol: ({node, ...props}) => (
                              <ol {...props} className="list-decimal pl-6 mb-4 space-y-2" />
                            ),
                          }}
                        >
                          {cleanAnalysisText(jobResult.final_output!.financial)}
                        </ReactMarkdown>
                      </div>
                    ) : financialData ? (
                      <>
                        <div className="text-white/90 leading-relaxed prose prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              a: ({node, ...props}) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline" />
                              ),
                              p: ({node, ...props}) => (
                                <p {...props} className="mb-4" />
                              ),
                              ul: ({node, ...props}) => (
                                <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                              ),
                              ol: ({node, ...props}) => (
                                <ol {...props} className="list-decimal pl-6 mb-4 space-y-2" />
                              ),
                            }}
                          >
                            {financialData.analysis}
                          </ReactMarkdown>
                        </div>
                        {financialData.sources.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-white/20">
                            <h4 className="text-sm font-semibold text-white/80 mb-2">Sources</h4>
                            <div className="space-y-1">
                              {financialData.sources.map((source: string, idx: number) => (
                                <a
                                  key={idx}
                                  href={source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {source}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : isRunning ? (
                      <div className="flex items-center gap-3 text-white/70 py-8">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <p className="italic">Analysis in progress... Check back soon for results</p>
                      </div>
                    ) : (
                      <p className="text-white/60 italic">No data available</p>
                    )}
                  </div>
                </TabsContent>
                </div>
              </ScrollArea>
            </CardContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}

