"use client";

import AIBridgeAnimation from "@/components/ai-bridge-animation";

export default function TestPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <AIBridgeAnimation isInView={true} />
    </main>
  );
}
