"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Star,
  Send,
  Search,
  Filter,
  ExternalLink,
  Heart,
  MessageSquare,
  Calendar,
  Bookmark,
  TrendingUp,
  Award,
  DollarSign,
  Target,
  CheckCircle2
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Company {
  id: string
  name: string
  industry: string
  description: string
  website?: string
  email?: string
  phone?: string
  location?: string
  size?: string
  funding?: string
  relevanceScore?: number
  matchedCriteria?: string[]
  logo?: string
  founded?: string
  revenue?: string
}

interface CompanyDirectoryProps {
  industries?: any[]
  productSummary?: string
}

export default function CompanyDirectory({ industries = [], productSummary }: CompanyDirectoryProps) {
  const { toast } = useToast()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    contactType: "introduction"
  })

  // Mock companies data - in real implementation, this would come from your API
  const mockCompanies: Company[] = [
    {
      id: "1",
      name: "GreenBuild Materials Inc.",
      industry: "Concrete & Construction Materials",
      description: "Leading sustainable construction materials manufacturer specializing in eco-friendly concrete additives and green building solutions.",
      website: "https://greenbuild-materials.com",
      email: "partnerships@greenbuild-materials.com",
      phone: "+1 (555) 123-4567",
      location: "Seattle, WA",
      size: "500-1000 employees",
      funding: "Series C",
      relevanceScore: 95,
      matchedCriteria: ["Sustainable materials", "Concrete additives", "Green building"],
      founded: "2015",
      revenue: "$50M-$100M"
    },
    {
      id: "2",
      name: "AquaPure Technologies",
      industry: "Environmental Remediation & Water Filtration",
      description: "Advanced water treatment and environmental remediation solutions for industrial and municipal applications.",
      website: "https://aquapure-tech.com",
      email: "business@aquapure-tech.com",
      phone: "+1 (555) 234-5678",
      location: "Austin, TX",
      size: "100-500 employees",
      funding: "Series B",
      relevanceScore: 88,
      matchedCriteria: ["PFAS remediation", "Water filtration", "Environmental tech"],
      founded: "2018",
      revenue: "$25M-$50M"
    },
    {
      id: "3",
      name: "SustainAg Solutions",
      industry: "Agriculture & Horticulture",
      description: "Innovative agricultural solutions focused on soil health, sustainable farming practices, and carbon sequestration.",
      website: "https://sustainag.com",
      email: "partnerships@sustainag.com",
      phone: "+1 (555) 345-6789",
      location: "Des Moines, IA",
      size: "50-100 employees",
      funding: "Seed",
      relevanceScore: 82,
      matchedCriteria: ["Soil amendment", "Carbon sequestration", "Organic farming"],
      founded: "2020",
      revenue: "$10M-$25M"
    },
    {
      id: "4",
      name: "ElectroGreen Corp",
      industry: "Sustainable Electronics & Battery Manufacturing",
      description: "Next-generation battery technologies and sustainable electronics manufacturing with focus on renewable materials.",
      website: "https://electrogreen.com",
      email: "innovation@electrogreen.com",
      phone: "+1 (555) 456-7890",
      location: "San Jose, CA",
      size: "1000+ employees",
      funding: "IPO",
      relevanceScore: 77,
      matchedCriteria: ["Battery materials", "Sustainable electronics", "Carbon materials"],
      founded: "2012",
      revenue: "$500M+"
    },
    {
      id: "5",
      name: "CarbonVault Ltd",
      industry: "Carbon Credit & ESG Tracking Software",
      description: "ESG tracking and carbon credit management platform helping companies achieve net-zero goals through verified carbon removal.",
      website: "https://carbonvault.com",
      email: "sales@carbonvault.com",
      phone: "+1 (555) 567-8901",
      location: "New York, NY",
      size: "50-100 employees",
      funding: "Series A",
      relevanceScore: 85,
      matchedCriteria: ["Carbon credits", "ESG tracking", "Net-zero solutions"],
      founded: "2019",
      revenue: "$5M-$10M"
    }
  ]

  useEffect(() => {
    // Simulate API call to fetch companies
    setLoading(true)
    setTimeout(() => {
      setCompanies(mockCompanies)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchQuery === "" || 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesIndustry = selectedIndustry === "all" || 
      company.industry === selectedIndustry
    
    return matchesSearch && matchesIndustry
  })

  const handleContactCompany = async (company: Company) => {
    setSelectedCompany(company)
    setContactForm({
      subject: `Partnership Opportunity - ${productSummary ? 'Innovative Material Solution' : 'Business Collaboration'}`,
      message: `Hello ${company.name} team,\n\nI hope this message finds you well. I'm reaching out regarding a potential partnership opportunity that could be of mutual interest.\n\n${productSummary ? `We have developed an innovative material solution with applications in ${company.industry}. ` : ''}Based on our market research, your company's expertise in ${company.industry} aligns perfectly with our offering.\n\nI would love to schedule a brief call to discuss how we might collaborate and create value together.\n\nBest regards`,
      contactType: "introduction"
    })
    setShowContactDialog(true)
  }

  const handleSendMessage = async () => {
    if (!selectedCompany) return

    try {
      // In real implementation, this would send email via your API
      // await sendContactEmail({
      //   to: selectedCompany.email,
      //   subject: contactForm.subject,
      //   message: contactForm.message,
      //   contactType: contactForm.contactType
      // })

      toast({
        title: "Message Sent Successfully!",
        description: `Your message has been sent to ${selectedCompany.name}. They should respond within 1-2 business days.`,
      })
      
      setShowContactDialog(false)
      setContactForm({ subject: "", message: "", contactType: "introduction" })
    } catch (error) {
      toast({
        title: "Failed to Send Message",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive"
      })
    }
  }

  const toggleFavorite = (companyId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(companyId)) {
      newFavorites.delete(companyId)
    } else {
      newFavorites.add(companyId)
    }
    setFavorites(newFavorites)
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 80) return "bg-blue-100 text-blue-800 border-blue-200"
    if (score >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Company Directory
          </CardTitle>
          <p className="text-gray-600">
            Find and connect with companies in your target industries
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search companies by name, industry, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry: any, index: number) => (
                    <SelectItem key={index} value={industry.industry}>
                      {industry.industry}
                    </SelectItem>
                  ))}
                  {companies.map(company => company.industry)
                    .filter((industry, index, self) => self.indexOf(industry) === index)
                    .map(industry => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Found {filteredCompanies.length} companies
          {selectedIndustry !== "all" && ` in ${selectedIndustry}`}
        </p>
        {favorites.size > 0 && (
          <Badge variant="outline" className="text-pink-600 border-pink-200">
            <Heart className="w-3 h-3 mr-1" />
            {favorites.size} Favorites
          </Badge>
        )}
      </div>

      {/* Company Cards */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Company Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(company.id)}
                      className="text-gray-400 hover:text-pink-500"
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(company.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                    </Button>
                  </div>

                  {/* Relevance Score */}
                  {company.relevanceScore && (
                    <div className="flex items-center gap-2">
                      <Badge className={getRelevanceColor(company.relevanceScore)}>
                        <Star className="w-3 h-3 mr-1" />
                        {company.relevanceScore}% Match
                      </Badge>
                      <span className="text-xs text-gray-500">Relevance Score</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {company.description}
                  </p>

                  {/* Matched Criteria */}
                  {company.matchedCriteria && (
                    <div className="flex flex-wrap gap-1">
                      {company.matchedCriteria.slice(0, 3).map((criteria, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {criteria}
                        </Badge>
                      ))}
                      {company.matchedCriteria.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{company.matchedCriteria.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Company Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    {company.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {company.location}
                      </div>
                    )}
                    {company.size && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {company.size}
                      </div>
                    )}
                    {company.revenue && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {company.revenue}
                      </div>
                    )}
                    {company.founded && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Est. {company.founded}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <Button
                      size="sm"
                      onClick={() => handleContactCompany(company)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                    {company.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(company.website, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCompanies.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Companies Found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or industry filter.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Contact {selectedCompany?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Company Summary */}
            {selectedCompany && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {selectedCompany.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedCompany.name}</h4>
                    <p className="text-sm text-gray-600">{selectedCompany.industry}</p>
                  </div>
                </div>
                {selectedCompany.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {selectedCompany.email}
                  </div>
                )}
              </div>
            )}

            {/* Contact Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Type
                </label>
                <Select value={contactForm.contactType} onValueChange={(value) => 
                  setContactForm(prev => ({ ...prev, contactType: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="introduction">Business Introduction</SelectItem>
                    <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                    <SelectItem value="meeting">Meeting Request</SelectItem>
                    <SelectItem value="information">Information Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Compose your message..."
                  rows={8}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowContactDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!contactForm.subject || !contactForm.message}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
