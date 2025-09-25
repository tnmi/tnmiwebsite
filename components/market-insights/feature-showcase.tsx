"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3,
  Building2,
  Users,
  FileText,
  Download,
  Share2,
  Shield,
  Target,
  Zap,
  CheckCircle2,
  Star,
  Globe
} from "lucide-react"

export default function FeatureShowcase() {
  const features = [
    {
      icon: BarChart3,
      title: "Research Dashboard",
      description: "Executive overview with key metrics, progress tracking, and visual insights",
      capabilities: ["Progress Tracking", "Key Metrics", "Visual Analytics", "Timeline View"]
    },
    {
      icon: Target,
      title: "Industry Analysis",
      description: "Comprehensive analysis of market opportunities across multiple industries",
      capabilities: ["Market Opportunities", "Technical Fit Analysis", "Benefits & Challenges", "Relevance Scoring"]
    },
    {
      icon: Shield,
      title: "Technical Validation",
      description: "Professional validation against industry standards and compliance requirements",
      capabilities: ["Standards Compliance", "Market Readiness", "Technical Assessment", "Integration Requirements"]
    },
    {
      icon: Building2,
      title: "Company Directory",
      description: "Smart company matching and contact management system",
      capabilities: ["Smart Matching", "Contact Management", "CRM Integration", "Relevance Scoring"]
    },
    {
      icon: Download,
      title: "Export & Sharing",
      description: "Professional reporting with multiple export formats and sharing options",
      capabilities: ["PDF Reports", "Excel Data", "PowerPoint Slides", "Secure Sharing"]
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Live updates and progress tracking throughout the research process",
      capabilities: ["Live Updates", "Status Tracking", "Error Handling", "Completion Notifications"]
    }
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Star className="w-6 h-6" />
            Enhanced Market Insights Platform
          </CardTitle>
          <p className="text-blue-100">
            A comprehensive UX/UI solution for displaying complex market research data in a meaningful, 
            digestible way with integrated company contact and CRM capabilities.
          </p>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon
          return (
            <Card key={index} className="border-2 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Key Capabilities:</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.capabilities.map((capability, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Data Structure Highlights */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Data Structure Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-900 mb-3">Rich Data Processing</h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Multi-industry analysis with detailed market opportunities
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Technical properties and validation results
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Research sources and academic references
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Benefits, challenges, and risk assessment
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-3">User Experience Features</h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Intuitive tabbed navigation and filtering
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Progressive disclosure of complex information
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Visual indicators and color-coded status
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Mobile-responsive design patterns
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Summary */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Implementation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">Components Created</h4>
              <ul className="space-y-1 text-indigo-800">
                <li>• OrderDetailsEnhanced</li>
                <li>• CompanyDirectory</li>
                <li>• ResearchDashboard</li>
                <li>• ExportShare</li>
                <li>• Enhanced Market Insights Page</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">Key Technologies</h4>
              <ul className="space-y-1 text-indigo-800">
                <li>• React + TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Radix UI Components</li>
                <li>• Lucide Icons</li>
                <li>• Responsive Design</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">Business Value</h4>
              <ul className="space-y-1 text-indigo-800">
                <li>• Improved data comprehension</li>
                <li>• Streamlined contact workflows</li>
                <li>• Professional reporting</li>
                <li>• Enhanced user engagement</li>
                <li>• Scalable architecture</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
