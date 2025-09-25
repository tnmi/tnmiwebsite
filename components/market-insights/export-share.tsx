"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Download,
  Share2,
  Mail,
  Link,
  FileText,
  Image,
  Presentation,
  Users,
  Copy,
  Check,
  Send,
  Eye,
  Clock,
  Star
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ExportShareProps {
  orderData: any
  orderSummary?: {
    orderId: string
    productId: string
    status: string
    createdAt: string
  }
}

export default function ExportShare({ orderData, orderSummary }: ExportShareProps) {
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState("pdf")
  const [shareMethod, setShareMethod] = useState("email")
  const [isExporting, setIsExporting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareForm, setShareForm] = useState({
    emails: "",
    subject: "",
    message: "",
    includeRawData: false,
    accessLevel: "view" // view, comment, edit
  })
  const [linkCopied, setLinkCopied] = useState(false)

  const handleExport = async (format: string) => {
    setIsExporting(true)
    try {
      // In real implementation, this would call your export API
      // const response = await marketResearchAPI.exportOrderPDF(orderSummary?.orderId, userId)
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a mock download
      const link = document.createElement('a')
      link.href = '#' // In real implementation, this would be the blob URL
      link.download = `market-research-${orderSummary?.orderId || 'report'}.${format}`
      
      toast({
        title: "Export Successful!",
        description: `Your market research report has been exported as ${format.toUpperCase()}.`,
      })
      
      // In real implementation: document.body.appendChild(link); link.click(); document.body.removeChild(link)
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your report. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      // In real implementation, this would call your sharing API
      // await shareReport({
      //   orderId: orderSummary?.orderId,
      //   emails: shareForm.emails.split(',').map(e => e.trim()),
      //   subject: shareForm.subject,
      //   message: shareForm.message,
      //   includeRawData: shareForm.includeRawData,
      //   accessLevel: shareForm.accessLevel
      // })

      // Simulate sharing process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Report Shared Successfully!",
        description: `Your market research report has been shared with ${shareForm.emails.split(',').length} recipient(s).`,
      })
      
      // Reset form
      setShareForm({
        emails: "",
        subject: "",
        message: "",
        includeRawData: false,
        accessLevel: "view"
      })
      
    } catch (error) {
      toast({
        title: "Sharing Failed",
        description: "There was an error sharing your report. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      // In real implementation, generate a shareable link
      const shareableLink = `${window.location.origin}/shared-report/${orderSummary?.orderId || 'demo'}?token=abc123`
      
      await navigator.clipboard.writeText(shareableLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
      
      toast({
        title: "Link Copied!",
        description: "The shareable link has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      })
    }
  }

  const exportOptions = [
    {
      value: "pdf",
      label: "PDF Report",
      description: "Complete research report with all findings",
      icon: FileText,
      size: "2-5 MB"
    },
    {
      value: "excel",
      label: "Excel Spreadsheet",
      description: "Data tables and metrics for analysis",
      icon: FileText,
      size: "500 KB - 2 MB"
    },
    {
      value: "powerpoint",
      label: "PowerPoint Presentation",
      description: "Executive summary and key insights",
      icon: Presentation,
      size: "1-3 MB"
    },
    {
      value: "image",
      label: "Image Summary",
      description: "Visual overview of key findings",
      icon: Image,
      size: "200-500 KB"
    }
  ]

  const accessLevels = [
    { value: "view", label: "View Only", description: "Recipients can only view the report" },
    { value: "comment", label: "Comment", description: "Recipients can add comments and feedback" },
    { value: "edit", label: "Edit", description: "Recipients can edit and collaborate on the report" }
  ]

  // Calculate report metrics for display
  const reportMetrics = {
    industries: orderData?.raw_research_data?.flatMap((item: any) => 
      item.research_data?.industries || []
    ).length || 0,
    sources: orderData?.raw_research_data?.reduce((total: number, item: any) => 
      total + (item.research_data?.research_sources?.length || 0), 0
    ) || 0,
    validations: orderData?.raw_research_data?.filter((item: any) => 
      item.research_type === "unknown" && item.research_data?.type === "validation_results"
    ).length || 0
  }

  return (
    <div className="flex gap-2">
      {/* Export Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Export Market Research Report
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Report Overview */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-900">Report Overview</h4>
                  <Badge className="bg-blue-100 text-blue-800">
                    Order: {orderSummary?.orderId || 'N/A'}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-blue-900">{reportMetrics.industries}</p>
                    <p className="text-blue-700">Industries</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-blue-900">{reportMetrics.sources}</p>
                    <p className="text-blue-700">Sources</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-blue-900">{reportMetrics.validations}</p>
                    <p className="text-blue-700">Validations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Format Selection */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Choose Export Format</h4>
              <div className="grid gap-3">
                {exportOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <Card 
                      key={option.value}
                      className={`cursor-pointer transition-all ${
                        exportFormat === option.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setExportFormat(option.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              exportFormat === option.value ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <IconComponent className={`w-5 h-5 ${
                                exportFormat === option.value ? 'text-blue-600' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{option.label}</p>
                              <p className="text-sm text-gray-600">{option.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">
                              {option.size}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Export Button */}
            <Button 
              onClick={() => handleExport(exportFormat)}
              disabled={isExporting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isExporting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export {exportOptions.find(o => o.value === exportFormat)?.label}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-green-600" />
              Share Market Research Report
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Share Method Selection */}
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all ${
                  shareMethod === 'email' ? 'border-green-500 bg-green-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setShareMethod('email')}
              >
                <CardContent className="p-4 text-center">
                  <Mail className={`w-8 h-8 mx-auto mb-2 ${
                    shareMethod === 'email' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <p className="font-medium">Email Sharing</p>
                  <p className="text-sm text-gray-600">Send via email with custom message</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${
                  shareMethod === 'link' ? 'border-green-500 bg-green-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setShareMethod('link')}
              >
                <CardContent className="p-4 text-center">
                  <Link className={`w-8 h-8 mx-auto mb-2 ${
                    shareMethod === 'link' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <p className="font-medium">Shareable Link</p>
                  <p className="text-sm text-gray-600">Generate a link for easy sharing</p>
                </CardContent>
              </Card>
            </div>

            {/* Email Sharing Form */}
            {shareMethod === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Emails (comma separated)
                  </label>
                  <Input
                    placeholder="john@company.com, mary@startup.com"
                    value={shareForm.emails}
                    onChange={(e) => setShareForm(prev => ({ ...prev, emails: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Level
                  </label>
                  <Select 
                    value={shareForm.accessLevel} 
                    onValueChange={(value) => setShareForm(prev => ({ ...prev, accessLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accessLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <p className="font-medium">{level.label}</p>
                            <p className="text-xs text-gray-600">{level.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject
                  </label>
                  <Input
                    placeholder="Market Research Report - [Product Name]"
                    value={shareForm.subject}
                    onChange={(e) => setShareForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <Textarea
                    placeholder="Hi team, I wanted to share our latest market research findings with you..."
                    value={shareForm.message}
                    onChange={(e) => setShareForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleShare}
                  disabled={isSharing || !shareForm.emails}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isSharing ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Report
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Link Sharing */}
            {shareMethod === 'link' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Shareable Link</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Anyone with this link will be able to view your market research report.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={`${window.location.origin}/shared-report/${orderSummary?.orderId || 'demo'}?token=abc123`}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopyLink}
                      className={linkCopied ? 'bg-green-50 text-green-700 border-green-200' : ''}
                    >
                      {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <Eye className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <p className="font-medium text-blue-900">View Access</p>
                      <p className="text-sm text-blue-700">Recipients can view the full report</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4 text-center">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                      <p className="font-medium text-amber-900">Valid for 30 Days</p>
                      <p className="text-sm text-amber-700">Link expires automatically</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
