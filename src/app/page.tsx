'use client';

import { useState } from 'react';
import { WebcamView } from '@/components/WebcamView';
import { AnalysisView } from '@/components/AnalysisView';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export default function Home() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (imageData: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0a0f1c] to-[#1a2236] font-sans">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Mirror Mirror</h1>
      </section>

      {/* Main Content Card */}
      <main className="flex justify-center items-start pb-16">
        <div className="w-full max-w-5xl bg-[#181f2e] rounded-2xl shadow-2xl border border-white/10 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <WebcamView onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            <AnalysisView analysis={analysis} isLoading={isAnalyzing} />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
