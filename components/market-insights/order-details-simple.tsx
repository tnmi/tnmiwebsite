"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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

  const progress = details.progress || {}
  const requestParams = details.request_params
  const researchResults = details.research_results
  const rawResearch = Array.isArray(details.raw_research_data) ? details.raw_research_data : []

  const industryFindings = rawResearch.filter((r: any) => r.research_type === "industry_finding")
  const validationBlocks = rawResearch.filter((r: any) => r.research_data?.type === "validation_results")

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-gray-900">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <div className="text-gray-700">Order ID</div>
            <div className="break-all text-gray-900">{orderSummary.order_id}</div>
          </div>
          {orderSummary.product_id && (
            <div>
              <div className="text-gray-700">Product ID</div>
              <div className="break-all text-gray-900">{orderSummary.product_id}</div>
            </div>
          )}
          {orderSummary.status && (
            <div>
              <div className="text-gray-700">Status</div>
              <div className="flex items-center gap-2">
                <Badge className={
                  orderSummary.status === 'completed' ? 'bg-green-100 text-green-800' :
                  orderSummary.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  orderSummary.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {orderSummary.status}
                </Badge>
              </div>
            </div>
          )}
          {orderSummary.created_at && (
            <div>
              <div className="text-gray-700">Created</div>
              <div className="text-gray-900">{new Date(orderSummary.created_at).toLocaleString()}</div>
            </div>
          )}
          {orderSummary.updated_at && (
            <div>
              <div className="text-gray-700">Last Updated</div>
              <div className="text-gray-900">{new Date(orderSummary.updated_at).toLocaleString()}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress */}
      {(progress.current_step || progress.steps_completed?.length || progress.total_steps || progress.errors?.length) && (
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-gray-900">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {progress.current_step && (
              <div>
                <div className="text-gray-700">Current Step</div>
                <div className="text-gray-900">{progress.current_step}</div>
              </div>
            )}
            {Array.isArray(progress.steps_completed) && progress.steps_completed.length > 0 && (
              <div>
                <div className="text-gray-700 mb-1">Steps Completed</div>
                <div className="flex flex-wrap gap-2">
                  {progress.steps_completed.map((s: string, idx: number) => (
                    <Badge key={idx} className="bg-green-100 text-green-800">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {progress.total_steps && (
              <div>
                <div className="text-gray-700">Total Steps</div>
                <div className="text-gray-900">{progress.total_steps}</div>
              </div>
            )}
            {Array.isArray(progress.errors) && progress.errors.length > 0 && (
              <div>
                <div className="text-gray-700 mb-1">Errors</div>
                <div className="space-y-2">
                  {progress.errors.map((err: any, idx: number) => (
                    <div key={idx} className="p-2 bg-red-50 border border-red-200 rounded text-red-700">
                      {err.message || JSON.stringify(err)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Request Parameters */}
      {requestParams && (
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-gray-900">Request Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs text-gray-800 bg-gray-50 p-3 rounded overflow-x-auto">
              {JSON.stringify(requestParams, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Research Results */}
      {researchResults && (
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-gray-900">Research Results</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-900">
            <div className="grid sm:grid-cols-2 gap-3">
              {typeof researchResults.total_research_items === 'number' && (
                <div className="flex items-center justify-between bg-white/20 rounded p-2">
                  <span className="text-gray-700">Total Items</span>
                  <span className="font-medium">{researchResults.total_research_items}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Industry Findings */}
      {industryFindings.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-gray-900">Industry Findings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {industryFindings.map((item: any, idx: number) => {
              const industries = item.research_data?.industries || []
              const tech = item.research_data?.technical_properties
              const sources = item.research_data?.research_sources || []
              return (
                <div key={idx} className="space-y-4">
                  {tech && (
                    <div>
                      <div className="text-gray-700 mb-1">Technical Properties</div>
                      <div className="text-gray-900">{tech}</div>
                    </div>
                  )}
                  {industries.length > 0 && (
                    <div className="space-y-4">
                      {industries.map((ind: any, i: number) => (
                        <div key={i} className="rounded-lg border border-white/20 bg-white/20 p-3">
                          {ind.industry && <div className="font-medium text-gray-900 mb-1">{ind.industry}</div>}
                          {ind.market_opportunity && (
                            <div className="text-sm text-gray-800"><span className="text-gray-700">Market Opportunity: </span>{ind.market_opportunity}</div>
                          )}
                          {ind.technical_fit && (
                            <div className="text-sm text-gray-800 mt-1"><span className="text-gray-700">Technical Fit: </span>{ind.technical_fit}</div>
                          )}
                          {Array.isArray(ind.benefits) && ind.benefits.length > 0 && (
                            <div className="mt-2">
                              <div className="text-gray-700 text-sm mb-1">Benefits</div>
                              <ul className="list-disc list-inside text-sm text-gray-800 space-y-0.5">
                                {ind.benefits.map((b: string, bi: number) => (<li key={bi}>{b}</li>))}
                              </ul>
                            </div>
                          )}
                          {Array.isArray(ind.pitfalls) && ind.pitfalls.length > 0 && (
                            <div className="mt-2">
                              <div className="text-gray-700 text-sm mb-1">Pitfalls</div>
                              <ul className="list-disc list-inside text-sm text-gray-800 space-y-0.5">
                                {ind.pitfalls.map((p: string, pi: number) => (<li key={pi}>{p}</li>))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {Array.isArray(sources) && sources.length > 0 && (
                    <div>
                      <div className="text-gray-700 mb-1">Research Sources</div>
                      <div className="flex flex-wrap gap-2">
                        {sources.map((s: string, si: number) => (
                          <Badge key={si} variant="outline" className="text-xs break-all max-w-full">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {idx < industryFindings.length - 1 && <Separator className="bg-white/20" />}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validationBlocks.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-gray-900">Validation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {validationBlocks.map((v: any, vi: number) => {
              const vr = v.research_data
              return (
                <div key={vi} className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {vr.industry && <span className="font-medium text-gray-900">{vr.industry}</span>}
                    {vr.overall_assessment && (
                      <Badge className={
                        vr.overall_assessment === 'PASS' ? 'bg-green-100 text-green-800' :
                        vr.overall_assessment === 'FAIL' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {vr.overall_assessment}
                      </Badge>
                    )}
                  </div>
                  {vr.summary && <div className="text-gray-800">{vr.summary}</div>}
                  {vr.validation_results && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(vr.validation_results).map(([key, val]: [string, any]) => (
                        <div key={key} className="rounded-lg border border-white/20 bg-white/20 p-3">
                          <div className="font-medium text-gray-900 capitalize mb-1">{key.replace(/_/g, ' ')}</div>
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
                            <div className="text-sm text-gray-800 mt-2">{val.reasoning}</div>
                          )}
                          {Array.isArray(val.standards) && val.standards.length > 0 && (
                            <div className="text-sm text-gray-800 mt-2">
                              <div className="text-gray-700">Standards</div>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {val.standards.map((s: string, si: number) => (
                                  <Badge key={si} variant="outline" className="text-xs">{s}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {Array.isArray(val.requirements) && val.requirements.length > 0 && (
                            <div className="text-sm text-gray-800 mt-2">
                              <div className="text-gray-700">Requirements</div>
                              <ul className="list-disc list-inside space-y-0.5">
                                {val.requirements.map((r: string, ri: number) => (<li key={ri}>{r}</li>))}
                              </ul>
                            </div>
                          )}
                          {Array.isArray(val.integration_requirements) && val.integration_requirements.length > 0 && (
                            <div className="text-sm text-gray-800 mt-2">
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
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}


