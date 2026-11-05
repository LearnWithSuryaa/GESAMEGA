"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Target,
  Globe2,
  ShieldCheck,
  Users,
  School,
  ArrowRight,
  BookOpen,
  Handshake,
} from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Berorientasi Dampak",
    description:
      "Setiap fitur dirancang untuk menghasilkan perubahan nyata di ekosistem pendidikan digital Indonesia.",
    glowColor: "rgba(46, 125, 50,0.12)",
    glowBorder: "rgba(46, 125, 50,0.25)",
    iconColor: "text-info",
    hoverGlow: "rgba(46, 125, 50,0.08)",
  },
  {
    icon: Globe2,
    title: "Jangkauan Nasional",
    description:
      "Menghubungkan ribuan sekolah dari Sabang sampai Merauke dalam satu gerakan kolaboratif.",
    glowColor: "rgba(16,185,129,0.12)",
    glowBorder: "rgba(16,185,129,0.25)",
    iconColor: "text-emerald-400",
    hoverGlow: "rgba(16,185,129,0.08)",
  },
  {
    icon: ShieldCheck,
    title: "Berbasis Komitmen",
    description:
      "Mendorong sekolah untuk tidak hanya berpartisipasi, tetapi juga berkomitmen secara resmi.",
    glowColor: "rgba(139,92,246,0.12)",
    glowBorder: "rgba(139,92,246,0.25)",
    iconColor: "text-violet-400",
    hoverGlow: "rgba(139,92,246,0.08)",
  },
  {
    icon: BookOpen,
    title: "Berbagi Pengetahuan",
    description:
      "Platform studi kasus yang menampilkan praktik terbaik dari sekolah-sekolah pelopor digital.",
    glowColor: "rgba(244,63,94,0.12)",
    glowBorder: "rgba(244,63,94,0.25)",
    iconColor: "text-rose-400",
    hoverGlow: "rgba(244,63,94,0.08)",
  },
];

const milestones = [
  {
    year: "2026",
    label: "Titik Awal Kegelisahan",
    desc: "Berawal dari obrolan kedai kopi tentang kekhawatiran layar gadget yang perlahan menggeser konsentrasi belajar dan interaksi sosial anak.",
  },
  {
    year: "2026",
    label: "Langkah Kolaborasi",
    desc: "Mengubah keresahan menjadi tindakan nyata dengan merancang gerakan inovatif yang melibatkan partisipasi aktif siswa, guru, orang tua, dan sekolah.",
  },
  {
    year: "2026",
    label: "Lahirnya GESAMEGA",
    desc: "Peluncuran gerakan untuk mengelola teknologi secara bijak, mengubahnya dari ancaman menjadi jembatan menuju generasi yang cerdas dan seimbang.",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: {
    duration: 0.6,
    delay,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
});

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[5%] right-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] mix-blend-screen" />
          <div className="absolute bottom-0 left-[5%] w-[500px] h-[500px] bg-rose-500/8 rounded-full blur-[140px] mix-blend-screen" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-info text-xs font-bold uppercase tracking-[0.15em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
              Tentang Kami
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl md:text-6xl font-extrabold mt-4 mb-6 leading-tight tracking-tight"
            style={{ color: "var(--color-text-dark)" }}
          >
            Gerakan Digital{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              untuk Sekolah
            </span>{" "}
            Indonesia
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
            style={{ color: "var(--color-text-light)" }}
          >
            GESEMEGA adalah platform kolaboratif nasional yang membantu sekolah
            membangun ekosistem digital yang sehat, terukur, dan berdampak nyata
            bagi kualitas pendidikan Indonesia.
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-wrap gap-4 justify-center mt-10"
          >
            <Link href="/artikel" className="btn-pill-primary text-sm inline-flex items-center">
              Baca Wawasan <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>
            <Link
              href="/visi-misi"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-sm transition-all duration-300"
              style={{ color: "var(--color-text-dark)", borderColor: "var(--color-border)" }}
            >
              Visi &amp; Misi
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(46, 125, 50,0.85) 0%, rgba(244,63,94,0.85) 100%)",
          }}
        />
        {/* Glassmorphism shine overlay */}
        <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />
        <div className="absolute top-0 inset-x-0 h-px bg-white/20" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-black/20" />

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10" style={{ color: "white" }}>
          {[
            { value: "3.600+", label: "Sekolah Terdaftar", icon: School },
            { value: "34", label: "Provinsi", icon: Globe2 },
            {
              value: "1.200+",
              label: "Komitmen Ditanda-tangani",
              icon: Handshake,
            },
            { value: "98%", label: "Kepuasan Peserta", icon: Users },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp(i * 0.08)}
              className="flex flex-col items-center gap-1"
            >
              <s.icon className="w-6 h-6 opacity-80 mb-1" />
              <p className="text-3xl font-black tracking-tight">{s.value}</p>
              <p className="text-sm font-medium opacity-80">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PILLAR CARDS ── */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-info text-xs font-bold uppercase tracking-[0.15em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
              Nilai Kami
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4 leading-tight tracking-tight" style={{ color: "var(--color-text-dark)" }}>
              Fondasi yang{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Kami Pegang
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp(i * 0.1)}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group rounded-3xl p-6 flex flex-col items-start relative overflow-hidden transition-all duration-300"
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
                    background: `radial-gradient(circle at top left, ${p.hoverGlow} 0%, transparent 70%)`,
                  }}
                />

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm relative z-10 shrink-0"
                  style={{
                    background: p.glowColor,
                    border: `1px solid ${p.glowBorder}`,
                  }}
                >
                  <p.icon className={`w-7 h-7 ${p.iconColor}`} />
                </div>
                <h3 className="font-bold mb-3 text-lg leading-snug relative z-10" style={{ color: "var(--color-text-dark)" }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed relative z-10" style={{ color: "var(--color-text-light)" }}>
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MILESTONE TIMELINE ── */}
      <section className="py-24 px-4 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-info text-xs font-bold uppercase tracking-[0.15em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
              Perjalanan
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4 leading-tight tracking-tight" style={{ color: "var(--color-text-dark)" }}>
              Dari Ide ke{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Gerakan Nasional
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-gray-300 to-transparent -translate-x-1/2" />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.label}
                  {...fadeUp(i * 0.15)}
                  className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Card */}
                  <div
                    className={`group rounded-2xl p-6 ml-14 md:ml-0 md:w-[calc(50%-2.5rem)] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${i % 2 === 0 ? "md:mr-auto md:pr-10" : "md:ml-auto md:pl-10"}`}
                    style={{
                      background: "#ffffff",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle at top right, rgba(46, 125, 50,0.07) 0%, transparent 70%)",
                      }}
                    />
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-info text-xs font-bold uppercase tracking-widest mb-3 relative z-10">
                      {m.year}
                    </span>
                    <h3 className="font-bold text-lg mt-2 mb-2 relative z-10" style={{ color: "var(--color-text-dark)" }}>
                      {m.label}
                    </h3>
                    <p className="text-sm leading-relaxed relative z-10" style={{ color: "var(--color-text-light)" }}>
                      {m.desc}
                    </p>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-lg shadow-primary/30 z-10" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <motion.div
          {...fadeUp(0)}
          className="max-w-3xl mx-auto rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
          style={{
            background: "#ffffff",
            border: "1px solid var(--color-border)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          {/* Glow corner */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-info text-xs font-bold uppercase tracking-[0.15em] mb-6 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
            Bergabung
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4 leading-tight tracking-tight relative z-10" style={{ color: "var(--color-text-dark)" }}>
            Jadikan Sekolahmu
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Bagian dari Gerakan
            </span>
          </h2>

          <p className="mb-8 text-lg font-medium relative z-10" style={{ color: "var(--color-text-light)" }}>
            Jelajahi berbagai wawasan dan panduan untuk membangun ekosistem
            digital yang lebih sehat di sekolah Anda.
          </p>

          <Link href="/artikel" className="relative z-10 btn-pill-primary text-sm inline-flex items-center">
            Mulai Membaca <ArrowRight className="w-4 h-4 ml-2 inline" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
