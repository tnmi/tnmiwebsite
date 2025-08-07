"use client";
import React, { useState } from "react";
import axios from "axios";

export default function StepTwo({ geminiData,  setGeminiData, parsedPdfText, setParentLoading, onComplete }) {
  const [properties, setProperties] = useState(geminiData);
  const [errorMessage, setErrorMessage] = useState("");


  const removeProperty = (indexToRemove) => {
    setProperties(properties.filter((_, index) => index !== indexToRemove));
    setGeminiData(properties.filter((_, index) => index !== indexToRemove));
  };

  const handleValueChange = (index, value) => {
    setProperties(prev =>
      prev.map((prop, i) =>
        i === index ? { ...prop, value: value } : prop
      )
    );
    setGeminiData(prev =>
      prev.map((prop, i) =>
        i === index ? { ...prop, value: value } : prop
      )
    );
  };

  const handleFindNewMarkets = async () => {
    setParentLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post("/api/gemini", {
        query: "Given the following tech sheet and material properties I need you to return back a json file formatted STRICTLY in the following format { material_new_market: A brief one liner about this material along the lines of Review and explore biochar material metrics and market opportunities, new_markets: [ An array of new potential markets based on the properties of this material and the property goals set. Name Only the new market!! ] }",
        content: parsedPdfText + geminiData,
      });
      const cleanText = response.data.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\n/g, "")
        .trim();
      try {
        const parsedJson = JSON.parse(cleanText);
        onComplete(parsedJson);
        setParentLoading(false);
      } catch (e) {
        console.error("Failed to parse Gemini new markets response as JSON:", e);
        setErrorMessage("Something went wrong while fetching new markets. Please try again.");
        setParentLoading(false);
      }
    } catch (error) {
      console.error("Gemini process step two API error:", error);
      setErrorMessage("Something went wrong while fetching new markets. Please try again.");
      setParentLoading(false);
    }
  };

  return (
    <section className="relative z-10 py-36 px-6 max-w-7xl mx-auto text-white overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl pointer-events-none z-0 border border-white/10 shadow-inner" />
      <div className="absolute -top-40 -left-40 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-10 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400 mb-10 px-6 sm:px-12 pt-12 pb-16 text-center">
          Review Properties
        </h1>

        <div className="w-full overflow-x-auto">
          <div className="min-w-full">
            <div className="flex font-bold text-center bg-white/5 rounded-lg overflow-hidden">
              <div className="flex-1 py-2 px-4">Property</div>
              <div className="flex-1 py-2 px-4">Value</div>
              <div className="flex-1 py-2 px-4">Metric</div>
            </div>

            {properties.map((prop, index) => (
              <div key={index} className="flex items-center bg-white/5 rounded-lg my-1 gap-1 overflow-hidden">
                <div className="flex-1 py-2 px-4">{prop.name}</div>
                <input
                  className="flex-1 py-2 px-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg placeholder-white/50"
                  value={prop.value}
                  onChange={e => handleValueChange(index, e.target.value)}
                  placeholder="Enter value"
                />
                <div className="flex-1 py-2 px-4 flex justify-between items-center">
                  <span>{prop.metric === "" ? "N/A" : prop.metric}</span>
                  <button
                    onClick={() => removeProperty(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={handleFindNewMarkets}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            Find new markets
          </button>
          {errorMessage && (
            <div className="text-red-500 font-semibold mt-4">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}