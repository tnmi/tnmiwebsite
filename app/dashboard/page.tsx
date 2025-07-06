"use client"
// This will be the Comprehensive Materials Scientist Dashboard

import { Atom, Users, FileText, Zap, TrendingUp, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line } from "recharts"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const sampleChartData = [
  { name: "Jan", strength: 30, conductivity: 50, partnerships: 2 },
  { name: "Feb", strength: 45, conductivity: 55, partnerships: 3 },
  { name: "Mar", strength: 40, conductivity: 65, partnerships: 5 },
  { name: "Apr", strength: 55, conductivity: 60, partnerships: 4 },
  { name: "May", strength: 60, conductivity: 70, partnerships: 6 },
]

const roiData = [
  { name: "Scenario A", roi: 2.5 },
  { name: "Scenario B", roi: 3.1 },
  { name: "Scenario C", roi: 1.8 },
  { name: "Scenario D", roi: 4.0 },
]

export default function ScientistDashboardPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-tn-primary-blue via-tn-deep-blue to-tn-dark-bg text-white">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome, Dr. Materials!</CardTitle>
          <CardDescription className="text-tn-text-light">
            Your unified interface for materials intelligence. Access predictions, find partners, ensure compliance, and
            drive innovation.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-lg">
              Current Project:{" "}
              <span className="font-semibold text-tn-accent-green">Graphene Nanocomposite Optimization</span>
            </p>
            <p className="text-sm">
              CABAL AI Core Status: <span className="text-tn-success-green font-medium">Active & Learning</span>
            </p>
          </div>
          <Button className="bg-tn-primary-green hover:bg-tn-accent-green text-white">
            <Zap className="mr-2 h-4 w-4" /> Start New Experiment
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Live Predictions</TabsTrigger>
          <TabsTrigger value="partnerships">Partnership Insights</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability & Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
                <Atom className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 since last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partnership Opportunities</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5 New Matches</div>
                <Link href="/dashboard/partnership-matching" className="text-xs text-tn-primary-blue hover:underline">
                  View Matches
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-tn-success-green">All Clear</div>
                <Link href="/dashboard/compliance-reporting" className="text-xs text-tn-primary-blue hover:underline">
                  View Reports
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Core Utilization</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <Progress
                  value={85}
                  className="w-full h-2 mt-1 bg-tn-accent-green"
                  indicatorClassName="bg-tn-primary-green"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Material Property Correlations</CardTitle>
                <CardDescription>Strength vs. Conductivity Trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sampleChartData}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" stroke="#0bb977" />
                    <YAxis yAxisId="right" orientation="right" stroke="#0033ff" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="strength"
                      stroke="#0bb977"
                      activeDot={{ r: 8 }}
                      name="Tensile Strength"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="conductivity"
                      stroke="#0033ff"
                      name="Thermal Conductivity"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>ROI Projections</CardTitle>
                <CardDescription>Potential Return on Investment for Different Scenarios</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roiData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="roi" fill="#18df89" name="Projected ROI (x)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle>Live Material Predictions (CABAL AI Core)</CardTitle>
              <CardDescription>
                Input parameters to see real-time predictions. For detailed 3D view, visit the{" "}
                <Link href="/dashboard/molecular-viewer" className="text-tn-primary-blue hover:underline">
                  Molecular Viewer
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simplified prediction input form - full viewer has more */}
              <p className="text-center text-gray-500 py-8">
                Live prediction inputs and results would be displayed here. This section would integrate with the CABAL
                AI core for real-time feedback.
              </p>
              <div className="text-center">
                <Button asChild className="bg-tn-primary-green hover:bg-tn-accent-green">
                  <Link href="/dashboard/molecular-viewer">
                    <Atom className="mr-2 h-4 w-4" /> Go to Advanced Molecular Viewer
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partnerships">
          <Card>
            <CardHeader>
              <CardTitle>Partnership Opportunity Insights</CardTitle>
              <CardDescription>
                AI-driven recommendations for industry and startup collaborations based on your current research focus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Partnership matching scores, compatibility matrices, and communication tools would be displayed here.
                For full features, visit the{" "}
                <Link href="/dashboard/partnership-matching" className="text-tn-primary-blue hover:underline">
                  Partnership Matching
                </Link>{" "}
                section.
              </p>
              <div className="text-center">
                <Button asChild className="bg-tn-primary-blue hover:bg-tn-deep-blue text-white">
                  <Link href="/dashboard/partnership-matching">
                    <Users className="mr-2 h-4 w-4" /> Explore Partnership Matching
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability & Compliance Overview</CardTitle>
              <CardDescription>
                Track LEED credits, environmental impact, and regulatory compliance for your projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                LEED credit calculations, carbon sequestration metrics, and compliance reports would be displayed here.
                For detailed reporting, visit the{" "}
                <Link href="/dashboard/compliance-reporting" className="text-tn-primary-blue hover:underline">
                  Compliance Reporting
                </Link>{" "}
                section.
              </p>
              <div className="text-center">
                <Button asChild className="bg-tn-deep-blue hover:bg-tn-primary-blue text-white">
                  <Link href="/dashboard/compliance-reporting">
                    <FileText className="mr-2 h-4 w-4" /> Access Compliance Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="border-tn-primary-green text-tn-primary-green hover:bg-tn-primary-green hover:text-white"
          >
            <TrendingUp className="mr-2 h-4 w-4" /> View Success Trends
          </Button>
          <Button
            variant="outline"
            className="border-tn-accent-green text-tn-accent-green hover:bg-tn-accent-green hover:text-tn-dark-bg"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Export Project Summary
          </Button>
          <Button
            variant="outline"
            className="border-tn-primary-blue text-tn-primary-blue hover:bg-tn-primary-blue hover:text-white"
          >
            <AlertTriangle className="mr-2 h-4 w-4" /> Flag Potential Issue
          </Button>
          <Button
            variant="outline"
            className="border-tn-deep-blue text-tn-deep-blue hover:bg-tn-deep-blue hover:text-white"
          >
            <Lightbulb className="mr-2 h-4 w-4" /> Request AI Core Tuning
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
