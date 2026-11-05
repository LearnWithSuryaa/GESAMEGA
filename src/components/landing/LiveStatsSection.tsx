"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { School, Handshake, TrendingUp } from "lucide-react";

interface LiveStatsSectionProps {
  schools: number;
  commitments: number;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2200;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString("id-ID")}{suffix}
    </span>
  );
}

export function LiveStatsSection({ schools, commitments }: LiveStatsSectionProps) {
  const participationRate = schools > 0 ? Math.round((commitments / schools) * 100) : 0;

  const stats = [
    { icon: School,     value: schools,           suffix: "+", label: "Sekolah Terdaftar",   color: "#38bdf8", bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.25)" },
    { icon: Handshake,  value: commitments,        suffix: "+", label: "Komitmen Tersahkan",  color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
    { icon: TrendingUp, value: participationRate,  suffix: "%", label: "Rasio Partisipasi",   color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
  ];

  return (
    <section className="relative overflow-hidden py-24 px-4 bg-white">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 0%, rgba(46,125,50,0.04) 0%, transparent 50%),
            radial-gradient(circle at 90% 100%, rgba(30,136,229,0.04) 0%, transparent 40%)
          `,
        }}
      />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span
            className="text-xs uppercase tracking-[0.25em] font-bold mb-4 block"
            style={{ color: "#1E88E5" }}
          >
            Data Real-Time
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-text-dark mt-2 mb-4 leading-[1.05] tracking-tight">
            Statistik{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Partisipasi
            </span>{" "}
            Terkini
          </h2>
          <p className="text-text-dark font-medium max-w-xl text-lg leading-relaxed">
            Data langsung dari sistem kami, diperbarui setiap kali sekolah baru berpartisipasi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative rounded-[32px] p-8 text-center flex flex-col items-center group overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${stat.color}15 0%, transparent 70%)`,
                }}
              />

              <div
                className="relative z-10 inline-flex p-4 rounded-2xl mb-6 shadow-sm border transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: stat.bg, borderColor: stat.border }}
              >
                <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
              </div>

              <h3 className="relative z-10 text-5xl font-black text-text-dark mb-2 tracking-tight">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="relative z-10 text-slate-500 font-semibold uppercase text-xs tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
