"use client";

import { usePathname } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { path: "/survei",   label: "Diagnostik",  hint: "Isi Survei",      id: 1 },
  { path: "/peta",     label: "Pemetaan",    hint: "Lihat Peta",      id: 2 },
  { path: "/komitmen", label: "Komitmen",    hint: "Tanda Tangan",    id: 3 },
];

export function JourneyBar() {
  const pathname = usePathname();
  const currentStep = steps.find(s => s.path === pathname)?.id || 0;

  // Progress width between connectors
  const progressPct =
    currentStep === 1 ? "0%"
    : currentStep === 2 ? "50%"
    : currentStep === 3 ? "100%"
    : "0%";

  return (
    <div id="tour-journey-bar" className="w-full max-w-3xl mx-auto mb-16 mt-8 px-6">
      {/* Step track */}
      <div className="relative flex items-center justify-between">
        {/* Background connector - Subtle glass line */}
        <div className="absolute top-6 left-0 right-0 h-[2px] bg-white/5 mx-12 rounded-full overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* Active connector - Glowing gradient */}
        <div
          className="absolute top-6 left-0 h-[2px] mx-12 transition-all duration-[1.5s] ease-[0.22,1,0.36,1]"
          style={{
            width: `calc(${progressPct} - ${currentStep === 1 ? '0px' : '48px'})`,
            background: "linear-gradient(90deg, #f97316, #fb923c, #ea580c)",
            boxShadow: "0 0 20px rgba(249,115,22,0.4), 0 0 40px rgba(249,115,22,0.1)",
          }}
        />

        {steps.map((step) => {
          const isActive  = currentStep === step.id;
          const isPassed  = currentStep > step.id;
          const isFuture  = currentStep < step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-4 w-1/3 group">
              {/* Circle Container */}
              <div className="relative">
                {/* Outer Glow for Active */}
                {isActive && (
                  <motion.div 
                    layoutId="journey-glow"
                    className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                  />
                )}

                {/* Main Circle */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 relative overflow-hidden",
                    isPassed
                      ? "bg-orange-500 border-orange-400 text-white shadow-[0_10px_25px_rgba(234,88,12,0.4)] rotate-0"
                      : isActive
                      ? "bg-[#0a0a0a] border-orange-500 text-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.3)] scale-110"
                      : "bg-white/2 border-white/5 text-white/20 backdrop-blur-xl hover:border-white/10"
                  )}
                >
                  {/* Decorative background for active */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
                  )}

                  {isPassed ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                    >
                      <Check className="w-6 h-6 stroke-[4]" />
                    </motion.div>
                  ) : (
                    <span className="text-lg font-black relative z-10 tracking-tighter">
                      0{step.id}
                    </span>
                  )}
                </div>
              </div>

              {/* Label Group */}
              <div className="flex flex-col items-center text-center">
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500",
                    isActive  ? "text-white translate-y-0"
                    : isPassed ? "text-orange-500/60"
                    : "text-white/10 group-hover:text-white/20"
                  )}
                >
                  {step.label}
                </span>
                
                <div className="h-5 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.span
                        key="active"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-[9px] text-orange-500 font-black uppercase tracking-[0.2em] mt-1 block"
                      >
                        Sedang Berjalan
                      </motion.span>
                    ) : isPassed ? (
                      <motion.span
                        key="done"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-[9px] text-emerald-500/50 font-black uppercase tracking-[0.2em] mt-1 block"
                      >
                        Selesai
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
