"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

import { Progress } from "@/components/ui/progress"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, ShieldCheck, AlertTriangle, Download, Filter, Lock, Layers, UserCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Simulated Data
const complianceReports = [
  {
    id: "R001",
    name: "Q1 Critical Minerals Report",
    agency: "ISED",
    date: "2024-03-15",
    status: "Submitted",
    mineral: "Lithium",
    impactScore: 85,
  },
  {
    id: "R002",
    name: "Annual Environmental Impact",
    agency: "Environment Canada",
    date: "2024-01-30",
    status: "Approved",
    mineral: "Carbon (Sequestration)",
    impactScore: 92,
  },
  {
    id: "R003",
    name: "Q1 NRC Innovation Update",
    agency: "NRC",
    date: "2024-04-01",
    status: "Draft",
    mineral: "Graphene",
    impactScore: 78,
  },
  {
    id: "R004",
    name: "Export Control Assessment (CNT)",
    agency: "Global Affairs",
    date: "2024-02-20",
    status: "Flagged",
    mineral: "Carbon Nanotubes",
    impactScore: 60,
    dualUse: true,
  },
]

const auditLog = [
  {
    id: "L001",
    timestamp: "2024-04-15 10:30:12",
    user: "Dr. Smith",
    action: "Generated Q1 ISED Report",
    details: "Report R001 for Lithium",
    hash: "0xabc...",
  },
  {
    id: "L002",
    timestamp: "2024-04-14 14:22:05",
    user: "System",
    action: "Regulatory Change Alert: Cobalt",
    details: "New reporting threshold",
    hash: "0xdef...",
  },
  {
    id: "L003",
    timestamp: "2024-04-12 09:00:51",
    user: "ComplianceBot",
    action: "Flagged Dual-Use: CNT Project X",
    details: "Potential export control issue",
    hash: "0xghi...",
  },
]

const criticalMineralsData = [
  { name: "Lithium", source: "Canada", risk: "Low", stock: 5000, demand: 3500, unit: "tons" },
  { name: "Cobalt", source: "Imported", risk: "Medium", stock: 1200, demand: 1500, unit: "tons" },
  { name: "Graphite", source: "Canada/Imported", risk: "Low", stock: 10000, demand: 8000, unit: "tons" },
  { name: "Rare Earths (Nd)", source: "Imported", risk: "High", stock: 300, demand: 500, unit: "kg" },
]

export default function ComplianceReportingPage() {
  const [activeTab, setActiveTab] = useState("reports")
  const [filters, setFilters] = useState({ agency: "", status: "", mineral: "" })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredReports = complianceReports.filter(
    (report) =>
      (filters.agency ? report.agency === filters.agency : true) &&
      (filters.status ? report.status === filters.status : true) &&
      (filters.mineral ? report.mineral === filters.mineral : true),
  )

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-tn-deep-blue via-tn-primary-blue to-tn-dark-bg text-white">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center">
            <ShieldCheck className="mr-3" /> Government Compliance & Reporting
          </CardTitle>
          <CardDescription className="text-tn-text-light">
            Manage regulatory compliance for the Canadian Critical Minerals Strategy and other agencies.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-sm">Overall Compliance</p>
            <p className="text-2xl font-bold text-tn-success-green">98%</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-sm">Pending Reports</p>
            <p className="text-2xl font-bold text-yellow-400">1</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-sm">Active Alerts</p>
            <p className="text-2xl font-bold text-red-400">2</p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="minerals">Critical Minerals Tracking</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail & Security</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Deadlines</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Reports</CardTitle>
                <Button className="bg-tn-primary-green hover:bg-tn-accent-green text-white">
                  <FileText className="mr-2 h-4 w-4" /> Generate New Report
                </Button>
              </div>
              <CardDescription>View and manage all compliance reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4 p-4 border rounded-md bg-slate-50">
                <Select value={filters.agency} onValueChange={(v) => handleFilterChange("agency", v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Agency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agencies</SelectItem>
                    <SelectItem value="ISED">ISED</SelectItem>
                    <SelectItem value="NRC">NRC</SelectItem>
                    <SelectItem value="Environment Canada">Environment Canada</SelectItem>
                    <SelectItem value="Global Affairs">Global Affairs</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={(v) => handleFilterChange("status", v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.mineral} onValueChange={(v) => handleFilterChange("mineral", v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Mineral" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Minerals</SelectItem>
                    <SelectItem value="Lithium">Lithium</SelectItem>
                    <SelectItem value="Carbon (Sequestration)">Carbon (Sequestration)</SelectItem>
                    <SelectItem value="Graphene">Graphene</SelectItem>
                    <SelectItem value="Carbon Nanotubes">Carbon Nanotubes</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setFilters({ agency: "", status: "", mineral: "" })}>
                  <Filter className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mineral Focus</TableHead>
                    <TableHead>Impact Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className={report.dualUse ? "bg-yellow-50 hover:bg-yellow-100" : ""}>
                      <TableCell>{report.id}</TableCell>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.agency}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.status === "Approved"
                              ? "default"
                              : report.status === "Submitted"
                                ? "secondary"
                                : report.status === "Flagged"
                                  ? "destructive"
                                  : "outline"
                          }
                          className={report.status === "Approved" ? "bg-tn-success-green text-white" : ""}
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.mineral}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>{report.impactScore}</span>
                          <Progress
                            value={report.impactScore}
                            className="w-16 h-1.5 ml-2"
                            indicatorClassName={
                              report.impactScore > 80
                                ? "bg-tn-success-green"
                                : report.impactScore > 60
                                  ? "bg-yellow-400"
                                  : "bg-red-500"
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="minerals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Minerals Supply Chain Tracking</CardTitle>
              <CardDescription>Monitor stock levels, demand, and supply chain risks for key minerals.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mineral</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Supply Risk</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Projected Demand</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criticalMineralsData.map((mineral) => (
                    <TableRow key={mineral.name}>
                      <TableCell className="font-medium">{mineral.name}</TableCell>
                      <TableCell>{mineral.source}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            mineral.risk === "High"
                              ? "destructive"
                              : mineral.risk === "Medium"
                                ? "secondary"
                                : "default"
                          }
                          className={mineral.risk === "Low" ? "bg-tn-success-green text-white" : ""}
                        >
                          {mineral.risk}
                        </Badge>
                      </TableCell>
                      <TableCell>{mineral.stock.toLocaleString()}</TableCell>
                      <TableCell>{mineral.demand.toLocaleString()}</TableCell>
                      <TableCell>{mineral.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 p-4 border rounded-md bg-slate-50">
                <h4 className="font-semibold mb-2">Environmental Impact Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    Total Carbon Sequestered: <span className="font-bold text-tn-success-green">1,250 tons CO2e</span>
                  </p>
                  <p>
                    Water Usage Efficiency: <span className="font-bold text-tn-primary-blue">+15% vs. Baseline</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Immutable Audit Trail & Security Status</CardTitle>
              <CardDescription>Review all system actions and security compliance indicators.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <ShieldCheck className="h-5 w-5 mr-2 text-tn-success-green" /> SOC 2 Compliant
                    </div>
                    <p className="text-xs text-gray-600">Type II Certification Valid</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-tn-primary-blue" /> AES-256 Encryption
                    </div>
                    <p className="text-xs text-gray-600">Data at Rest & In Transit</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <UserCheck className="h-5 w-5 mr-2 text-purple-600" /> Role-Based Access
                    </div>
                    <p className="text-xs text-gray-600">Permissions Enforced</p>
                  </CardContent>
                </Card>
              </div>
              <h4 className="font-semibold mb-2">Activity Log (Blockchain-Style Immutability Simulated)</h4>
              <ScrollArea className="h-[300px] border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User/System</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Tx Hash (Simulated)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLog.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-xs max-w-xs truncate">{log.details}</TableCell>
                        <TableCell className="font-mono text-xs">{log.hash}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Alerts & Deadlines</CardTitle>
              <CardDescription>Stay ahead of regulatory changes and reporting deadlines.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start p-4 border border-yellow-300 bg-yellow-50 rounded-md">
                  <AlertTriangle className="h-5 w-5 mr-3 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-700">
                      Upcoming Deadline: Q2 Critical Minerals Report (ISED)
                    </h4>
                    <p className="text-sm text-yellow-600">Due: 2024-06-15 (18 days remaining)</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 border-yellow-500 text-yellow-600 hover:bg-yellow-100"
                    >
                      Start Draft
                    </Button>
                  </div>
                </div>
                <div className="flex items-start p-4 border border-blue-300 bg-blue-50 rounded-md">
                  <Layers className="h-5 w-5 mr-3 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-700">
                      Regulatory Update: New Carbon Sequestration Guidelines
                    </h4>
                    <p className="text-sm text-blue-600">Effective: 2024-07-01. Review impact on current projects.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 border-blue-500 text-blue-600 hover:bg-blue-100"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <div className="flex items-start p-4 border border-red-300 bg-red-50 rounded-md">
                  <AlertTriangle className="h-5 w-5 mr-3 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-700">Action Required: Dual-Use Technology Flag</h4>
                    <p className="text-sm text-red-600">
                      Project "CNT-Advanced-Coatings" requires export control review. Report R004.
                    </p>
                    <Button size="sm" variant="outline" className="mt-2 border-red-500 text-red-600 hover:bg-red-100">
                      Review Case
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
