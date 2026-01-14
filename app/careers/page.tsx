"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Briefcase, Upload } from "lucide-react"
import { useState } from "react"
import BackgroundVideo from "@/components/background-video"
import { Button } from "@/components/ui/button"

interface JobPosting {
  id: string
  title: string
  subtitle: string
  location: string
  compensation: string
  description: string
  responsibilities: string[]
  qualifications: {
    core: string[]
    bonus: string[]
  }
  offering: string[]
}

const jobPostings: JobPosting[] = [
  {
    id: "ai-engineer",
    title: "AI Agent Developer",
    subtitle: "Founding AI Engineer (Agentic Systems)",
    location: "Remote (Canada-based preferred)",
    compensation: "Equity stake with clear path to salary",
    description: "TNMI is creating Agentic Agents for the industries of Advanced Materials, Critical Minerals and Manufacturing, connecting and strengthening Canada's ecosystem. We're focusing on climate-positive materials that influence the future of sustainable manufacturing and materials. This is an opportunity to strengthen Canada, work with great innovators in green materials & climate, and develop skills as an AI developer in Materials Science. Join us as a co-owner and partner in this venture!",
    responsibilities: [
      "Design, build, and deploy the core intelligence of our multi-agent AI systems from the ground up",
      "Develop and orchestrate complex AI workflows using Python, Google's Agent Development Kit (ADK), and other modern frameworks",
      "Implement advanced AI patterns including tool-using agents, Retrieval-Augmented Generation (RAG), and complex reasoning chains",
      "Integrate our agents with diverse data sources and knowledge bases, particularly graph databases like Neo4j",
      "Build robust data ingestion and preprocessing pipelines for both structured and unstructured information within the Google Cloud Platform (GCP) ecosystem",
      "Collaborate directly with materials science and manufacturing experts to translate industry challenges into technical solutions"
    ],
    qualifications: {
      core: [
        "Expert in Python with proven experience building complex AI workflows, orchestration logic, and agent tooling",
        "LLM Orchestration: Hands-on experience with frameworks for building multi-agent systems. Direct experience with Google ADK is a strong asset",
        "Agentic AI Design: Deep understanding of and practical experience with RAG, tool integration, and reasoning chains",
        "Knowledge Base Integration: Experience connecting AI systems to knowledge graphs (Neo4j preferred)",
        "Cloud & Data: Familiarity with Google Cloud Platform (GCP) and experience building data pipelines",
        "Entrepreneurial Mindset: Self-starter, thrive in ambiguity, motivated by mission and ownership"
      ],
      bonus: [
        "Knowledge of MLOps best practices and tools like DVC",
        "Experience or academic background in Materials Science, Chemistry, or Manufacturing",
        "Prior experience in a startup or as an early-stage employee"
      ]
    },
    offering: [
      "A Substantial Equity Stake: Become a co-owner and partner in the venture",
      "Groundbreaking Work: Build novel agentic AI systems at the intersection of AI, climate tech, and advanced manufacturing",
      "National Impact: Play a pivotal role in strengthening Canada's strategic industries",
      "Expert Collaboration: Work alongside leading innovators in green materials and AI"
    ]
  },
  {
    id: "cloud-devops",
    title: "Cloud DevOps Engineer",
    subtitle: "Cloud DevOps Engineer (AI-focused, GCP & ISMS)",
    location: "Remote (Canada-based preferred)",
    compensation: "Equity position with path to salary",
    description: "TNMI is creating Agentic Agents for the industries of Advanced Materials, Critical Minerals and Manufacturing, connecting and strengthening Canada's ecosystem. We're focusing on climate-positive materials that influence the future of sustainable manufacturing and materials. This is an opportunity to strengthen Canada, work with great innovators in green materials & climate, and ensure our AI systems run reliably, securely, and cost-effectively. Join us as a co-owner and partner in this venture!",
    responsibilities: [
      "Ensure agents and ML systems run reliably, securely, and cost-effectively on GCP",
      "Bridge AI work with infrastructure, compliance, and monitoring",
      "Design and maintain CI/CD pipelines for AI system deployments",
      "Manage GCP infrastructure including compute, networking, and IAM",
      "Implement security best practices and ISMS compliance",
      "Set up observability and monitoring for production systems",
      "Collaborate with AI engineers to optimize deployment and scaling"
    ],
    qualifications: {
      core: [
        "Strong Python development: automation scripts, infra tooling, deployment pipelines",
        "Cloud Infrastructure (GCP-first): Compute (Cloud Run, GKE, Vertex AI), Networking (VPC, load balancers), IAM & Secret Manager",
        "LLM Integration: Familiarity with Google ADK for deploying LLM-based agents and connecting with GCP APIs",
        "Data & Databases: BigQuery, Firestore, CloudSQL basics, and Neo4j familiarity",
        "DevOps/MLOps: CI/CD pipelines (GitHub Actions, Cloud Build), Docker, Kubernetes, observability tools",
        "Security & ISMS: ISO 27001, GDPR, CCPA awareness; IAM, audit trails, secure data pipelines"
      ],
      bonus: [
        "Experience with DVC for model versioning",
        "Background in climate tech or sustainable manufacturing",
        "Prior startup or early-stage infrastructure work"
      ]
    },
    offering: [
      "Equity position: Become a co-owner and partner in the venture",
      "Build novel agentic AI systems alongside experts in the field",
      "Make an impact on Canada's materials and manufacturing ecosystem",
      "Professional growth in cutting-edge AI infrastructure"
    ]
  }
]

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  const currentJob = jobPostings.find(job => job.id === selectedJob)

  const scrollToCV = () => {
    const cvSection = document.getElementById("cv-upload-section")
    if (cvSection) {
      cvSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative font-['Satoshi',sans-serif] bg-[#0f172a] min-h-screen">
      {/* Navigation Back */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/" className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <motion.section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 w-full h-full">
          <div className="relative w-full h-full">
            <BackgroundVideo
              videoUrl="/Vid9.mp4"
              fallbackImageUrl="/placeholder.svg"
              overlayColor="from-black/80 via-slate-900/70 to-emerald-800/70"
              pingPong
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-center z-10 max-w-4xl mx-auto px-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-5xl md:text-7xl font-semibold bg-gradient-to-br from-white via-slate-300 to-slate-500 bg-clip-text text-transparent tracking-tight mb-6"
          >
            Join Our
            <span className="text-emerald-400 block">Mission</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Build the future of advanced materials with us. We're looking for passionate innovators and problem-solvers.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Job Listings */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-emerald-400 mb-8 text-center">Open Positions</h2>

            <div className="grid grid-cols-1 gap-4">
              {jobPostings.map((job) => (
                <motion.button
                  key={job.id}
                  onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`text-left p-6 rounded-[2rem] border transition-all duration-300 ${
                    selectedJob === job.id
                      ? "bg-emerald-400/20 border-emerald-400 shadow-emerald-500/30"
                      : "bg-white/10 border-white/20 hover:border-emerald-400/50"
                  } backdrop-blur-[14px] shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)]`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-2xl font-bold text-white">{job.title}</h3>
                      </div>
                      <p className="text-slate-400">{job.subtitle}</p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-300">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.compensation}</span>
                      </div>
                    </div>
                    <div className="text-emerald-400 text-2xl flex-shrink-0">
                      {selectedJob === job.id ? "−" : "+"}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Job Details */}
          {currentJob && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12 bg-white/10 backdrop-blur-[14px] border border-white/20 rounded-[2rem] p-8 md:p-12 shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)]"
            >
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">{currentJob.subtitle}</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{currentJob.description}</p>
              </div>

              {/* What You'll Do */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-emerald-400 mb-4">What You'll Do</h4>
                <ul className="space-y-3">
                  {currentJob.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-300">
                      <span className="text-emerald-400 font-bold flex-shrink-0">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qualifications */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-emerald-400 mb-4">Your Profile</h4>
                <div className="mb-6">
                  <h5 className="text-lg font-semibold text-white mb-3">Core Qualifications</h5>
                  <ul className="space-y-2">
                    {currentJob.qualifications.core.map((qual, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-300">
                        <span className="text-emerald-400 flex-shrink-0">✓</span>
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-lg font-semibold text-white mb-3">Bonus Points</h5>
                  <ul className="space-y-2">
                    {currentJob.qualifications.bonus.map((qual, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-300">
                        <span className="text-emerald-400 flex-shrink-0">⭐</span>
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Our Offering */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-emerald-400 mb-4">Our Offering</h4>
                <ul className="space-y-3">
                  {currentJob.offering.map((offer, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-300">
                      <span className="text-emerald-400 font-bold flex-shrink-0">★</span>
                      <span>{offer}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upload CV Button */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <Button
                  onClick={scrollToCV}
                  size="lg"
                  className="bg-emerald-400 text-black hover:bg-emerald-500 transition-all duration-300 font-medium"
                >
                  Upload Your CV
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CV Upload Section */}
      <section id="cv-upload-section" className="py-20 px-6 relative bg-white/5">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-[14px] border border-white/20 rounded-[2rem] p-8 md:p-12 shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-8 h-8 text-emerald-400" />
              <h3 className="text-2xl font-bold text-white">Submit Your CV</h3>
            </div>

            <p className="text-slate-300 mb-8">
              Interested in joining our team? Even if no position perfectly matches your skills right now, we'd love to hear from you! Send your CV and we'll keep it on file for future opportunities.
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-emerald-400/10 border border-emerald-400/30 rounded-lg">
                <p className="text-slate-200 flex items-center gap-2">
                  <span className="text-emerald-400 text-xl">📧</span>
                  <strong>Email your CV to:</strong>
                </p>
                <a
                  href="mailto:tobias@truenorthmaterials.com?subject=CV%20Submission"
                  className="text-emerald-400 hover:text-emerald-300 text-lg font-semibold mt-2 transition-colors"
                >
                  tobias@truenorthmaterials.com
                </a>
                <p className="text-slate-400 text-sm mt-3">
                  Format: PDF preferred (DOC/DOCX also accepted)<br/>
                  Include which position(s) you're interested in
                </p>
              </div>

              <a href="mailto:tobias@truenorthmaterials.com?subject=CV%20Submission">
                <Button
                  size="lg"
                  className="w-full bg-emerald-400 text-black hover:bg-emerald-500 transition-all duration-300 font-medium"
                >
                  Send CV via Email
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-sm text-slate-400 border-t border-white/10">
        <p className="tracking-widest text-emerald-300 font-light mb-2">TRUENORTH MATERIAL INNOVATIONS</p>
        <p>© {new Date().getFullYear()} TrueNorth Material Innovations. All rights reserved.</p>
      </footer>
    </div>
  )
}
