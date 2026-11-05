"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Quote, ArrowRight } from "lucide-react";

const fallbackStudies = [
  {
    id: "fallback-1",
    title: "Penerapan Loker HP Saat Jam KBM",
    school: "SMAN 3 Bandung",
    story: "Menerapkan sistem loker HP di setiap awal kelas. Awalnya siswa keberatan, namun dalam 3 bulan fokus belajar meningkat dan nilai ujian naik signifikan.",
    quote: "Disiplin digital dimulai dari hal kecil yang konsisten.",
    tag: "Kebijakan Sekolah",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accent: "#10b981",
  },
  {
    id: "fallback-2",
    title: "Duta Digital Sebaya",
    school: "SMPN 1 Surabaya",
    story: "Siswa yang memahami literasi digital dipilih sebagai duta sebaya untuk mengedukasi teman-temannya menghindari cyberbullying dan konten negatif.",
    quote: "Edukasi terbaik datang dari teman sebaya yang dipercaya.",
    tag: "Peer Education",
    tagColor: "bg-sky-50 text-sky-700 border-sky-200",
    accent: "#0ea5e9",
  },
  {
    id: "fallback-3",
    title: "Jam Gadget Terjadwal",
    school: "SMPN 5 Yogyakarta",
    story: "Mengalokasikan 30 menit sebelum dan sesudah jam pelajaran sebagai 'jam gadget bebas', sementara jam efektif belajar bebas dari distraksi digital.",
    quote: "Bukan melarang, tapi mengajarkan kontrol diri.",
    tag: "Manajemen Waktu",
    tagColor: "bg-violet-50 text-violet-700 border-violet-200",
    accent: "#8b5cf6",
  },
];

interface RawCaseStudy {
  id: string | number;
  judul?: string;
  isi?: string;
  category?: string;
  impact?: string;
  badge?: string;
  schools?: { nama_sekolah?: string } | null;
}

interface CaseStudySectionProps {
  caseStudies?: RawCaseStudy[];
}

export function CaseStudySection({ caseStudies = [] }: CaseStudySectionProps) {
  const displayStudies =
    caseStudies.length > 0
      ? caseStudies.map((cs) => {
          let tagColor = "bg-gray-50 text-gray-700 border-gray-200";
          let accent = "#6b7280";

          switch (cs.category) {
            case "regulasi":
              tagColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
              accent = "#2E7D32";
              break;
            case "pembelajaran":
              tagColor = "bg-blue-50 text-blue-700 border-blue-200";
              accent = "#1E88E5";
              break;
            case "literasi":
              tagColor = "bg-teal-50 text-teal-700 border-teal-200";
              accent = "#10b981";
              break;
            case "inovasi":
              tagColor = "bg-rose-50 text-rose-700 border-rose-200";
              accent = "#f43f5e";
              break;
          }

          return {
            id: cs.id,
            title: cs.judul,
            school: cs.schools?.nama_sekolah || "Sekolah Tidak Diketahui",
            story: cs.isi
              ? cs.isi.length > 150
                ? cs.isi.substring(0, 150) + "..."
                : cs.isi
              : "",
            quote: cs.impact || "Mengembangkan ekosistem digital yang sehat.",
            tag: cs.badge || "Praktik Baik",
            tagColor,
            accent,
          };
        })
      : fallbackStudies;

  return (
    <section className="relative py-28 px-4 overflow-hidden bg-surface">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 85% 15%, rgba(16,185,129,0.04) 0%, transparent 40%),
            radial-gradient(circle at 15% 85%, rgba(139,92,246,0.04) 0%, transparent 40%)
          `,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ── Header — rata kiri, tanpa pill badge ── */}
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
            Inspirasi
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-dark mt-2 mb-4 leading-tight tracking-tight">
            Praktik Baik dari{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Sekolah Lain
            </span>
          </h2>
          <p className="text-text-dark max-w-xl text-lg font-medium leading-relaxed">
            Pendekatan nyata yang telah diterapkan sekolah dalam mengelola penggunaan gadget secara bijak.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayStudies.map((cs, i) => (
            <motion.div
              key={cs.id || cs.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white border border-slate-200 shadow-sm rounded-2xl p-7 flex flex-col group overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 transform-gpu"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 0% 0%, ${cs.accent}10 0%, transparent 60%)`,
                }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                style={{ background: `linear-gradient(to right, ${cs.accent}, transparent)` }}
              />

              {/* Tag */}
              <span
                className={`relative z-10 self-start inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border mb-5 ${cs.tagColor}`}
              >
                {cs.tag}
              </span>

              <h3 className="relative z-10 text-lg font-bold text-text-dark mb-1.5 leading-snug">
                {cs.title}
              </h3>
              <p
                className="relative z-10 text-sm font-semibold mb-4"
                style={{ color: cs.accent }}
              >
                {cs.school}
              </p>

              <p className="relative z-10 text-text-dark text-sm leading-relaxed flex-1">
                {cs.story}
              </p>

              {/* Quote block */}
              <div className="relative z-10 mt-6 pt-5 border-t border-slate-100">
                <Quote
                  className="absolute top-3 right-0 w-10 h-10 opacity-[0.08]"
                  style={{ color: cs.accent }}
                />
                <p className="text-sm italic text-slate-500 font-medium leading-relaxed">
                  &ldquo;{cs.quote}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Link
            href="/studi-kasus"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-slate-200 bg-white hover:bg-surface text-text-dark font-bold text-sm transition-all duration-300 hover:scale-[1.02] shadow-sm"
          >
            Lihat Semua Studi Kasus
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
