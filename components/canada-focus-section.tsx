"use client"
import { Button } from "@/components/ui/button"
import { BackgroundVideo } from "./background-video"

export const CanadaFocusSection = () => {
  return (
    <section id="canada-focus" className="relative w-full overflow-hidden bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 backdrop-blur-2xl">
      {/* Background Video with darker overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundVideo
          src="/Vid2.mp4"
          overlayClassName="bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80"
        />
      </div>

      {/* Content */}
      <div className="min-h-screen relative z-10 overflow-hidden px-6 py-32 flex flex-col items-center justify-start space-y-24">
        {/* Hero Title */}
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400 drop-shadow-[0_2px_30px_rgba(255,255,255,0.25)] px-4 py-4">
            Canada’s Materials Intelligence Era
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Building the future of materials with AI, collaboration, and national-scale ambition.
          </p>
        </div>

        {/* Highlighted Statement Box */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl max-w-4xl">
          <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-light">
            From mining breakthroughs to clean tech deployments, TrueNorth connects Canada’s material ecosystem—linking academia, startups, and industries with AI-first discovery platforms.
          </p>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
          {[
            {
              title: "⚛️  National Research Leadership",
              content: "Our platform links institutions across Canada, accelerating shared innovation across domains from quantum to sustainable concrete."
            },
            {
              title: "🚀 Startup Enablement",
              content: "We provide Canada's deeptech startups with AI-driven insight engines, market navigation, and scalable infrastructure."
            },
            {
              title: "🌐 Cross-Sector Integration",
              content: "From aerospace to energy, TrueNorth powers collaborative material innovation between R&D and industry across the country."
            }
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-emerald-400/30 transition-all transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{card.content}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="bg-emerald-400/10 hover:bg-emerald-400/20 text-white border border-white/20 backdrop-blur-xl shadow-lg px-8 py-4 rounded-xl"
            onClick={() => window.open('https://www.canada.ca', '_blank')}
          >
            🚀 Join Canada’s Innovation Frontier
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CanadaFocusSection
