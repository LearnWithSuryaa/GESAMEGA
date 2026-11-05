"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  MapPin,
  Handshake,
  QrCode,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    icon: MapPin,
    step: "01",
    title: "Sekolah Terdaftar",
    description:
      "Data sekolah seluruh Sidoarjo telah diverifikasi dan tersedia dalam sistem data pokok.",
    accent: "#1E88E5",
    position: "top", // Jam 12
  },
  {
    icon: QrCode,
    step: "02",
    title: "Dapatkan QR Code",
    description:
      "Admin sekolah menerima QR Code resmi dan unik untuk instansinya.",
    accent: "#0ea5e9",
    position: "right", // Jam 3
  },
  {
    icon: ClipboardList,
    step: "03",
    title: "Isi Kuis & Survei",
    description:
      "Warga sekolah memindai QR Code untuk mengisi kuis refleksi dan survei kesiapan digital.",
    accent: "#10b981",
    position: "bottom", // Jam 6
  },
  {
    icon: Handshake,
    step: "04",
    title: "Sahkan Komitmen",
    description:
      "Sekolah memvalidasi komitmen bersama dan otomatis tersemat di peta sebaran nasional.",
    accent: "#2E7D32",
    position: "left", // Jam 9
  },
] as const;

type Step = (typeof steps)[number];

// ── Posisi melingkar searah jarum jam (Jam 12 -> Jam 3 -> Jam 6 -> Jam 9)
// Dihitung presisi di dalam kanvas 720x720 (Radius = 250px, Center = 360, 360)
// Semua kartu berada AMAN di dalam batas kanvas (tidak menabrak teks header di atas)
const orbitPositions: Record<string, { top: string; left: string }> = {
  top: { top: "110px", left: "360px" },     // Jam 12 (Top card: 110 - 75 = 35px dari atas container)
  right: { top: "360px", left: "610px" },   // Jam 3
  bottom: { top: "610px", left: "360px" },  // Jam 6
  left: { top: "360px", left: "110px" },    // Jam 9
};

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
  };
}

function scaleIn(delay = 0) {
  return {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
  };
}

// ── Step Card ──
function StepCard({ step }: { step: Step }) {
  return (
    <div
      className="relative rounded-2xl border border-slate-200 p-5 flex flex-col gap-2.5 overflow-hidden group transition-all duration-300 bg-white shadow-sm hover:shadow-md"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${step.accent}14 0%, transparent 70%)`,
        }}
      />

      {/* Header bar di dalam card */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className="text-xs font-black tracking-widest"
          style={{ color: step.accent }}
        >
          LANGKAH {step.step}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center border"
          style={{
            backgroundColor: `${step.accent}15`,
            borderColor: `${step.accent}30`,
          }}
        >
          <step.icon className="w-4 h-4" style={{ color: step.accent }} />
        </div>
      </div>

      <h3 className="relative z-10 font-bold text-text-dark text-base leading-snug">
        {step.title}
      </h3>
      <p className="relative z-10 text-text-dark text-xs leading-relaxed">
        {step.description}
      </p>

      <div
        className="relative z-10 mt-1 h-[2px] w-8 rounded-full opacity-40 group-hover:opacity-100 group-hover:w-full transition-all duration-500"
        style={{ backgroundColor: step.accent }}
      />
    </div>
  );
}

// ── Center Hub: Merepresentasikan Ekosistem Terpadu ──
function CenterHub() {
  return (
    <div
      className="relative flex flex-col items-center justify-center text-center p-6 rounded-3xl border border-primary/20 bg-white shadow-sm"
      style={{
        boxShadow: "0 10px 40px rgba(46, 125, 50, 0.08)",
      }}
    >
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(46, 125, 50, 0.06) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border border-primary/30"
        style={{
          backgroundColor: "rgba(46, 125, 50, 0.12)",
        }}
      >
        <ShieldCheck className="w-6 h-6 text-primary" />
      </div>

      <p className="relative z-10 text-primary text-[11px] font-bold uppercase tracking-wider mb-1">
        Muara Gerakan
      </p>
      <h3 className="relative z-10 font-extrabold text-text-dark text-base leading-tight mb-2">
        Ekosistem Digital
        <br />
        <span className="text-primary">Terverifikasi</span>
      </h3>
      <p className="relative z-10 text-slate-500 text-[11px] leading-relaxed max-w-[190px]">
        Menghubungkan sekolah, siswa, dan orang tua dalam satu sinergi
      </p>
    </div>
  );
}

export function ParticipationFlow() {
  return (
    <section className="relative py-28 px-4 overflow-hidden bg-surface">
      {/* Background glow halus */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(46, 125, 50, 0.05) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div {...fadeUp(0)} className="text-center mb-8">
          <span
            className="text-xs uppercase tracking-[0.25em] font-bold mb-3 block"
            style={{ color: "#2E7D32" }}
          >
            Alur Partisipasi
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-dark mt-2 mb-4 leading-tight tracking-tight">
            Bagaimana Cara{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Berpartisipasi?
            </span>
          </h2>
          <p className="text-text-dark max-w-xl mx-auto text-lg font-medium leading-relaxed">
            Empat tahapan berkesinambungan membentuk budaya digital sekolah yang bijak dan terdata.
          </p>
        </motion.div>

        {/* ── DESKTOP: Orbit Layout Searah Jarum Jam (Clockwise) ── */}
        <div className="hidden lg:flex justify-center mt-12 mb-8">
          <div className="relative" style={{ width: 720, height: 720 }}>
            {/* SVG Orbit Rings & Clockwise Connector Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 720 720"
              fill="none"
            >
              {/* Outer Orbit Path (R = 250px) */}
              <circle
                cx="360"
                cy="360"
                r="250"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />

              {/* Inner Orbit Guide */}
              <circle
                cx="360"
                cy="360"
                r="160"
                stroke="rgba(46,125,50,0.08)"
                strokeWidth="1"
              />

              {/* Panah / Alur Searah Jarum Jam (Top -> Right -> Bottom -> Left -> Top) */}
              {/* 1. Top to Right (Jam 12 ke Jam 3) */}
              <path
                d="M 360 110 A 250 250 0 0 1 610 360"
                stroke="#0ea5e9"
                strokeWidth="2"
                strokeOpacity="0.45"
                strokeDasharray="5 7"
              />
              {/* 2. Right to Bottom (Jam 3 ke Jam 6) */}
              <path
                d="M 610 360 A 250 250 0 0 1 360 610"
                stroke="#10b981"
                strokeWidth="2"
                strokeOpacity="0.45"
                strokeDasharray="5 7"
              />
              {/* 3. Bottom to Left (Jam 6 ke Jam 9) */}
              <path
                d="M 360 610 A 250 250 0 0 1 110 360"
                stroke="#2E7D32"
                strokeWidth="2"
                strokeOpacity="0.45"
                strokeDasharray="5 7"
              />
              {/* 4. Left to Top (Jam 9 ke Jam 12) */}
              <path
                d="M 110 360 A 250 250 0 0 1 360 110"
                stroke="#1E88E5"
                strokeWidth="2"
                strokeOpacity="0.35"
                strokeDasharray="5 7"
              />

              {/* Titik Indikator pada sumbu orbit */}
              <circle cx="360" cy="110" r="5" fill="#1E88E5" />
              <circle cx="610" cy="360" r="5" fill="#0ea5e9" />
              <circle cx="360" cy="610" r="5" fill="#10b981" />
              <circle cx="110" cy="360" r="5" fill="#2E7D32" />
            </svg>

            {/* Step Cards ditempatkan searah jarum jam dengan koordinat pasti */}
            {steps.map((step, i) => {
              const pos = orbitPositions[step.position];
              return (
                <motion.div
                  key={step.step}
                  {...scaleIn(0.15 + i * 0.1)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transform-gpu"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    width: 220,
                  }}
                >
                  <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
                    <StepCard step={step} />
                  </div>
                </motion.div>
              );
            })}

            {/* Center Hub */}
            <motion.div
              {...scaleIn(0.1)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform"
              style={{ width: 230 }}
            >
              <CenterHub />
            </motion.div>
          </div>
        </div>

        {/* ── MOBILE: Hub di Atas sebagai Konteks, lalu Alur Vertikal Terhubung ── */}
        <div className="lg:hidden flex flex-col items-center gap-4">
          {/* Hub sebagai pengantar tujuan */}
          <motion.div {...fadeUp(0.1)} className="w-full max-w-sm mb-2">
            <CenterHub />
          </motion.div>

          {/* Connected Step Cards */}
          <div className="w-full max-w-sm flex flex-col gap-4 relative">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                {...fadeUp(0.15 + i * 0.1)}
                className="w-full transition-all duration-300 hover:-translate-y-1"
              >
                <StepCard step={step} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
