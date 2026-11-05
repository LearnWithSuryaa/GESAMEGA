"use client";

import { motion } from "framer-motion";
import { Activity, Map, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Survei Diagnostik",
    description:
      "Evaluasi penggunaan gadget di lingkungan sekolah secara menyeluruh. Petakan tingkat kesiapan digital setiap sekolah berdasarkan data langsung dari guru, siswa, dan tenaga pendidik. Hasilnya menjadi dasar rekomendasi yang konkret dan terukur.",
    accent: "#2E7D32",
    accentLight: "rgba(46, 125, 50,0.10)",
    accentBorder: "rgba(46, 125, 50,0.20)",
    number: "01",
    featured: true,
  },
  {
    icon: Map,
    title: "Peta Partisipasi",
    description:
      "Visualisasi sebaran sekolah yang telah berkontribusi dalam gerakan sadar digital nasional.",
    accent: "#10b981",
    accentLight: "rgba(16,185,129,0.10)",
    accentBorder: "rgba(16,185,129,0.20)",
    number: "02",
    featured: false,
  },
  {
    icon: ShieldCheck,
    title: "Komitmen Digital",
    description:
      "Penandatanganan kontrak digital resmi sebagai bukti tanggung jawab bersama ekosistem sekolah.",
    accent: "#1E88E5",
    accentLight: "rgba(30,136,229,0.10)",
    accentBorder: "rgba(30,136,229,0.20)",
    number: "03",
    featured: false,
  },
];

export function SolutionSection() {
  const [featured, ...rest] = features;
  const FeaturedIcon = featured.icon;

  return (
    <section className="relative py-28 px-4 overflow-hidden bg-white">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 80% 20%, rgba(16,185,129,0.04) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(30,136,229,0.04) 0%, transparent 40%)
          `,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ── Header — rata kiri, tanpa pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-16"
        >
          <span
            className="text-xs uppercase tracking-[0.25em] font-bold mb-4 block"
            style={{ color: "#2E7D32" }}
          >
            Tiga Layanan Utama
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-text-dark mt-2 mb-4 leading-tight tracking-tight">
            Langkah Nyata{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Kolaboratif
            </span>
            <br />
            Berbasis Partisipasi
          </h2>

          <p className="text-text-dark max-w-xl text-lg font-medium">
            Fondasi platform dalam mendampingi sekolah membangun ekosistem digital yang sehat.
          </p>
        </motion.div>

        {/* ── Cards: featured kiri besar + dua kanan stacked ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Featured Card — 3/5 lebar */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <div
              className="relative rounded-2xl overflow-hidden border p-8 flex flex-col h-full group transition-all duration-300 hover:shadow-lg transform-gpu will-change-transform"
              style={{
                backgroundColor: featured.accentLight,
                borderColor: featured.accentBorder,
              }}
            >
              {/* Subtle pattern texture */}
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="sol-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="3" cy="3" r="1.2" fill="#2E7D32" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#sol-dots)" />
              </svg>

              {/* Number */}
              <span
                className="relative z-10 text-[80px] font-black leading-none opacity-10 select-none mb-2"
                style={{ color: featured.accent }}
              >
                {featured.number}
              </span>

              {/* Icon */}
              <div
                className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border"
                style={{
                  backgroundColor: "rgba(46, 125, 50, 0.15)",
                  borderColor: "rgba(46, 125, 50, 0.30)",
                }}
              >
                <FeaturedIcon className="w-6 h-6" style={{ color: featured.accent }} />
              </div>

              <h3
                className="relative z-10 text-2xl font-bold mb-4 leading-snug"
                style={{ color: "#1a2e1b" }}
              >
                {featured.title}
              </h3>
              <p
                className="relative z-10 text-base leading-relaxed flex-1"
                style={{ color: "#2d4a2e" }}
              >
                {featured.description}
              </p>

              <div
                className="relative z-10 mt-8 h-0.5 w-12 rounded-full group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: featured.accent }}
              />
            </div>
          </motion.div>

          {/* Stacked small cards — 2/5 lebar */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rest.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex-1"
                >
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-6 flex flex-col h-full group transition-all duration-300 hover:shadow-md hover:-translate-y-1 transform-gpu will-change-transform">
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${feature.accent}14 0%, transparent 65%)`,
                      }}
                    />

                    <div className="relative z-10 flex items-start gap-4">
                      <div
                        className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border"
                        style={{
                          backgroundColor: feature.accentLight,
                          borderColor: feature.accentBorder,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: feature.accent }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-[10px] font-black tracking-widest opacity-50 block mb-1"
                          style={{ color: feature.accent }}
                        >
                          {feature.number}
                        </span>
                        <h3 className="font-bold text-text-dark text-base leading-snug mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-text-dark text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className="relative z-10 mt-5 h-0.5 w-6 rounded-full opacity-40 group-hover:opacity-100 group-hover:w-full transition-all duration-500"
                      style={{ backgroundColor: feature.accent }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
