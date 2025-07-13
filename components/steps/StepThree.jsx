"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

export default function StepThree({ cleanJsonText, parsedPdfText, geminiData, onComplete }) {
  const [selectedMarket, setSelectedMarket] = useState("Construction Materials");
  const [expandedMarket, setExpandedMarket] = useState(null);
  const [marketAnalysisErrors, setMarketAnalysisErrors] = useState({});

  const properties = [
    { name: "Density", value: "2.7", target: "2.5–2.9", metric: "g/cm³", description: "Density is a primary determinant for structural biochar applications, especially in construction and composite manufacturing where lightweight yet robust materials are preferred. In markets such as construction materials and advanced composites, maintaining an optimal density ensures both material cost efficiency and mechanical performance. Materials with density falling within this range have been shown to provide superior thermal insulation properties while retaining structural integrity under varying environmental conditions." },
    { name: "Tensile Strength", value: "300", target: "280–320", metric: "MPa", description: "Tensile strength directly impacts market viability in sectors like aerospace and automotive composites, where resistance to stretching forces ensures material integrity under load. Market analysis indicates increasing demand for biochar-enhanced composites in lightweight vehicle components, where tensile strength contributes to both safety and durability. Meeting this tensile strength range is critical for competing against traditional carbon fiber products while offering a more sustainable alternative." },
    { name: "Elastic Modulus", value: "70", target: "68–72", metric: "GPa", description: "Elastic modulus governs flexibility and resilience—critical factors in advanced composites and energy storage components that require repeated mechanical stress endurance. For emerging markets such as battery electrodes and flexible structural panels, maintaining a precise elastic modulus ensures predictable behavior under stress cycles. This directly translates into longer product life cycles and lower maintenance costs, both key selling points in highly competitive industrial sectors." },
  ];

  const [marketCompanies, setMarketCompanies] = useState({});
  const [marketAnalysis, setMarketAnalysis] = useState({});

  // Set the default selected market when cleanJsonText changes
  useEffect(() => {
    if (!cleanJsonText?.new_markets) return;
    setSelectedMarket(cleanJsonText.new_markets[0]);
  }, [cleanJsonText]);

  // Fetch companies and market analysis for the selected market only if not already loaded
  useEffect(() => {
    if (!selectedMarket) return;

    const fetchCompanies = async (market) => {
      if (marketCompanies[market] !== undefined) return;
      try {
        const response = await axios.post("/api/gemini", {
          query: `Find at least 5 companies where this product with these properties would be a great match, return the information as a json with the "${market}": [{"business_name": "website"}]`,
          content: JSON.stringify({
            cleanJsonText,
            parsedPdfText,
            geminiData
          }),
        });
        if (!response.data?.text) {
          console.error("Empty response from Gemini.");
          return;
        }

        const cleanText = response.data.text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .replace(/\n/g, "")
          .trim();
        console.log("WEbistes")
        console.log(cleanText)
        const parsedJson = JSON.parse(cleanText);
        setMarketCompanies(prev => ({ ...prev, ...parsedJson }));
      } catch (error) {
        console.error(`Error fetching companies for ${market}:`, error);
      }
    };

    const fetchMarketReports = async (market) => {
      try {
        const response = await axios.post("/api/gemini", {
          query: `Given this property sheet and these properties and this market: ${market}, create an extensive market review and evaluation of how this product would perform in that market. Include strengths, weaknesses, total addressable market (TAM), key competitors, cost considerations, and recommended next steps. Respond strictly in this JSON format only, without any extra text or markdown:

{
  "markets": {
    "${market}": "Full analysis text here, no markdown, no code block, just plain text string value."
  }
}

Only return a valid JSON object, nothing else.`,
          content: JSON.stringify({
            cleanJsonText,
            parsedPdfText,
            geminiData
          }),
        });
        if (!response.data?.text) {
          throw new Error("Empty response from Gemini.");
        }

        const cleanText = response.data.text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .replace(/\n/g, "")
          .trim();
        console.log(cleanText);

        const parsedJson = JSON.parse(cleanText);
        setMarketAnalysis(prev => ({ ...prev, ...parsedJson.markets }));
        setMarketAnalysisErrors(prev => ({ ...prev, [market]: null }));
      } catch (error) {
        console.error(`Error fetching market report for ${market}:`, error);
        setMarketAnalysisErrors(prev => ({ ...prev, [market]: "Error: Market report not available." }));
      }
    };

    // Always call; early return inside each function
    fetchCompanies(selectedMarket);
    fetchMarketReports(selectedMarket);
  }, [selectedMarket, cleanJsonText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Material Dashboard</h1>
        <p className="text-slate-300">{cleanJsonText.material_new_market}</p>
      </div>

      <div className="relative z-10 w-full flex flex-col lg:flex-row gap-8 items-stretch">
        <div className="w-full lg:w-2/3 bg-white/10 rounded-xl p-6 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col justify-between h-full">
          <h3 className="text-lg font-bold mb-4">Material Summary</h3>
          {marketAnalysisErrors[selectedMarket] ? (
            <p className="text-sm text-red-400">{marketAnalysisErrors[selectedMarket]}</p>
          ) : marketAnalysis[selectedMarket] ? (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{marketAnalysis[selectedMarket]}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Loading market analysis report...</p>
          )}
        </div>

        <div className="w-full lg:w-1/3 bg-white/10 rounded-xl p-6 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col justify-between h-full">
          <h4 className="text-lg font-semibold mb-4">New Markets</h4>
          <ul className="space-y-2">
            {cleanJsonText.new_markets?.map((market, idx) => (
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
                    {marketCompanies[market]?.map((company, i) => {
                      const name = company.business_name;
                      const url = company.website;
                      return (
                        <li key={i} className="text-sm text-slate-200">
                          <a
                            href={url && url.startsWith('http') ? url : url ? 'https://' + url : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {name}
                          </a>
                        </li>
                      );
                    })}
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
          Start over
        </button>
      </div>
    </div>
  );
}