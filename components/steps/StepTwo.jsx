"use client";
import React, { useState } from "react";

export default function StepTwo({ onComplete }) {
  const [properties, setProperties] = useState([
    { name: "Density", value: "2.7", target: "2.5", metric: "g/cm³" },
    { name: "Tensile Strength", value: "300", target: "280", metric: "MPa" },
    { name: "Elastic Modulus", value: "70", target: "72", metric:  "GPa"},
  ]);

  return (
    <section className="relative z-10 py-36 px-6 max-w-7xl mx-auto text-white overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl pointer-events-none z-0 border border-white/10 shadow-inner" />
      <div className="absolute -top-40 -left-40 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-10 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400 mb-10 px-6 sm:px-12 pt-12 pb-16 text-center">
          Review Properties
        </h1>

        <div className="flex justify-center gap-4 text-center">
          <div className="flex flex-col gap-4">
            <div className="font-bold">Property</div>
            {properties.map((prop, index) => (
              <div key={index} className="py-2">{prop.name}</div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-bold">Value</div>
            {properties.map((prop, index) => (
              <input
                key={index}
                className="py-2 text-white bg-black bg-opacity-20 rounded px-2"
                value={prop.value}
                onChange={(e) => {
                  const updated = [...properties];
                  updated[index].value = e.target.value;
                  setProperties(updated);
                }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-bold">Target</div>
            {properties.map((prop, index) => (
              <input
                key={index}
                className="py-2 text-white bg-black bg-opacity-20 rounded px-2"
                value={prop.target}
                onChange={(e) => {
                  const updated = [...properties];
                  updated[index].target = e.target.value;
                  setProperties(updated);
                }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-bold">Metric</div>
            {properties.map((prop, index) => (
              <div key={index} className="py-2">{prop.metric}</div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onComplete}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            Next Step
          </button>
        </div>
      </div>
    </section>
  );
}