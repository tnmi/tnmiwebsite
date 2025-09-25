"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Building2,
  Mail,
  Phone,
  FileText,
  Download,
  Share2,
  Zap,
  Target,
  Shield,
  Lightbulb,
  Factory,
  Beaker,
  Leaf,
  Globe,
  Award,
  BarChart3,
  Users,
  Briefcase
} from "lucide-react"
import ExportShare from "./export-share"

interface OrderDetailsEnhancedProps {
  orderData: any
}

export default function OrderDetailsEnhanced({ orderData }: OrderDetailsEnhancedProps) {
  const [activeTab, setActiveTab] = useState("overview")
  
  if (!orderData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No research data available</p>
        </div>
      </div>
    )
  }

  // Extract research data
  const rawResearchData = orderData.raw_research_data || []
  const industryFindings = rawResearchData.filter((item: any) => 
    item.research_type === "industry_finding"
  )
  const validationResults = rawResearchData.filter((item: any) => 
    item.research_type === "unknown" && item.research_data?.type === "validation_results"
  )

  // Get all industries from all research items
  const allIndustries = industryFindings.flatMap((item: any) => 
    item.research_data?.industries || []
  )

  // Get product summary from the first research item
  const productSummary = industryFindings[0]?.research_data?.product_summary || "Product analysis in progress..."
  
  // Calculate progress percentage
  const progressPercent = orderData.progress?.steps_completed?.length && orderData.progress?.total_steps
    ? (orderData.progress.steps_completed.length / orderData.progress.total_steps) * 100
    : orderData.status === 'completed' ? 100 : orderData.status === 'processing' ? 60 : 0

  const getIndustryIcon = (industry: string) => {
    const lowerIndustry = industry.toLowerCase()
    if (lowerIndustry.includes('concrete') || lowerIndustry.includes('construction')) return Building2
    if (lowerIndustry.includes('electronic') || lowerIndustry.includes('battery')) return Zap
    if (lowerIndustry.includes('carbon') || lowerIndustry.includes('esg')) return Leaf
    if (lowerIndustry.includes('pharmaceutical') || lowerIndustry.includes('medical')) return Beaker
    if (lowerIndustry.includes('agriculture') || lowerIndustry.includes('horticulture')) return Leaf
    if (lowerIndustry.includes('environmental') || lowerIndustry.includes('filtration')) return Globe
    if (lowerIndustry.includes('feed') || lowerIndustry.includes('animal')) return Factory
    return Factory
  }

  const getValidationStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pass': return 'bg-green-100 text-green-800 border-green-200'
      case 'fail': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Product Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Market Research Analysis
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Order: {orderData.order_id}
                </Badge>
                <Badge className={
                  orderData.status === 'completed' ? 'bg-green-100 text-green-800' :
                  orderData.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {orderData.status}
                </Badge>
              </div>
            </div>
            <ExportShare 
              orderData={orderData}
              orderSummary={{
                orderId: orderData?.order_id || 'N/A',
                productId: orderData?.product_id || 'N/A',
                status: orderData?.status || 'unknown',
                createdAt: orderData?.created_at || new Date().toISOString()
              }}
            />
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Research Progress</span>
              <span className="text-gray-900 font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="industries">Industries ({allIndustries.length})</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Product Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                Product Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{productSummary}</p>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Industries Identified</p>
                    <p className="text-2xl font-bold text-green-900">{allIndustries.length}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Research Sources</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {industryFindings.reduce((total: number, item: any) => 
                        total + (item.research_data?.research_sources?.length || 0), 0
                      )}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Validation Status</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {validationResults.length > 0 ? 
                        validationResults[0]?.research_data?.overall_assessment || 'N/A' : 'Pending'
                      }
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technical Properties */}
          {industryFindings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-indigo-600" />
                  Technical Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {industryFindings[0]?.research_data?.technical_properties}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Industries Tab */}
        <TabsContent value="industries" className="space-y-6">
          <div className="grid gap-6">
            {allIndustries.map((industry: any, index: number) => {
              const IconComponent = getIndustryIcon(industry.industry)
              return (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <IconComponent className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{industry.industry}</h3>
                        <p className="text-sm text-gray-600 font-normal">Market Analysis & Opportunity Assessment</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Market Opportunity */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Market Opportunity
                      </h4>
                      <p className="text-gray-700 leading-relaxed bg-green-50 p-3 rounded-lg border border-green-200">
                        {industry.market_opportunity}
                      </p>
                    </div>

                    {/* Technical Fit */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        Technical Fit Analysis
                      </h4>
                      <p className="text-gray-700 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-200">
                        {industry.technical_fit}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Benefits */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Key Benefits
                        </h4>
                        <ul className="space-y-2">
                          {industry.benefits?.map((benefit: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pitfalls */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          Potential Challenges
                        </h4>
                        <ul className="space-y-2">
                          {industry.pitfalls?.map((pitfall: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <span>{pitfall}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Contact Companies Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Users className="w-4 h-4 mr-2" />
                        Find Companies in {industry.industry}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Validation Tab */}
        <TabsContent value="validation" className="space-y-6">
          {validationResults.length > 0 ? (
            <div className="space-y-6">
              {validationResults.map((validation: any, index: number) => {
                const validationData = validation.research_data
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        {validationData.industry} - Validation Assessment
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getValidationStatusColor(validationData.overall_assessment)}>
                          {validationData.overall_assessment}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Overall Assessment
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Summary */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Executive Summary</h4>
                        <p className="text-blue-800 leading-relaxed">{validationData.summary}</p>
                      </div>

                      {/* Validation Results */}
                      <div className="grid gap-4">
                        {Object.entries(validationData.validation_results || {}).map(([key, result]: [string, any]) => (
                          <Card key={key} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold capitalize text-gray-900">
                                  {key.replace(/_/g, ' ')}
                                </h4>
                                <Badge className={getValidationStatusColor(result.status)}>
                                  {result.status}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-700 text-sm mb-3">{result.reasoning}</p>
                              
                              {result.standards && (
                                <div className="mt-3">
                                  <p className="font-medium text-gray-900 text-sm mb-2">Standards:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {result.standards.map((standard: string, idx: number) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {standard}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {result.requirements && (
                                <div className="mt-3">
                                  <p className="font-medium text-gray-900 text-sm mb-2">Requirements:</p>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    {result.requirements.map((req: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {result.readiness_factors && (
                                <div className="mt-3">
                                  <p className="font-medium text-gray-900 text-sm mb-2">Market Readiness Factors:</p>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    {result.readiness_factors.map((factor: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        {factor}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {result.integration_requirements && (
                                <div className="mt-3">
                                  <p className="font-medium text-gray-900 text-sm mb-2">Integration Requirements:</p>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    {result.integration_requirements.map((req: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Research Sources */}
                      {validationData.research_sources && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Research Sources
                          </h4>
                          <div className="space-y-2">
                            {validationData.research_sources.map((source: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
                                  {source}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Validation Results</h3>
                <p className="text-gray-600">Validation assessment is still in progress or not yet started.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies" className="space-y-6">
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Directory</h3>
              <p className="text-gray-600 mb-6">
                Find and connect with companies in your target industries
              </p>
              
              <div className="grid gap-4 max-w-md mx-auto">
                {allIndustries.slice(0, 3).map((industry: any, index: number) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    className="justify-start"
                    onClick={() => {
                      // TODO: Implement company search
                      console.log(`Searching companies in ${industry.industry}`)
                    }}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Search {industry.industry} Companies
                  </Button>
                ))}
                
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => {
                    // TODO: Implement comprehensive company search
                    console.log('Opening comprehensive company search')
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find All Relevant Companies
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
