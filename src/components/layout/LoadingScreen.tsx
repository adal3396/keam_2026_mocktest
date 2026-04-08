import React, { useState, useEffect } from 'react';
import logoImage from '@/assets/ksu-logo-tal.png';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  fullScreen?: boolean;
}

const MESSAGES = [
  "Preparing the exam hall...",
  "Calibrating OMR sheets...",
  "Brewing Chemistry formulas...",
  "Integrating Mathematics...",
  "Summoning Invigilators...",
  "Almost there..."
];

export default function LoadingScreen({ fullScreen = true }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!fullScreen) return;

    // We want the progress bar to fill from 0 to 100 over ~2.5 seconds.
    const duration = 2500;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(nextProgress);

      if (nextProgress === 100) clearInterval(progressInterval);
    }, intervalTime);

    // Update messages a few times during the 2.5s duration
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => Math.min(prev + 1, MESSAGES.length - 1));
    }, duration / MESSAGES.length);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [fullScreen]);

  if (!fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading data...</p>
      </div>
    );
  }

  // Pure white mode fullscreen matching KSU Blue
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-900">
      <div className="relative flex flex-col items-center w-full max-w-sm px-6">
        
        {/* The tall logo */}
        <img 
          src={logoImage} 
          alt="KSU KEAM Logo" 
          className="w-auto h-20 max-w-[260px] object-contain relative z-10 animate-fade-in mb-10"
        />
        
        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4 relative z-10 shadow-inner">
          {/* Animated fill indicator gradient with multi-color sweep */}
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-violet-500 to-cyan-500 transition-all ease-linear shadow-[0_0_12px_rgba(99,102,241,0.5)]"
            style={{ width: `${progress}%`, transitionDuration: '30ms' }}
          />
        </div>

        {/* Dynamic Quirky Loading Text */}
        <div className="h-6 relative z-10 w-full text-center">
          <p className="text-sm tracking-wide text-slate-500 font-mono transition-opacity duration-300">
            {MESSAGES[messageIndex]}
          </p>
        </div>
      </div>
      
      {/* Background ambient lighting - VIBRANT MESH EFFECT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[140px] opacity-[0.08] animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-cyan-400 rounded-full blur-[100px] opacity-[0.05] animate-bounce" style={{ animationDuration: '6s' }} />
      </div>
    </div>
  );
}
