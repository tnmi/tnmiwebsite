"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface StudioPanelProps {
  marketIntelligenceStatus: 'idle' | 'running' | 'completed' | 'error';
  marketPullEnabled: boolean;
  activeJobsCount: number;
}

export function StudioPanel({
  marketIntelligenceStatus,
  marketPullEnabled,
  activeJobsCount
}: StudioPanelProps) {
  return (
    <div className="w-64 h-full bg-white/5 backdrop-blur-3xl border-l border-white/10 p-4 shadow-2xl font-satoshi">
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-white/70 uppercase tracking-wider">
          STUDIO
        </h2>
        <p className="text-xs text-white/60 mt-1">AI Agents</p>
      </div>

      <div className="space-y-4">
        {/* Market Intelligence Agent */}
        <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white">
              Market Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marketIntelligenceStatus === 'running' && (
              <div className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin text-blue-300" />
                <Badge className="bg-blue-500/30 text-blue-100 border-blue-400/30 backdrop-blur-sm">
                  Running
                </Badge>
              </div>
            )}
            {marketIntelligenceStatus === 'error' && (
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500/30 text-red-100 border-red-400/30 backdrop-blur-sm">
                  Error
                </Badge>
              </div>
            )}
            <p className="text-xs text-white/70 mt-2">
              Analyzes market segments and opportunities
            </p>
          </CardContent>
        </Card>

        {/* Market Pull Agent */}
        <Card className={`bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl transition-all duration-300 ${
          marketPullEnabled ? 'hover:shadow-2xl hover:bg-white/15' : 'opacity-50'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white">
              Market Pull
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marketPullEnabled ? (
              <>
                <Badge className="bg-purple-500/30 text-purple-100 border-purple-400/30 backdrop-blur-sm">
                  Available
                </Badge>
                {activeJobsCount > 0 && (
                  <p className="text-xs text-white/70 mt-2">
                    {activeJobsCount} active job{activeJobsCount !== 1 ? 's' : ''}
                  </p>
                )}
              </>
            ) : (
              <>
                <Badge variant="outline" className="bg-white/10 text-white/70 border-white/20 backdrop-blur-sm">
                  Disabled
                </Badge>
                <p className="text-xs text-white/70 mt-2">
                  Run Market Intelligence first
                </p>
              </>
            )}
            <p className="text-xs text-white/70 mt-2">
              Deep-dives into specific market segments
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

