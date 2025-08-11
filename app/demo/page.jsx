"use client";
import dynamic from 'next/dynamic';

const ClientDemo = dynamic(() => import('./ClientDemo'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  ),
});

export default function DemoPage() {
  return <ClientDemo />;
}