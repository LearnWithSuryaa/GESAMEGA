"use client";

import { useRef, useCallback } from "react";
import { driver, DriveStep } from "driver.js";
import { HelpCircle } from "lucide-react";

interface TourGuideProps {
  steps: DriveStep[];
  pageName: string;
}

export function TourGuide({ steps, pageName }: TourGuideProps) {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  const startTour = useCallback(() => {
    // Filter secara defensif: hanya jalankan step yang elemennya benar-benar ada di DOM saat tombol diklik
    const activeSteps = steps.filter((step) => {
      if (!step.element) return true; // Floating step tanpa anchor elemen tetap diizinkan
      if (typeof step.element === "string") {
        return Boolean(document.querySelector(step.element));
      }
      if (step.element instanceof Element) {
        return document.body.contains(step.element);
      }
      return true;
    });

    if (activeSteps.length === 0) return;

    // Inisialisasi driver dengan steps yang valid dan siap di-highlight
    const driverObj = driver({
      showProgress: true,
      nextBtnText: "Next",
      prevBtnText: "Prev",
      doneBtnText: "Selesai",
      progressText: "Langkah {{current}} dari {{total}}",
      popoverClass: "gesamega-tour-theme", // Custom theme via globals.css
      steps: activeSteps,
      smoothScroll: true,
    });

    driverRef.current = driverObj;
    driverObj.drive();
  }, [steps]);

  return (
    <button
      type="button"
      onClick={startTour}
      className="fixed bottom-10 right-10 z-[9999] w-14 h-14 bg-black/50 backdrop-blur-xl border border-white/10 text-primary-light rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(46,125,50,0.15)] flex items-center justify-center hover:border-primary/50 hover:shadow-[0_0_50px_rgba(46,125,50,0.4)] hover:-translate-y-2 active:scale-95 transition-all duration-500 group overflow-hidden cursor-pointer"
      aria-label={`Tampilkan Panduan ${pageName}`}
    >
      {/* Dynamic background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
      
      {/* Animated pulse ring */}
      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20 group-hover:animate-none group-hover:opacity-0 transition-all" />

      <HelpCircle className="w-8 h-8 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />

      {/* Floating Sparkle Elements */}
      <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-pulse opacity-40" />
      <div className="absolute bottom-3 left-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse opacity-30" />

      {/* Tooltip - Premium Glass Style */}
      <div className="absolute right-[140%] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-10 group-hover:translate-x-0 pointer-events-none">
        <div className="relative bg-black/70 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-[1.25rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center gap-4 whitespace-nowrap overflow-hidden">
          {/* Inner Glow */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="w-2.5 h-2.5 rounded-full bg-primary-light shadow-[0_0_15px_rgba(102,187,106,1)] animate-pulse shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-1">Butuh Bantuan?</span>
            <span className="text-sm font-black text-white tracking-tight">Pelajari {pageName}</span>
          </div>

          {/* Decorative Arrow */}
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-black/70 backdrop-blur-2xl border-r border-t border-white/10 rotate-45" />
        </div>
      </div>
    </button>
  );
}
