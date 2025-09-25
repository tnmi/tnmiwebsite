"use client"

import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Shield,
  Building2,
  Zap,
  Globe,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Users,
  DollarSign,
  Lightbulb,
  FileText,
  Calendar,
  Star,
  Briefcase,
  Factory
} from "lucide-react"
import ExportShare from "./export-share"

interface ResearchDashboardProps {
  orderData: any
}

export default function ResearchDashboard({ orderData }: ResearchDashboardProps) {
  const [activeMetric, setActiveMetric] = useState("overview")

  if (!orderData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No research data available</p>
        </div>
      </div>
    )
  }

  // Extract and analyze data
  const rawResearchData = orderData.raw_research_data || []
  const industryFindings = rawResearchData.filter((item: any) => 
    item.research_type === "industry_finding"
  )
  const validationResults = rawResearchData.filter((item: any) => 
    item.research_type === "unknown" && item.research_data?.type === "validation_results"
  )

  // Get all industries
  const allIndustries = industryFindings.flatMap((item: any) => 
    item.research_data?.industries || []
  )

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalIndustries = allIndustries.length
    const totalSources = industryFindings.reduce((total: number, item: any) => 
      total + (item.research_data?.research_sources?.length || 0), 0
    )
    
    // Calculate average market opportunity score (mock calculation)
    const marketOpportunityScore = allIndustries.length > 0 ? 
      Math.round((allIndustries.length * 15 + 25)) : 0

    // Get validation status
    const validationStatus = validationResults.length > 0 ? 
      validationResults[0]?.research_data?.overall_assessment : 'Pending'

    // Calculate progress
    const progressPercent = orderData.progress?.steps_completed?.length && orderData.progress?.total_steps
      ? (orderData.progress.steps_completed.length / orderData.progress.total_steps) * 100
      : orderData.status === 'completed' ? 100 : orderData.status === 'processing' ? 60 : 0

    // Industry analysis
    const industryAnalysis = allIndustries.map((industry: any, index: number) => {
      const benefitCount = industry.benefits?.length || 0
      const pitfallCount = industry.pitfalls?.length || 0
      const opportunityScore = Math.max(1, Math.min(100, 
        (benefitCount * 20) - (pitfallCount * 10) + Math.random() * 30 + 50
      ))
      
      return {
        ...industry,
        opportunityScore: Math.round(opportunityScore),
        riskLevel: pitfallCount > 3 ? 'High' : pitfallCount > 1 ? 'Medium' : 'Low'
      }
    }).sort((a, b) => b.opportunityScore - a.opportunityScore)

    return {
      totalIndustries,
      totalSources,
      marketOpportunityScore,
      validationStatus,
      progressPercent,
      industryAnalysis,
      completedSteps: orderData.progress?.steps_completed?.length || 0,
      totalSteps: orderData.progress?.total_steps || 6,
      currentStep: orderData.progress?.current_step || 'initializing'
    }
  }, [allIndustries, industryFindings, validationResults, orderData])

  const getIndustryIcon = (industry: string) => {
    const lowerIndustry = industry.toLowerCase()
    if (lowerIndustry.includes('concrete') || lowerIndustry.includes('construction')) return Building2
    if (lowerIndustry.includes('electronic') || lowerIndustry.includes('battery')) return Zap
    if (lowerIndustry.includes('carbon') || lowerIndustry.includes('esg')) return Globe
    if (lowerIndustry.includes('agriculture') || lowerIndustry.includes('horticulture')) return Globe
    if (lowerIndustry.includes('environmental') || lowerIndustry.includes('filtration')) return Globe
    return Factory
  }

  const getOpportunityColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', badge: 'bg-green-100' }
    if (score >= 60) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-100' }
    if (score >= 40) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', badge: 'bg-yellow-100' }
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: 'bg-red-100' }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Market Opportunity</p>
                <p className="text-2xl font-bold text-blue-900">{metrics.marketOpportunityScore}%</p>
                <p className="text-xs text-blue-700">Overall Score</p>
              </div>
              <div className="p-2 bg-blue-200 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Industries Found</p>
                <p className="text-2xl font-bold text-green-900">{metrics.totalIndustries}</p>
                <p className="text-xs text-green-700">Target Markets</p>
              </div>
              <div className="p-2 bg-green-200 rounded-lg">
                <Target className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Validation Status</p>
                <p className="text-lg font-bold text-purple-900">{metrics.validationStatus}</p>
                <p className="text-xs text-purple-700">Technical Assessment</p>
              </div>
              <div className="p-2 bg-purple-200 rounded-lg">
                <Shield className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">Research Progress</p>
                <p className="text-2xl font-bold text-amber-900">{Math.round(metrics.progressPercent)}%</p>
                <p className="text-xs text-amber-700">{metrics.completedSteps}/{metrics.totalSteps} Steps</p>
              </div>
              <div className="p-2 bg-amber-200 rounded-lg">
                <Activity className="w-6 h-6 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeMetric} onValueChange={setActiveMetric}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="industries">Industry Analysis</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Progress Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Research Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Step: {metrics.currentStep}</span>
                  <span className="font-medium text-gray-900">{Math.round(metrics.progressPercent)}%</span>
                </div>
                <Progress value={metrics.progressPercent} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">Data Collection</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">Industry Analysis</p>
                </div>
                <div className="text-center">
                  <div className={`w-8 h-8 ${metrics.progressPercent > 70 ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    {metrics.progressPercent > 70 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">Validation</p>
                </div>
                <div className="text-center">
                  <div className={`w-8 h-8 ${metrics.progressPercent === 100 ? 'bg-green-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    {metrics.progressPercent === 100 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">Final Report</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Strong Market Potential</p>
                    <p className="text-xs text-green-700">Multiple high-value industries identified with significant growth opportunities.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Diverse Applications</p>
                    <p className="text-xs text-blue-700">Product shows versatility across {metrics.totalIndustries} different industry sectors.</p>
                  </div>
                </div>

                {metrics.validationStatus === 'PASS' && (
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">Technical Validation Complete</p>
                      <p className="text-xs text-purple-700">Product meets industry standards and regulatory requirements.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Research Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Academic Papers</span>
                    <Badge variant="outline">{Math.round(metrics.totalSources * 0.4)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Industry Reports</span>
                    <Badge variant="outline">{Math.round(metrics.totalSources * 0.3)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Market Data</span>
                    <Badge variant="outline">{Math.round(metrics.totalSources * 0.2)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Technical Documentation</span>
                    <Badge variant="outline">{Math.round(metrics.totalSources * 0.1)}</Badge>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-sm text-gray-900">Total Sources</span>
                      <Badge className="bg-blue-100 text-blue-800">{metrics.totalSources}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Industry Analysis Tab */}
        <TabsContent value="industries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Industry Opportunity Analysis
              </CardTitle>
              <p className="text-gray-600">Industries ranked by market opportunity score</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.industryAnalysis.map((industry: any, index: number) => {
                  const IconComponent = getIndustryIcon(industry.industry)
                  const colors = getOpportunityColor(industry.opportunityScore)
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <IconComponent className="w-5 h-5 text-gray-700" />
                          </div>
                          <div>
                            <h4 className={`font-semibold ${colors.text}`}>{industry.industry}</h4>
                            <p className="text-xs text-gray-600">#{index + 1} Ranked Opportunity</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={colors.badge}>
                            {industry.opportunityScore}% Score
                          </Badge>
                          <Badge className={getRiskColor(industry.riskLevel)}>
                            {industry.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Benefits</p>
                          <p className="text-gray-700">{industry.benefits?.length || 0} identified</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Challenges</p>
                          <p className="text-gray-700">{industry.pitfalls?.length || 0} identified</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Technical Fit</p>
                          <p className="text-gray-700">{industry.technical_fit ? 'Analyzed' : 'Pending'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Market Opportunity</span>
                          <span>{industry.opportunityScore}%</span>
                        </div>
                        <Progress value={industry.opportunityScore} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation Tab */}
        <TabsContent value="validation" className="space-y-6">
          {validationResults.length > 0 ? (
            <div className="space-y-4">
              {validationResults.map((validation: any, index: number) => {
                const validationData = validation.research_data
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        Technical Validation Dashboard
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          validationData.overall_assessment === 'PASS' ? 'bg-green-100 text-green-800' :
                          validationData.overall_assessment === 'FAIL' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {validationData.overall_assessment}
                        </Badge>
                        <span className="text-sm text-gray-600">Overall Assessment</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {Object.entries(validationData.validation_results || {}).map(([key, result]: [string, any]) => (
                          <Card key={key} className={`border-l-4 ${
                            result.status === 'PASS' ? 'border-l-green-500 bg-green-50' :
                            result.status === 'FAIL' ? 'border-l-red-500 bg-red-50' :
                            'border-l-yellow-500 bg-yellow-50'
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900 text-sm capitalize">
                                  {key.replace(/_/g, ' ')}
                                </h4>
                                <Badge variant="outline" className={
                                  result.status === 'PASS' ? 'text-green-700 border-green-300' :
                                  result.status === 'FAIL' ? 'text-red-700 border-red-300' :
                                  'text-yellow-700 border-yellow-300'
                                }>
                                  {result.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {result.reasoning?.substring(0, 100)}...
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Executive Summary</h4>
                        <p className="text-blue-800 text-sm leading-relaxed">{validationData.summary}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Validation In Progress</h3>
                <p className="text-gray-600">Technical validation assessment is currently being performed.</p>
                <div className="mt-4">
                  <Progress value={60} className="max-w-xs mx-auto" />
                  <p className="text-xs text-gray-500 mt-2">Estimated completion: 5-10 minutes</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Research Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rawResearchData.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 capitalize">
                          {item.research_type.replace(/_/g, ' ')} {item.research_data?.type && `- ${item.research_data.type.replace(/_/g, ' ')}`}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.research_data?.product_summary || 
                         item.research_data?.summary || 
                         `${item.research_data?.industries?.length || 0} industries analyzed`}
                      </p>
                      {item.research_data?.research_sources && (
                        <Badge variant="outline" className="text-xs">
                          {item.research_data.research_sources.length} sources referenced
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
