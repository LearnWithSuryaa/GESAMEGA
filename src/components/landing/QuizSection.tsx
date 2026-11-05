"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Clock, User, Lock } from "lucide-react";

const benefits = [
  { icon: Clock,         text: "Hanya membutuhkan waktu", bold: "2 menit", suffix: " untuk diselesaikan" },
  { icon: User,          text: "Dapatkan ", bold: "profil kebiasaan digital", suffix: " dan saran personal" },
  { icon: Lock,          text: "", bold: "100% anonim", suffix: " — tidak ada data pribadi yang disimpan" },
];

export function QuizSection() {
  return (
    <section className="relative py-28 px-4 overflow-hidden bg-surface">
      {/* ── Dynamic Glowing Mesh ── */}
      <div className="absolute inset-0 bg-white/50 mix-blend-overlay" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[500px] h-[500px] bg-primary-soft/50 rounded-full blur-[150px] mix-blend-multiply pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[32px] overflow-hidden border border-slate-200 bg-white shadow-sm"
        >
          <div className="grid md:grid-cols-2">

            {/* Left — Visual */}
            <div className="relative p-10 lg:p-12 flex flex-col justify-center overflow-hidden border-b md:border-b-0 md:border-r border-slate-100" style={{ background: "radial-gradient(circle at top left, rgba(46, 125, 50,0.05) 0%, transparent 100%)" }}>
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                  className="w-14 h-14 rounded-2xl bg-surface-alt flex items-center justify-center mb-6 shadow-sm border border-primary-soft"
                >
                  <Brain className="w-7 h-7 text-primary" />
                </motion.div>

                <h3 className="text-text-dark text-3xl md:text-4xl font-extrabold mb-4 leading-tight tracking-tight">
                  Seberapa Bijak Kamu Menggunakan{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Gadget?
                  </span>
                </h3>
                <p className="text-text-dark font-medium leading-relaxed text-sm md:text-base">
                  5 pertanyaan refleksi singkat untuk mengetahui profil kebiasaan digital Anda. Tanpa penilaian, hanya untuk kesadaran diri.
                </p>
              </div>
            </div>

            {/* Right — CTA */}
            <div className="p-10 lg:p-12 flex flex-col justify-center bg-surface/50">
              <div className="space-y-6 mb-8">
                {benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-alt border border-primary-soft flex items-center justify-center shrink-0">
                      <b.icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-text-dark text-sm leading-relaxed pt-2">
                      {b.text}<strong className="text-text-dark font-semibold">{b.bold}</strong>{b.suffix}
                    </p>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/kuis"
                className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white font-bold text-base transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                Mulai Refleksi
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-slate-400 font-medium text-xs text-center mt-5 uppercase tracking-wider">Anonim & Gratis · Tidak perlu daftar</p>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
