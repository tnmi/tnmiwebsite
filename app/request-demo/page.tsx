import RequestDemoForm from "./request-demo-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function RequestDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-radial from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-[14px] border border-white/20 rounded-[2rem] shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)]">
        <div className="text-center">
          <img src="/logo.png" alt="TrueNorth Logo" className="h-12 w-12 invert brightness-150 mx-auto mb-4 mt-16" />
          <h1 className="text-4xl font-bold text-emerald-300 mb-3 drop-shadow">Step Into the Future of Materials</h1>
          <p className="text-slate-200 text-lg">
            See how TrueNorth's AI Cores can revolutionize your materials innovation.
          </p>
        </div>
        <RequestDemoForm />
      </div>
      <p className="mt-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} TrueNorth Material Innovations. All rights reserved.
      </p>
    </div>
  )
}
