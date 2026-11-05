"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, Target, Sparkles, Layers, ArrowRight } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, delay },
});

const missions = [
  {
    icon: Compass,
    title: "Ekosistem Digital",
    desc: "Kolaborasi aktif antara siswa, guru, dan pemerintah dalam penggunaan gadget yang sehat dan berimbang.",
  },
  {
    icon: Sparkles,
    title: "Literasi Reflektif",
    desc: "Mendorong pola pikir kritis, reflektif, dan bertanggung jawab dalam penggunaan teknologi.",
  },
  {
    icon: Layers,
    title: "Platform Inklusif",
    desc: "Website sebagai sarana monitoring, pembelajaran, dan aspirasi seluruh warga sekolah.",
  },
  {
    icon: Target,
    title: "Model Nasional",
    desc: "Menjadi praktik baik yang dapat direplikasi dan berdampak luas.",
  },
];

export default function VisiMisiPage() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "var(--color-surface)" }}>
      {/* ── HERO ── */}
      <section className="relative pt-40 pb-36 px-4 text-center overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[160px] mix-blend-screen" />
          <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-rose-500/8 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        {/* Smooth fade bottom */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, transparent, var(--color-surface))" }} />

        <motion.div {...fadeUp(0)} className="max-w-4xl mx-auto relative z-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-info text-xs font-bold uppercase tracking-[0.15em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
            Filosofi Kami
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-[1.15] tracking-tight mt-4" style={{ color: "var(--color-text-dark)" }}>
            Membangun{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Generasi Digital
            </span>{" "}
            yang Cerdas &amp; Berkarakter
          </h1>

          <p className="mt-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--color-text-light)" }}>
            Gerakan kolaboratif untuk menciptakan ekosistem digital pendidikan
            yang sehat, bijak, dan berkelanjutan.
          </p>
        </motion.div>
      </section>

      {/* ── VISI CARD ── */}
      <section className="relative px-4 pb-24 z-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            {...fadeUp(0)}
            className="relative rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden"
            style={{
              background: "#ffffff",
              border: "1px solid var(--color-border)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            {/* Corner glow */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/15 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-primary/8 blur-[80px] rounded-full pointer-events-none" />

            <p className="text-info font-bold mb-5 tracking-[0.2em] uppercase text-sm relative z-10">
              VISI
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-[1.35] relative z-10" style={{ color: "var(--color-text-dark)" }}>
              Terwujudnya{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Generasi Digital Cerdas, Bijak, dan Berkarakter
              </span>
            </h2>

            <p className="mt-6 text-lg max-w-2xl mx-auto relative z-10" style={{ color: "var(--color-text-light)" }}>
              yang mampu mengoptimalkan teknologi untuk masa depan pendidikan
              yang lebih bermartabat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MISI TIMELINE ── */}
      <section className="py-24 px-4 relative">
        {/* Top separator */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-info text-xs font-bold uppercase tracking-[0.15em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
              Misi
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4" style={{ color: "var(--color-text-dark)" }}>
              Strategi Utama
            </h2>
            <p className="mt-3 text-lg" style={{ color: "var(--color-text-light)" }}>
              Empat langkah untuk mewujudkan visi
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/30 via-info/30 to-transparent -translate-x-1/2" />

            <div className="space-y-16 md:space-y-20">
              {missions.map((m, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={m.title}
                    {...fadeUp(0.1 * i)}
                    className="relative flex items-center justify-center"
                  >
                    {/* Dot */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-primary rounded-full ring-4 ring-white z-10 shadow-lg shadow-primary/30" style={{ backgroundColor: "var(--color-primary)" }} />

                    {/* Card */}
                    <div
                      className={`w-full md:w-1/2 pl-14 pr-0 md:px-0 ${isLeft ? "md:pr-16 md:mr-auto text-left md:text-right" : "md:pl-16 md:ml-auto text-left"}`}
                    >
                      <motion.div
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="group rounded-2xl p-6 md:p-8 relative overflow-hidden transition-all duration-300"
                        style={{
                          background: "#ffffff",
                          border: "1px solid var(--color-border)",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                        }}
                      >
                        {/* Hover glow */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at ${isLeft ? "top right" : "top left"}, rgba(46, 125, 50,0.08) 0%, transparent 70%)`,
                          }}
                        />

                        <div
                          className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 relative z-10 ${isLeft ? "md:justify-end justify-start" : "justify-start"}`}
                        >
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              background: "rgba(46, 125, 50,0.12)",
                              border: "1px solid rgba(46, 125, 50,0.25)",
                            }}
                          >
                            <m.icon className="w-5 h-5 text-info" />
                          </div>
                          <h3 className="text-lg font-bold" style={{ color: "var(--color-text-dark)" }}>
                            {m.title}
                          </h3>
                        </div>

                        <p className="leading-relaxed relative z-10" style={{ color: "var(--color-text-light)" }}>
                          {m.desc}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <motion.div {...fadeUp(0)} className="max-w-3xl mx-auto text-center">
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
            style={{
              background: "rgba(46, 125, 50,0.12)",
              border: "1px solid rgba(46, 125, 50,0.25)",
            }}
          >
            <Sparkles className="w-8 h-8 text-info" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "var(--color-text-dark)" }}>
            Saatnya Mengambil Bagian
          </h2>

          <p className="text-lg mb-10" style={{ color: "var(--color-text-light)" }}>
            Bergabunglah dalam gerakan untuk menciptakan ekosistem digital
            pendidikan yang lebih baik.
          </p>

          <Link href="/peta" className="btn-pill-primary px-10 py-4 inline-flex items-center">
            Lihat Peta Partisipasi{" "}
            <ArrowRight className="ml-2 inline w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
