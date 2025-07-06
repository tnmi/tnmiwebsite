import CanadianPartnershipsForm from "./canadian-partnerships-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react" // Using Lucide for consistency

export default function CanadianPartnershipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-red-900 text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center text-red-400 hover:text-red-300 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
      <div className="w-full max-w-2xl bg-slate-800/70 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-700 shadow-2xl">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🍁</div> {/* Canadian Maple Leaf Emoji */}
          <h1 className="text-4xl font-bold text-red-400 mb-3">Canadian Innovation Partnerships</h1>
          <p className="text-slate-300 text-lg">
            Connect with TrueNorth AI to leverage Canada's Critical Minerals Strategy and build a world-leading
            materials ecosystem.
          </p>
        </div>
        <CanadianPartnershipsForm />
      </div>
      <p className="mt-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} TrueNorth Material Innovations. All rights reserved.
      </p>
    </div>
  )
}
