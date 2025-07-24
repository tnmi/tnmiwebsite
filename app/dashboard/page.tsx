"use client"
// This will be the Comprehensive Materials Scientist Dashboard

import { Atom, Users, FileText, Zap, TrendingUp, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line } from "recharts"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useAuthStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { t } from "@/lib/i18n"
import { useDashboardLangStore } from "@/lib/store"

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
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const lang = useDashboardLangStore((state) => state.lang)
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  // Get display name or fallback to email
  const displayName = user?.displayName || user?.email || "User"

  return (
    <div className="space-y-6">
      {/* Remove the pink logout button from the dashboard page */}
      <Card className="bg-gradient-to-r from-tn-primary-blue via-tn-deep-blue to-tn-dark-bg text-white">
        <CardHeader>
          <CardTitle className="text-3xl">{t('welcome', lang)}, {displayName}!</CardTitle>
          <CardDescription className="text-tn-text-light">
            {t('dashboardDesc', lang)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-lg">
              {t('currentProject', lang)}:{" "}
              <span className="font-semibold text-tn-accent-green">{t('grapheneProject', lang)}</span>
            </p>
            <p className="text-sm">
              {t('cabalStatus', lang)}: <span className="text-tn-success-green font-medium">{t('activeLearning', lang)}</span>
            </p>
          </div>
          <Button className="bg-tn-primary-green hover:bg-tn-accent-green text-white">
            <Zap className="mr-2 h-4 w-4" /> {t('startNewExperiment', lang)}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('overview', lang)}</TabsTrigger>
          <TabsTrigger value="predictions">{t('predictions', lang)}</TabsTrigger>
          <TabsTrigger value="partnerships">{t('partnerships', lang)}</TabsTrigger>
          <TabsTrigger value="sustainability">{t('sustainability', lang)}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('activeExperiments', lang)}</CardTitle>
                <Atom className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">{t('plusSinceLastWeek', lang)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('partnershipOpportunities', lang)}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5 {t('newMatches', lang)}</div>
                <Link href="/dashboard/partnership-matching" className="text-xs text-tn-primary-blue hover:underline">
                  {t('viewMatches', lang)}
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('complianceStatus', lang)}</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-tn-success-green">{t('allClear', lang)}</div>
                <Link href="/dashboard/compliance-reporting" className="text-xs text-tn-primary-blue hover:underline">
                  {t('viewReports', lang)}
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('aiCoreUtilization', lang)}</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <Progress
                  value={85}
                  className="w-full h-2 mt-1 bg-tn-accent-green"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('materialPropertyCorrelations', lang)}</CardTitle>
                <CardDescription>{t('strengthVsConductivity', lang)}</CardDescription>
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
                <CardTitle>{t('roiProjections', lang)}</CardTitle>
                <CardDescription>{t('roiDescription', lang)}</CardDescription>
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
              <CardTitle>{t('livePredictions', lang)}</CardTitle>
              <CardDescription>
                {t('livePredictionsDesc', lang)}{' '}
                <Link href="/dashboard/molecular-viewer" className="text-tn-primary-blue hover:underline">
                  {t('molecularViewer', lang)}
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simplified prediction input form - full viewer has more */}
              <p className="text-center text-gray-500 py-8">
                {t('predictionsPlaceholder', lang)}
              </p>
              <div className="text-center">
                <Button asChild className="bg-tn-primary-green hover:bg-tn-accent-green">
                  <Link href="/dashboard/molecular-viewer">
                    <Atom className="mr-2 h-4 w-4" /> {t('goToAdvancedViewer', lang)}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partnerships">
          <Card>
            <CardHeader>
              <CardTitle>{t('partnershipOpportunityInsights', lang)}</CardTitle>
              <CardDescription>
                {t('partnershipOpportunityDesc', lang)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                {t('partnershipPlaceholder', lang)}{' '}
                <Link href="/dashboard/partnership-matching" className="text-tn-primary-blue hover:underline">
                  {t('partnershipMatching', lang)}
                </Link>{' '}
                section.
              </p>
              <div className="text-center">
                <Button asChild className="bg-tn-primary-blue hover:bg-tn-deep-blue text-white">
                  <Link href="/dashboard/partnership-matching">
                    <Users className="mr-2 h-4 w-4" /> {t('explorePartnershipMatching', lang)}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability">
          <Card>
            <CardHeader>
              <CardTitle>{t('sustainabilityOverview', lang)}</CardTitle>
              <CardDescription>
                {t('sustainabilityDesc', lang)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                {t('sustainabilityPlaceholder', lang)}{' '}
                <Link href="/dashboard/compliance-reporting" className="text-tn-primary-blue hover:underline">
                  {t('complianceReporting', lang)}
                </Link>{' '}
                section.
              </p>
              <div className="text-center">
                <Button asChild className="bg-tn-deep-blue hover:bg-tn-primary-blue text-white">
                  <Link href="/dashboard/compliance-reporting">
                    <FileText className="mr-2 h-4 w-4" /> {t('accessComplianceDashboard', lang)}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>{t('quickActions', lang)}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="border-tn-primary-green text-tn-primary-green hover:bg-tn-primary-green hover:text-white"
          >
            <TrendingUp className="mr-2 h-4 w-4" /> {t('viewSuccessTrends', lang)}
          </Button>
          <Button
            variant="outline"
            className="border-tn-accent-green text-tn-accent-green hover:bg-tn-accent-green hover:text-tn-dark-bg"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> {t('exportProjectSummary', lang)}
          </Button>
          <Button
            variant="outline"
            className="border-tn-primary-blue text-tn-primary-blue hover:bg-tn-primary-blue hover:text-white"
          >
            <AlertTriangle className="mr-2 h-4 w-4" /> {t('flagPotentialIssue', lang)}
          </Button>
          <Button
            variant="outline"
            className="border-tn-deep-blue text-tn-deep-blue hover:bg-tn-deep-blue hover:text-white"
          >
            <Lightbulb className="mr-2 h-4 w-4" /> {t('requestAICoreTuning', lang)}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
