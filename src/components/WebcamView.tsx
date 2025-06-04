'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WebcamViewProps {
  onAnalyze: (imageData: string) => void;
  isAnalyzing: boolean;
}

export function WebcamView({ onAnalyze, isAnalyzing }: WebcamViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleAnalyze = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    onAnalyze(imageData);
  };

  return (
    <Card className="p-4 w-full bg-[#232b3e] text-white border border-white/10">
      <div className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center text-white/80">
            Loading camera...
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          onClick={handleAnalyze}
          disabled={!isStreaming || isAnalyzing}
          className="w-full max-w-xs"
        >
          {isAnalyzing ? 'Analyzing...' : 'Mirror, mirror on the wall...'}
        </Button>
      </div>
    </Card>
  );
} 