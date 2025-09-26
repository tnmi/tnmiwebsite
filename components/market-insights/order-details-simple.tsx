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

  // Accept multiple industry research types (e.g., industry_finding, industry_research)
  const industryItems = rawResearch.filter((r: any) => typeof r.research_type === 'string' && r.research_type.startsWith('industry_'))
  const validationBlocks = rawResearch.filter((r: any) => r.research_data?.type === "validation_results")
  const companyBlocks = rawResearch.filter((r: any) => r.research_data?.type === "company_findings")

  const allIndustries = industryItems.flatMap((item: any) => item.research_data?.industries || [])
  const allSources: string[] = industryItems.flatMap((item: any) => item.research_data?.research_sources || [])
  const productSummary: string | undefined = industryItems.map((it: any) => it.research_data?.product_summary).find((v: any) => !!v)
  const allCompanies = companyBlocks.flatMap((item: any) => item.research_data?.companies || [])

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

        {/* Companies: dynamic company findings */}
        <TabsContent value="companies" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-gray-900">Company Directory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.isArray(allCompanies) && allCompanies.length > 0 ? (
                <div className="space-y-3">
                  {allCompanies.map((c: any, i: number) => (
                    <div key={i} className={`rounded-lg border border-white/20 ${i % 2 === 0 ? 'bg-white/10' : 'bg-white/20'} p-4`}> 
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-gray-900">{c.company_name || 'Company'}</div>
                          {c.company_size && (
                            <div className="text-xs text-gray-700 mt-0.5">{c.company_size}</div>
                          )}
                        </div>
                        {c.contact_info?.company_website && (
                          <a
                            href={c.contact_info.company_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 underline"
                          >
                            Website
                          </a>
                        )}
                      </div>

                      {c.company_description && (
                        <div className="text-sm text-gray-800 mt-2">{c.company_description}</div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
                        {c.market_position && (
                          <div className="rounded bg-white/30 border border-white/30 p-2">
                            <div className="text-gray-700">Market Position</div>
                            <div className="text-gray-900">{c.market_position}</div>
                          </div>
                        )}
                        {c.technical_fit && (
                          <div className="rounded bg-white/30 border border-white/30 p-2">
                            <div className="text-gray-700">Technical Fit</div>
                            <div className="text-gray-900">{c.technical_fit}</div>
                          </div>
                        )}
                        {c.drop_in_potential && (
                          <div className="rounded bg-white/30 border border-white/30 p-2 sm:col-span-2">
                            <div className="text-gray-700">Drop-in Potential</div>
                            <div className="text-gray-900">{c.drop_in_potential}</div>
                          </div>
                        )}
                      </div>

                      {Array.isArray(c.current_solutions) && c.current_solutions.length > 0 && (
                        <div className="mt-3">
                          <div className="text-gray-700 text-sm mb-1">Current Solutions</div>
                          <ul className="list-disc list-inside text-sm text-gray-900 space-y-0.5">
                            {c.current_solutions.map((s: string, si: number) => (<li key={si}>{s}</li>))}
                          </ul>
                        </div>
                      )}

                      {Array.isArray(c.decision_makers) && c.decision_makers.length > 0 && (
                        <div className="mt-3">
                          <div className="text-gray-700 text-sm mb-1">Decision Makers</div>
                          <ul className="text-sm text-gray-900 space-y-0.5">
                            {c.decision_makers.map((d: any, di: number) => (
                              <li key={di} className="list-disc list-inside">
                                {d.name || d.full_name || 'Contact'}{d.title ? ` – ${d.title}` : d.role ? ` – ${d.role}` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(c.contact_info?.emails || c.contact_info?.phone_numbers || c.contact_info?.linkedin_profiles) && (
                        <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
                          {Array.isArray(c.contact_info?.emails) && c.contact_info.emails.length > 0 && (
                            <div className="rounded bg-white/30 border border-white/30 p-2">
                              <div className="text-gray-700">Emails</div>
                              <div className="space-y-0.5">
                                {c.contact_info.emails.map((e: string, ei: number) => (
                                  <div key={ei} className="break-all">{e}</div>
                                ))}
                              </div>
                            </div>
                          )}
                          {Array.isArray(c.contact_info?.phone_numbers) && c.contact_info.phone_numbers.length > 0 && (
                            <div className="rounded bg-white/30 border border-white/30 p-2">
                              <div className="text-gray-700">Phones</div>
                              <div className="space-y-0.5">
                                {c.contact_info.phone_numbers.map((p: string, pi: number) => (
                                  <div key={pi} className="break-all">{p}</div>
                                ))}
                              </div>
                            </div>
                          )}
                          {Array.isArray(c.contact_info?.linkedin_profiles) && c.contact_info.linkedin_profiles.length > 0 && (
                            <div className="rounded bg-white/30 border border-white/30 p-2">
                              <div className="text-gray-700">LinkedIn</div>
                              <div className="space-y-0.5">
                                {c.contact_info.linkedin_profiles.map((l: string, li: number) => (
                                  <a key={li} href={l} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline break-all">{l}</a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {Array.isArray(c.research_sources) && c.research_sources.length > 0 && (
                        <div className="mt-3">
                          <div className="text-gray-700 text-sm mb-1">Research Sources</div>
                          <div className="flex flex-wrap gap-2">
                            {c.research_sources.map((s: string, si: number) => (
                              <a key={si} href={s} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline break-all bg-white/20 px-2 py-1 rounded border border-white/30">{s}</a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-700 text-sm">No companies found.</div>
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
                  <Card key={vi} className={`${vi % 2 === 0 ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-xl border border-white/20`}>
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


