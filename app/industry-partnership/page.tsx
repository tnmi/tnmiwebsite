import IndustryPartnershipForm from "./industry-partnership-form"
import Link from "next/link"
import { ArrowLeft, Building } from "lucide-react"

export default function IndustryPartnershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
      <div className="w-full max-w-3xl bg-slate-800/70 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-700 shadow-2xl">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Building className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-blue-400 mb-3">Industry Partnership Program</h1>
          <p className="text-slate-300 text-lg">
            Collaborate with TrueNorth AI to unlock new material capabilities and drive innovation in your sector.
          </p>
        </div>
        <IndustryPartnershipForm />
      </div>
      <p className="mt-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} TrueNorth Material Innovations. All rights reserved.
      </p>
    </div>
  )
}
