'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { speakText } from '@/lib/speech';

interface AnalysisViewProps {
  analysis: string | null;
  isLoading: boolean;
}

export function AnalysisView({ analysis, isLoading }: AnalysisViewProps) {
  useEffect(() => {
    if (analysis && !isLoading) {
      speakText(analysis);
    }
  }, [analysis, isLoading]);

  return (
    <Card className="p-4 w-full max-w-2xl h-full bg-[#232b3e] text-white border border-white/10">
      <div className="min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-white/60">Analyzing image...</div>
          </div>
        ) : analysis ? (
          <p className="text-white whitespace-pre-wrap">{analysis}</p>
        ) : (
          <p className="text-white/60 italic">
            Click &quot;Mirror, mirror on the wall...&quot;
          </p>
        )}
      </div>
    </Card>
  );
} 