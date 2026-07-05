"use client";

import { useEffect, useState } from "react";
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { HelpCircle } from "lucide-react";

interface TourGuideProps {
  steps: DriveStep[];
  pageName: string;
}

export function TourGuide({ steps, pageName }: TourGuideProps) {
  const [driverObj, setDriverObj] = useState<any>(null);

  useEffect(() => {
    // Prevent SSR errors, load driver only on client
    const d = driver({
      showProgress: true,
      nextBtnText: "Next",
      prevBtnText: "Prev",
      doneBtnText: "Tutup",
      progressText: "Langkah {{current}} dari {{total}}",
      popoverClass: "gesamega-tour-theme", // Custom theme via globals.css
      steps: steps,
      smoothScroll: true,
    });
    setDriverObj(d);
  }, [steps]);

  return (
    <button
      onClick={() => driverObj?.drive()}
      className="fixed bottom-10 right-10 z-[9999] w-14 h-14 bg-black/40 backdrop-blur-xl border border-white/10 text-orange-500 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(249,115,22,0.1)] flex items-center justify-center hover:border-orange-500/50 hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] hover:-translate-y-2 active:scale-95 transition-all duration-500 group overflow-hidden"
      aria-label={`Tampilkan Panduan ${pageName}`}
    >
      {/* Dynamic background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
      
      {/* Animated pulse ring */}
      <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping opacity-20 group-hover:animate-none group-hover:opacity-0 transition-all" />

      <HelpCircle className="w-8 h-8 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />

      {/* Floating Sparkle Elements */}
      <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-pulse opacity-40" />
      <div className="absolute bottom-3 left-2 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse opacity-30" />

      {/* Tooltip - Premium Glass Style */}
      <div className="absolute right-[140%] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-10 group-hover:translate-x-0 pointer-events-none">
        <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-[1.25rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center gap-4 whitespace-nowrap overflow-hidden">
          {/* Inner Glow */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)] animate-pulse shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-1">Butuh Bantuan?</span>
            <span className="text-sm font-black text-white tracking-tight">Pelajari {pageName}</span>
          </div>

          {/* Decorative Arrow */}
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-black/60 backdrop-blur-2xl border-r border-t border-white/10 rotate-45" />
        </div>
      </div>
    </button>
  );
}
