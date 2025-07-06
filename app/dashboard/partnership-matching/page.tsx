"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Users,
  Filter,
  MessageSquare,
  FileSignature,
  Zap,
  Lightbulb,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Scale,
  Brain,
  CalendarDays,
  CheckCircle2,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

interface Startup {
  id: string
  name: string
  focus: string
  technologyKeywords: string[]
  trl: number
  fundingStage: string
  ipStrength: number // 0-1
  marketPotential: number // 0-1
  teamStrength: number // 0-1
  financialHealth: number // 0-1
  logo: string
  description: string
}

interface IndustryPartner {
  id: string
  name: string
  industry: string
  technologyNeedsKeywords: string[]
  strategicAlignmentAreas: string[]
  riskAppetite: "Low" | "Medium" | "High" // 0.3, 0.6, 0.9
  logo: string
  description: string
}

interface MatchScore {
  overall: number
  technologyCompatibility: number
  marketTiming: number
  ipLandscape: number
  financialSynergy: number
}

interface Match extends Startup {
  matchScore: MatchScore
  successProbability: {
    value: number
    confidenceInterval: [number, number]
  }
  recommendedActions: string[]
}

const sampleStartups: Startup[] = [
  {
    id: "s1",
    name: "NanoInnovate Inc.",
    focus: "Carbon Nanotubes",
    technologyKeywords: ["carbon nanotubes", "composites", "material science", "aerospace"],
    trl: 5,
    fundingStage: "Seed",
    ipStrength: 0.7,
    marketPotential: 0.9,
    teamStrength: 0.8,
    financialHealth: 0.6,
    logo: "/placeholder.svg",
    description: "Developing next-gen CNTs for aerospace applications with enhanced tensile strength.",
  },
  {
    id: "s2",
    name: "GrapheneX Solutions",
    focus: "Graphene Composites",
    technologyKeywords: ["graphene", "polymers", "conductive materials", "automotive"],
    trl: 4,
    fundingStage: "Series A",
    ipStrength: 0.85,
    marketPotential: 0.75,
    teamStrength: 0.7,
    financialHealth: 0.8,
    logo: "/placeholder.svg",
    description: "Pioneering graphene-infused polymers for lightweight automotive components.",
  },
  {
    id: "s3",
    name: "LithiumCore Tech",
    focus: "Solid-State Batteries",
    technologyKeywords: ["lithium", "solid-state", "battery technology", "energy storage"],
    trl: 6,
    fundingStage: "Series B",
    ipStrength: 0.9,
    marketPotential: 0.8,
    teamStrength: 0.9,
    financialHealth: 0.85,
    logo: "/placeholder.svg",
    description: "Advanced solid-state lithium batteries for high-performance energy storage solutions.",
  },
  {
    id: "s4",
    name: "BioSynth Materials",
    focus: "Bio-based Polymers",
    technologyKeywords: ["biopolymers", "sustainable materials", "packaging", "circular economy"],
    trl: 3,
    fundingStage: "Pre-seed",
    ipStrength: 0.5,
    marketPotential: 0.85,
    teamStrength: 0.6,
    financialHealth: 0.4,
    logo: "/placeholder.svg",
    description: "Creating biodegradable polymers from agricultural waste for sustainable packaging.",
  },
]

const sampleIndustryPartners: IndustryPartner[] = [
  {
    id: "i1",
    name: "AeroSpace Corp.",
    industry: "Aerospace",
    technologyNeedsKeywords: [
      "lightweight materials",
      "high strength composites",
      "carbon nanotubes",
      "thermal management",
    ],
    strategicAlignmentAreas: ["Next-gen aircraft", "Satellite components"],
    riskAppetite: "Medium",
    logo: "/placeholder.svg",
    description:
      "Leading aerospace manufacturer seeking innovative materials for enhanced performance and fuel efficiency.",
  },
  {
    id: "i2",
    name: "AutoDrive Motors",
    industry: "Automotive",
    technologyNeedsKeywords: ["battery technology", "durable polymers", "graphene", "lightweighting"],
    strategicAlignmentAreas: ["Electric vehicles", "Autonomous driving sensors"],
    riskAppetite: "High",
    logo: "/placeholder.svg",
    description: "Global automotive leader focused on next-generation EV and autonomous vehicle technologies.",
  },
  {
    id: "i3",
    name: "BuildGreen Construction",
    industry: "Construction",
    technologyNeedsKeywords: ["sustainable concrete", "insulation materials", "smart building materials"],
    strategicAlignmentAreas: ["Green buildings", "Net-zero construction"],
    riskAppetite: "Low",
    logo: "/placeholder.svg",
    description:
      "Pioneer in sustainable construction, looking for eco-friendly and high-performance building materials.",
  },
]

// Simulated AI weighting and scoring
const calculateMatchScores = (startup: Startup, partner: IndustryPartner | null): MatchScore => {
  if (!partner) {
    // Default scores if no partner selected for general listing
    return {
      overall: (startup.marketPotential + startup.ipStrength + startup.teamStrength) * 33,
      technologyCompatibility: startup.trl * 10 + 20,
      marketTiming: startup.marketPotential * 80 + 10,
      ipLandscape: startup.ipStrength * 70 + 15,
      financialSynergy: startup.financialHealth * 60 + 20,
    }
  }

  // Technology Compatibility (simple keyword match)
  const techKeywordsMatch = startup.technologyKeywords.filter((kw) =>
    partner.technologyNeedsKeywords.includes(kw),
  ).length
  const techCompatibilityScore = Math.min(
    100,
    (techKeywordsMatch / Math.min(startup.technologyKeywords.length, 3)) * 80 + startup.trl * 3,
  )

  // Market Timing (combining startup potential and partner industry)
  const marketTimingScore = Math.min(100, startup.marketPotential * 60 + (partner.industry === "Automotive" ? 30 : 15))

  // IP Landscape (startup IP strength, penalize for very low)
  const ipLandscapeScore = Math.min(100, startup.ipStrength * 80 + (startup.ipStrength > 0.3 ? 20 : 0))

  // Financial Synergy (startup health and partner risk appetite)
  const riskAppetiteValue = partner.riskAppetite === "Low" ? 0.4 : partner.riskAppetite === "Medium" ? 0.7 : 1.0
  const financialSynergyScore = Math.min(100, startup.financialHealth * 50 + riskAppetiteValue * 50)

  // Overall Weighted Score
  const overallScore =
    techCompatibilityScore * 0.4 + marketTimingScore * 0.25 + ipLandscapeScore * 0.2 + financialSynergyScore * 0.15

  return {
    overall: Math.round(overallScore),
    technologyCompatibility: Math.round(techCompatibilityScore),
    marketTiming: Math.round(marketTimingScore),
    ipLandscape: Math.round(ipLandscapeScore),
    financialSynergy: Math.round(financialSynergyScore),
  }
}

const calculateSuccessProbability = (score: MatchScore): Match["successProbability"] => {
  const baseProb = score.overall / 100
  const value = Math.min(0.95, Math.max(0.1, baseProb * 0.8 + 0.1)) // Scale and clamp
  const uncertainty = 0.15 * (1 - score.overall / 100) + 0.05 // Higher uncertainty for lower scores
  return {
    value: Math.round(value * 100),
    confidenceInterval: [
      Math.max(0, Math.round((value - uncertainty) * 100)),
      Math.min(100, Math.round((value + uncertainty) * 100)),
    ],
  }
}

export default function PartnershipMatchingPage() {
  const [filters, setFilters] = useState({
    trl: [3, 7],
    fundingStage: "",
    technologyArea: "", // For startups
    industryFocus: "", // For filtering partners (or startups if partner is selected)
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStartup, setSelectedStartup] = useState<Match | null>(null)
  const [selectedIndustryPartner, setSelectedIndustryPartner] = useState<IndustryPartner | null>(
    sampleIndustryPartners[0],
  ) // Default to first partner
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [timelineEvents, setTimelineEvents] = useState<any[]>([])

  useEffect(() => {
    setIsLoading(true)
    // Simulate API call for filtering and AI matching
    setTimeout(() => {
      let startupsToScore = sampleStartups.filter(
        (s) =>
          s.trl >= filters.trl[0] &&
          s.trl <= filters.trl[1] &&
          (filters.fundingStage ? s.fundingStage === filters.fundingStage : true) &&
          (filters.technologyArea
            ? s.technologyKeywords.some((kw) => kw.toLowerCase().includes(filters.technologyArea.toLowerCase()))
            : true) &&
          (searchTerm ? s.name.toLowerCase().includes(searchTerm.toLowerCase()) : true),
      )

      if (
        selectedIndustryPartner &&
        filters.industryFocus &&
        selectedIndustryPartner.industry !== filters.industryFocus
      ) {
        // If an industry partner is selected and the filter doesn't match them, show no startups.
        // Or, you might want to filter startups based on their suitability for the *filtered* industry,
        // even if the *selected* partner is different. For now, simple logic:
        startupsToScore = []
      }

      const matches: Match[] = startupsToScore
        .map((startup) => {
          const matchScore = calculateMatchScores(startup, selectedIndustryPartner)
          const successProbability = calculateSuccessProbability(matchScore)
          return {
            ...startup,
            matchScore,
            successProbability,
            recommendedActions: [
              "Initiate contact via secure chat.",
              "Request detailed IP portfolio.",
              `Schedule introductory call for ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}.`,
            ],
          }
        })
        .sort((a, b) => b.matchScore.overall - a.matchScore.overall)

      setFilteredMatches(matches)
      setIsLoading(false)
    }, 700)
  }, [filters, searchTerm, selectedIndustryPartner])

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSelectStartup = (startup: Match) => {
    setSelectedStartup(startup)
    // Simulate loading chat history & timeline
    setChatMessages([
      {
        sender: "AI Assistant",
        text: `Secure channel with ${startup.name} established.`,
        time: new Date().toLocaleTimeString(),
        type: "system",
      },
      {
        sender: selectedIndustryPartner?.name || "Industry Partner",
        text: `Hello ${startup.name}, we are ${selectedIndustryPartner?.name || "an interested party"} and impressed by your work in ${startup.focus}.`,
        time: new Date().toLocaleTimeString(),
        type: "received",
      },
    ])
    setTimelineEvents([
      { date: new Date().toLocaleDateString(), event: "Initial Match Identified by AI", status: "Completed" },
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        event: "Automated Introduction Email Sent",
        status: "Pending",
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        event: "Follow-up Reminder",
        status: "Scheduled",
      },
    ])
  }

  const handleSendMessage = () => {
    if (chatInput.trim() === "" || !selectedStartup || !selectedIndustryPartner) return
    const newMsg = {
      sender: "You (" + selectedIndustryPartner.name + ")",
      text: chatInput,
      time: new Date().toLocaleTimeString(),
      type: "sent",
    }
    setChatMessages((prev) => [...prev, newMsg])
    // Simulate partner response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: selectedStartup.name,
          text: "Thank you for your message. We're excited to discuss further.",
          time: new Date().toLocaleTimeString(),
          type: "received",
        },
      ])
    }, 1000)
    setChatInput("")
    setTimelineEvents((prev) => [
      ...prev,
      { date: new Date().toLocaleDateString(), event: "Message sent to " + selectedStartup.name, status: "Completed" },
    ])
  }

  const ScoreDisplay = ({
    title,
    score,
    icon: Icon,
    tooltip,
  }: { title: string; score: number; icon: React.ElementType; tooltip: string }) => (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div className="text-center p-2 bg-slate-50 rounded-md border">
            <Icon className="w-6 h-6 mx-auto text-tn-primary-blue mb-1" />
            <p className="text-xs text-slate-500">{title}</p>
            <p className="text-lg font-bold text-tn-deep-blue">{score}%</p>
            <Progress value={score} className="h-1.5 mt-1" indicatorClassName="bg-tn-primary-blue" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs" sideOffset={5}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full max-h-[calc(100vh-8rem)]">
      {/* Filters Panel */}
      <Card className="lg:col-span-3 overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 text-tn-primary-blue" /> Partnership Filters
          </CardTitle>
          <CardDescription>Refine your search for optimal startup matches.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="industryPartnerSelect">Select Your Company (Industry Partner)</Label>
            <Select
              value={selectedIndustryPartner?.id}
              onValueChange={(partnerId) =>
                setSelectedIndustryPartner(sampleIndustryPartners.find((p) => p.id === partnerId) || null)
              }
            >
              <SelectTrigger id="industryPartnerSelect">
                <SelectValue placeholder="Select Industry Partner" />
              </SelectTrigger>
              <SelectContent>
                {sampleIndustryPartners.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="search">Search Startup Name</Label>
            <Input
              id="search"
              placeholder="E.g., NanoInnovate"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label>
              TRL Range: {filters.trl[0]} - {filters.trl[1]}
            </Label>
            <Slider min={1} max={9} step={1} value={filters.trl} onValueChange={(v) => handleFilterChange("trl", v)} />
          </div>
          <div>
            <Label htmlFor="fundingStage">Funding Stage</Label>
            <Select value={filters.fundingStage} onValueChange={(v) => handleFilterChange("fundingStage", v)}>
              <SelectTrigger id="fundingStage">
                <SelectValue placeholder="Any Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Stage</SelectItem>
                <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="technologyArea">Technology Area (Startup)</Label>
            <Input
              id="technologyArea"
              placeholder="E.g., Graphene"
              value={filters.technologyArea}
              onChange={(e) => handleFilterChange("technologyArea", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="industryFocus">Target Industry (Partner)</Label>
            <Select value={filters.industryFocus} onValueChange={(v) => handleFilterChange("industryFocus", v)}>
              <SelectTrigger id="industryFocus">
                <SelectValue placeholder="Any Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Industry</SelectItem>
                <SelectItem value="Aerospace">Aerospace</SelectItem>
                <SelectItem value="Automotive">Automotive</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Energy">Energy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Matching Results */}
      <Card className="lg:col-span-4 overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 text-tn-primary-green" /> AI-Powered Matches ({filteredMatches.length})
          </CardTitle>
          <CardDescription>Startups matching your criteria, ranked by AI.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Brain className="w-8 h-8 animate-pulse text-tn-primary-blue" /> <p className="ml-2">AI is thinking...</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <p className="text-center text-slate-500 py-10">
              No startups match your current filters and selected industry partner.
            </p>
          ) : (
            <ScrollArea className="h-[calc(100vh-18rem)] pr-3">
              <div className="space-y-3">
                {filteredMatches.map((match) => (
                  <Card
                    key={match.id}
                    className={`hover:shadow-xl transition-all duration-200 ease-in-out cursor-pointer ${selectedStartup?.id === match.id ? "ring-2 ring-tn-primary-green shadow-xl" : "border-slate-200"}`}
                    onClick={() => handleSelectStartup(match)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-14 w-14 border-2 border-tn-primary-blue">
                          <AvatarImage src={match.logo || "/placeholder.svg"} alt={match.name} />
                          <AvatarFallback>{match.name.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-lg text-tn-deep-blue">{match.name}</h3>
                            <Badge className="bg-tn-primary-green text-white">
                              AI Score: {match.matchScore.overall}%
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{match.focus}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-2">{match.description}</p>
                          <div className="flex items-center space-x-3 text-xs text-slate-500">
                            <span className="flex items-center">
                              <Lightbulb className="w-3 h-3 mr-1 text-yellow-500" /> TRL: {match.trl}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1 text-green-500" /> {match.fundingStage}
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedStartup?.id === match.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 pt-3 border-t border-dashed"
                        >
                          <p className="text-xs text-center text-tn-primary-green font-semibold">
                            Selected for Details
                          </p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Selected Partner Details & Chat */}
      <Card className="lg:col-span-5 flex flex-col overflow-y-auto">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center">
            <Users className="mr-2 text-tn-accent-green" /> Partnership Engagement Hub
          </CardTitle>
          <CardDescription>
            {selectedStartup ? `Engaging with ${selectedStartup.name}` : "Select a startup match to engage."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col min-h-0 space-y-4">
          {!selectedStartup ? (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
              <Zap className="h-16 w-16 mb-3" />
              <p className="text-center">
                Select a startup from the list to view detailed AI analysis and initiate partnership discussions.
              </p>
            </div>
          ) : (
            <ScrollArea className="flex-grow pr-2 -mr-2">
              {" "}
              {/* Allow content to scroll */}
              <div className="space-y-4">
                {/* AI Scores & Probability */}
                <Card className="bg-slate-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-tn-primary-blue" />
                      AI Match Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    <ScoreDisplay
                      title="Tech Compatibility"
                      score={selectedStartup.matchScore.technologyCompatibility}
                      icon={Zap}
                      tooltip="Semantic match of tech keywords, TRL alignment."
                    />
                    <ScoreDisplay
                      title="Market Timing"
                      score={selectedStartup.matchScore.marketTiming}
                      icon={TrendingUp}
                      tooltip="Startup's market potential and alignment with industry trends."
                    />
                    <ScoreDisplay
                      title="IP Landscape"
                      score={selectedStartup.matchScore.ipLandscape}
                      icon={ShieldCheck}
                      tooltip="Strength of startup's IP portfolio and conflict risk."
                    />
                    <ScoreDisplay
                      title="Financial Synergy"
                      score={selectedStartup.matchScore.financialSynergy}
                      icon={Scale}
                      tooltip="Startup's financial health and partner's risk appetite."
                    />
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="w-full text-center">
                      <p className="text-sm font-semibold text-tn-deep-blue">
                        Predicted Success: {selectedStartup.successProbability.value}%
                      </p>
                      <p className="text-xs text-slate-500">
                        Confidence: {selectedStartup.successProbability.confidenceInterval[0]}% -{" "}
                        {selectedStartup.successProbability.confidenceInterval[1]}%
                      </p>
                    </div>
                  </CardFooter>
                </Card>

                {/* Recommended Actions */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                      AI Recommended Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    {selectedStartup.recommendedActions.map((action, i) => (
                      <div key={i} className="flex items-center text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-tn-primary-green flex-shrink-0" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Chat System */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-tn-primary-green" />
                      Secure Negotiation Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col space-y-2">
                    <ScrollArea className="h-40 border rounded-md p-2 bg-slate-50">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`mb-1.5 clear-both ${msg.type === "sent" ? "text-right" : "text-left"}`}
                        >
                          <div
                            className={`inline-block py-1 px-2.5 rounded-lg max-w-[80%] ${msg.type === "sent" ? "bg-tn-primary-blue text-white float-right" : msg.type === "system" ? "bg-slate-200 text-slate-600" : "bg-slate-200 text-slate-800 float-left"}`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-[10px] opacity-80 mt-0.5">
                              {msg.sender} - {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                    <div className="flex space-x-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-tn-primary-green hover:bg-tn-accent-green text-white"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Communication Timeline */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <CalendarDays className="w-5 h-5 mr-2 text-purple-500" />
                      Communication Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-28">
                      <ul className="space-y-2">
                        {timelineEvents.map((event, i) => (
                          <li key={i} className="text-xs flex items-start">
                            <span className="font-semibold text-purple-700 w-20 flex-shrink-0">{event.date}:</span>
                            <span className="text-slate-600 flex-grow mr-2">{event.event}</span>
                            <Badge
                              variant={event.status === "Completed" ? "default" : "outline"}
                              className={`${event.status === "Completed" ? "bg-green-100 text-green-700 border-green-300" : "border-slate-300 text-slate-500"}`}
                            >
                              {event.status}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Contract Generation (Placeholder) */}
                <Button
                  variant="outline"
                  className="w-full border-tn-deep-blue text-tn-deep-blue hover:bg-tn-deep-blue hover:text-white"
                >
                  <FileSignature className="mr-2 h-4 w-4" /> Generate Draft Partnership Agreement
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  External API for market data: Connected <CheckCircle2 className="inline w-3 h-3 text-green-500" />
                </p>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
