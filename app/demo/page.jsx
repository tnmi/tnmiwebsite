"use client";
import { useState } from 'react';
import StepOne from '../../components/steps/StepOne';
import StepTwo from '../../components/steps/StepTwo';
import StepThree from '../../components/steps/StepThree';

export default function DemoPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const setstepAndLoad = (nextStep) => {
    setLoading(true);
    setTimeout(() => {
      setStep(nextStep);
      setLoading(false);
    }, 1500);
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Preparing Your Dashboard</h1>
        <p className="text-lg text-slate-300 mb-6 max-w-xl">
          We are applying our secret sauce to your data. Thanks for being patient and stunning!
        </p>
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {step === 1 && <StepOne onComplete={() => setstepAndLoad(2)} />}
      {step === 2 && <StepTwo onComplete={() => setstepAndLoad(3)} />}
      {step === 3 && <StepThree onComplete={() => setstepAndLoad(1)} />}
    </div>
  );
}