import StartupPartnershipForm from "./startup-partnership-form"
import Link from "next/link"
import { ArrowLeft, Zap } from "lucide-react"

export default function StartupPartnershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
      <div className="w-full max-w-3xl bg-slate-800/70 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-700 shadow-2xl">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Zap className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-purple-400 mb-3">Startup Partnership Program</h1>
          <p className="text-slate-300 text-lg">
            Accelerate your materials innovation with TrueNorth AI. Let's build the future together.
          </p>
        </div>
        <StartupPartnershipForm />
      </div>
      <p className="mt-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} TrueNorth Material Innovations. All rights reserved.
      </p>
    </div>
  )
}
