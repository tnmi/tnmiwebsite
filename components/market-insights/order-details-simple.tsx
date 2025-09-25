"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface SimpleOrderDetailsProps {
  orderSummary: {
    order_id: string
    product_id?: string
    status?: string
    created_at?: string
    updated_at?: string
  }
  details: any
}

export default function SimpleOrderDetails({ orderSummary, details }: SimpleOrderDetailsProps) {
  if (!details) return null

  const researchResults = details.research_results
  const rawResearch = Array.isArray(details.raw_research_data) ? details.raw_research_data : []

  const industryFindings = rawResearch.filter((r: any) => r.research_type === "industry_finding")
  const validationBlocks = rawResearch.filter((r: any) => r.research_data?.type === "validation_results")

  const allIndustries = industryFindings.flatMap((item: any) => item.research_data?.industries || [])
  const allSources: string[] = industryFindings.flatMap((item: any) => item.research_data?.research_sources || [])
  const productSummary: string | undefined = industryFindings[0]?.research_data?.product_summary

  // Companies directory (no search): build useful external queries from industry names
  const uniqueIndustries = Array.from(new Map(
    (allIndustries || []).map((ind: any) => [ind.industry, ind])
  ).values())

  return (
    <div className="space-y-6">
      <Tabs defaultValue="industries">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-xl border-white/20">
          <TabsTrigger value="industries" className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 text-gray-700">Industries</TabsTrigger>
          <TabsTrigger value="markets" className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 text-gray-700">Markets</TabsTrigger>
          <TabsTrigger value="companies" className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 text-gray-700">Companies</TabsTrigger>
          <TabsTrigger value="validation" className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 text-gray-700">Validation</TabsTrigger>
        </TabsList>

        {/* Industries */}
        <TabsContent value="industries" className="space-y-6">
          {allIndustries.length > 0 ? (
            <div className="space-y-4">
              {allIndustries.map((ind: any, i: number) => (
                <Card key={i} className={`${i % 2 === 0 ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-xl border border-white/20`}>
                  <CardHeader>
                    <CardTitle className="text-gray-900">{ind.industry || 'Industry'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {ind.technical_fit && (
                      <div>
                        <div className="text-gray-700">Technical Fit</div>
                        <div className="text-gray-900">{ind.technical_fit}</div>
                      </div>
                    )}
                    {Array.isArray(ind.benefits) && ind.benefits.length > 0 && (
                      <div>
                        <div className="text-gray-700">Benefits</div>
                        <ul className="list-disc list-inside text-gray-900 space-y-0.5">
                          {ind.benefits.map((b: string, bi: number) => (<li key={bi}>{b}</li>))}
                        </ul>
                      </div>
                    )}
                    {Array.isArray(ind.pitfalls) && ind.pitfalls.length > 0 && (
                      <div>
                        <div className="text-gray-700">Pitfalls</div>
                        <ul className="list-disc list-inside text-gray-900 space-y-0.5">
                          {ind.pitfalls.map((p: string, pi: number) => (<li key={pi}>{p}</li>))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardContent className="py-8 text-center text-gray-700">No industries found.</CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Markets */}
        <TabsContent value="markets" className="space-y-6">
          {productSummary && (
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-900">Product Summary</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-900 text-sm">{productSummary}</CardContent>
            </Card>
          )}
          {allIndustries.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-900">Market Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {allIndustries.map((ind: any, i: number) => (
                  ind.market_opportunity ? (
                    <div key={i} className={`rounded-lg border border-white/20 ${i % 2 === 0 ? 'bg-white/10' : 'bg-white/20'} p-3`}>
                      <div className="font-medium text-gray-900 mb-1">{ind.industry}</div>
                      <div className="text-gray-900">{ind.market_opportunity}</div>
                    </div>
                  ) : null
                ))}
              </CardContent>
            </Card>
          )}
          {allSources.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-900">References</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {allSources.map((s: string, i: number) => (
                  <a 
                    key={i} 
                    href={s} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-700 underline break-all bg-white/20 px-2 py-1 rounded border border-white/30"
                  >
                    {s}
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Companies (no search): quick outbound lookups per industry) */}
        <TabsContent value="companies" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-gray-900">Company Directory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {uniqueIndustries.length > 0 ? (
                <div className="space-y-2">
                  {uniqueIndustries.map((ind: any, i: number) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-white/20 bg-white/20 p-3">
                      <div className="font-medium text-gray-900">{ind.industry}</div>
                      <div className="flex gap-2">
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(ind.industry + ' companies')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline"
                        >
                          Google
                        </a>
                        <a
                          href={`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(ind.industry)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline"
                        >
                          LinkedIn
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-700 text-sm">No industries available to search companies.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation */}
        <TabsContent value="validation" className="space-y-6">
          {validationBlocks.length > 0 ? (
            <div className="space-y-4">
              {validationBlocks.map((v: any, vi: number) => {
                const vr = v.research_data
                return (
                  <Card key={vi} className="bg-white/10 backdrop-blur-xl border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-gray-900">{vr.industry || 'Validation Results'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {vr.overall_assessment && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">Overall Assessment</span>
                          <Badge className={
                            vr.overall_assessment === 'PASS' ? 'bg-green-100 text-green-800' :
                            vr.overall_assessment === 'FAIL' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {vr.overall_assessment}
                          </Badge>
                        </div>
                      )}
                      {vr.summary && (
                        <div>
                          <div className="text-gray-700">Summary</div>
                          <div className="text-gray-900">{vr.summary}</div>
                        </div>
                      )}
                      {vr.validation_results && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {Object.entries(vr.validation_results).map(([key, val]: [string, any]) => (
                            <div key={key} className="rounded-lg border border-white/30 bg-white/20 p-3">
                              <div className="font-medium text-gray-900 capitalize">{key.replace(/_/g, ' ')}</div>
                              {val.status && (
                                <Badge className={
                                  (val.status || '').toLowerCase() === 'pass' ? 'bg-green-100 text-green-800' :
                                  (val.status || '').toLowerCase() === 'fail' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }>
                                  {val.status}
                                </Badge>
                              )}
                              {val.reasoning && (
                                <div className="text-sm text-gray-900 mt-2">{val.reasoning}</div>
                              )}
                              {Array.isArray(val.standards) && val.standards.length > 0 && (
                                <div className="text-sm text-gray-900 mt-2">
                                  <div className="text-gray-700">Standards</div>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {val.standards.map((s: string, si: number) => (
                                      <span key={si} className="px-2 py-1 rounded bg-gray-100 text-gray-900 border border-gray-300 text-xs">{s}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {Array.isArray(val.requirements) && val.requirements.length > 0 && (
                                <div className="text-sm text-gray-900 mt-2">
                                  <div className="text-gray-700">Requirements</div>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    {val.requirements.map((r: string, ri: number) => (<li key={ri}>{r}</li>))}
                                  </ul>
                                </div>
                              )}
                              {Array.isArray(val.integration_requirements) && val.integration_requirements.length > 0 && (
                                <div className="text-sm text-gray-900 mt-2">
                                  <div className="text-gray-700">Integration Requirements</div>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    {val.integration_requirements.map((r: string, ri: number) => (<li key={ri}>{r}</li>))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardContent className="py-8 text-center text-gray-700">No validation results.</CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}


