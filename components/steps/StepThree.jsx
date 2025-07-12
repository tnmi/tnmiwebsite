"use client";
import { useState } from "react";

export default function StepThree({ onComplete }) {
  const [selectedMarket, setSelectedMarket] = useState("Construction Materials");
  const [expandedMarket, setExpandedMarket] = useState(null);

  const properties = [
    { name: "Density", value: "2.7", target: "2.5–2.9", metric: "g/cm³", description: "Density is a primary determinant for structural biochar applications, especially in construction and composite manufacturing where lightweight yet robust materials are preferred. In markets such as construction materials and advanced composites, maintaining an optimal density ensures both material cost efficiency and mechanical performance. Materials with density falling within this range have been shown to provide superior thermal insulation properties while retaining structural integrity under varying environmental conditions." },
    { name: "Tensile Strength", value: "300", target: "280–320", metric: "MPa", description: "Tensile strength directly impacts market viability in sectors like aerospace and automotive composites, where resistance to stretching forces ensures material integrity under load. Market analysis indicates increasing demand for biochar-enhanced composites in lightweight vehicle components, where tensile strength contributes to both safety and durability. Meeting this tensile strength range is critical for competing against traditional carbon fiber products while offering a more sustainable alternative." },
    { name: "Elastic Modulus", value: "70", target: "68–72", metric: "GPa", description: "Elastic modulus governs flexibility and resilience—critical factors in advanced composites and energy storage components that require repeated mechanical stress endurance. For emerging markets such as battery electrodes and flexible structural panels, maintaining a precise elastic modulus ensures predictable behavior under stress cycles. This directly translates into longer product life cycles and lower maintenance costs, both key selling points in highly competitive industrial sectors." },
  ];

  const markets = [
    "Construction Materials",
    "Carbon Capture",
    "Advanced Composites",
    "Battery Electrodes",
    "Soil Enhancement",
    "Water Filtration",
  ];

  const marketCompanies = {
    "Construction Materials": ["BuildWise Innovations", "EcoStruct Systems", "GreenForm Concrete"],
    "Carbon Capture": ["CarbonX Solutions", "AtmosClear Technologies"],
    "Advanced Composites": ["NanoWeave Materials", "FlexiCore Industries", "UltraComp Labs"],
    "Battery Electrodes": ["VoltEdge Materials"],
    "Soil Enhancement": ["AgriNova Biochar", "GrowSmart Solutions"],
    "Water Filtration": ["PureStream Filters", "HydroPurity Systems", "CleanWave Technologies"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Material Dashboard</h1>
        <p className="text-slate-300">Review and explore biochar material metrics and market opportunities</p>
      </div>

      <div className="relative z-10 w-full flex flex-col lg:flex-row gap-8 items-stretch">
        <div className="w-full lg:w-2/3 bg-white/10 rounded-xl p-6 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col justify-between h-full">
          <h3 className="text-lg font-bold mb-4">Material Summary</h3>
          <p className="text-sm text-slate-300">
            This biochar material is optimized for{" "}
            <span className="text-white font-semibold">{selectedMarket}</span> applications.
            Its density, tensile strength, and elastic modulus meet the necessary performance
            thresholds for {selectedMarket.toLowerCase()} market deployment. Below are specific
            properties where these align with industry requirements.
          </p>
        </div>

        <div className="w-full lg:w-1/3 bg-white/10 rounded-xl p-6 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col justify-between h-full">
          <h4 className="text-lg font-semibold mb-4">New Markets</h4>
          <ul className="space-y-2">
            {markets.map((market, idx) => (
              <div key={idx}>
                <li
                  className={`bg-white/10 rounded-xl p-4 backdrop-blur-xl border border-white/10 cursor-pointer hover:bg-emerald-500/20 transition-all ${
                    selectedMarket === market ? "bg-emerald-500/20" : ""
                  }`}
                  onClick={() => {
                    setSelectedMarket(market);
                    setExpandedMarket(expandedMarket === market ? null : market);
                  }}
                >
                  {market}
                </li>
                {expandedMarket === market && (
                  <ul className="pl-4 pt-2 space-y-1">
                    {marketCompanies[market].map((company, i) => (
                      <li key={i} className="text-sm text-slate-200">
                        {company}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => onComplete()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          New +
        </button>
      </div>
    </div>
  );
}