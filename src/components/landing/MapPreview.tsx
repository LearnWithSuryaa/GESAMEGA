"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ClipboardList,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const MapPreviewInner = dynamic(
  () => import("@/components/landing/MapPreviewInner"),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: "rgba(16,185,129,0.03)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
          <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">
            Memuat peta…
          </span>
        </div>
      </div>
    ),
  },
);

const legend = [
  {
    icon: BadgeCheck,
    label: "Sudah Komitmen",
    accent: "#2E7D32",
    bg: "rgba(46,125,50,0.12)",
  },
  {
    icon: ClipboardList,
    label: "Sudah Survei",
    accent: "#1E88E5",
    bg: "rgba(30,136,229,0.12)",
  },
  {
    icon: MapPin,
    label: "Belum Ikut",
    accent: "#94a3b8",
    bg: "rgba(148,163,184,0.10)",
  },
];

export function MapPreview() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-white">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 0%, rgba(16,185,129,0.04) 0%, transparent 40%),
            radial-gradient(circle at 90% 100%, rgba(59,130,246,0.04) 0%, transparent 40%)
          `,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-soft bg-surface-alt shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  Live · Real-time
                </span>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-text-dark leading-[1.05] tracking-tight">
              Peta{" "}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, #2E7D32 0%, #1E88E5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Partisipasi
              </span>
              <br />
              <span className="text-slate-400 text-4xl md:text-5xl">
                Sekolah Nasional
              </span>
            </h2>

            <p className="text-text-dark text-base mt-4 max-w-lg font-medium leading-relaxed">
              Pantau sebaran sekolah di seluruh Kota Sidoarjo yang telah
              bergabung dalam ekosistem digital pendidikan.
            </p>
          </motion.div>
        </div>

        {/* Map card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 z-60 pointer-events-none">
            <svg viewBox="0 0 64 64" fill="none">
              <path
                d="M2 32 L2 2 L32 2"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 z-60 pointer-events-none">
            <svg viewBox="0 0 64 64" fill="none">
              <path
                d="M62 32 L62 2 L32 2"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
            </svg>
          </div>

          <div className="relative w-full" style={{ height: "460px" }}>
            <style>{`
              .mp-leaflet-wrap,
              .mp-leaflet-wrap .leaflet-container {
                position: absolute !important;
                inset: 0 !important;
                width: 100% !important;
                height: 100% !important;
              }
            `}</style>

            <div className="mp-leaflet-wrap">
              <MapPreviewInner />
            </div>

            {/* Vignette overlays */}
            <div className="absolute inset-0 pointer-events-none z-450">
              <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-white/95 via-white/50 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-14 bg-linear-to-b from-white/50 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-14 bg-linear-to-r from-white/55 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-14 bg-linear-to-l from-white/55 to-transparent" />
            </div>

            {/* Interaction blocker */}
            <div className="absolute inset-0 z-460 cursor-default" />

            {/* Floating bottom bar */}
            <div className="absolute inset-x-0 bottom-0 z-470 px-5 pb-5 flex items-end justify-between gap-3 flex-wrap">
              {/* Legend pills */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap gap-2"
              >
                {legend.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: item.bg,
                      border: `1px solid ${item.accent}35`,
                      color: "rgba(0,0,0,0.7)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <item.icon
                      className="w-3 h-3 shrink-0"
                      style={{ color: item.accent }}
                    />
                    {item.label}
                  </div>
                ))}
              </motion.div>

              {/* CTA button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.4 }}
                className="shrink-0"
              >
                <Link
                  href="/peta"
                  className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-200 shadow-[0_0_28px_rgba(46,125,50,0.4),0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_0_44px_rgba(46,125,50,0.55),0_4px_18px_rgba(0,0,0,0.15)] hover:scale-[1.03]"
                  style={{
                    background:
                      "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                  }}
                >
                  <MapPin className="w-4 h-4" />
                  Lihat Peta Lengkap
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Bottom info strip */}
          <div
            className="grid grid-cols-3"
            style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
          >
            {[
              { label: "Data diperbarui", value: "Setiap hari" },
              { label: "Cakupan wilayah", value: "Seluruh Kota Sidoarjo" },
              { label: "Status sistem", value: "Operasional" },
            ].map((item, i) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center py-4 px-3 gap-0.5"
                style={{
                  borderRight: i < 2 ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}
              >
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-text-dark">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
