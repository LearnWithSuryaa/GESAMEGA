"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle, ArrowRight } from "lucide-react";

const team = [
  { name: "Muhammad Surya", role: "Full Stack Developer", image: "/assets/team-0.jpeg" },
  { name: "Muhammad Alif Dynastiar", role: "Ketua", image: "/assets/team-2.jpg" },
  { name: "Jazillah Friskha Reynatasya", role: "Media & Informasi", image: "/assets/team-1.jpg" },
  { name: "Zaky Ramadhan Gunawan", role: "Teknis Lapangan", image: "/assets/team-3.jpg" },
  { name: "Afriza Dwi Maharani", role: "Data Analyst", image: "/assets/team-5.jpg" },
  { name: "Muhammad Fadhlullohi Azka", role: "Penyusun Web / IT", image: "/assets/team-4.jpg" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export default function TimPengembangPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[10%] right-[5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] mix-blend-screen" />
          <div className="absolute bottom-0 left-[5%] w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[140px] mix-blend-screen" />
        </div>

        <motion.div {...fadeUp(0)} className="mb-5 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-info text-xs font-bold uppercase tracking-[0.15em]">
            <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
            Tim Layanan
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center max-w-4xl tracking-tight leading-tight mb-6 relative z-10"
          style={{ color: "var(--color-text-dark)" }}
        >
          Tim khusus yang{" "}
          <span style={{ background: "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            berdedikasi
          </span>
          <br className="hidden md:block" /> untuk sekolah Anda
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="text-lg text-center max-w-2xl font-medium mb-10 leading-relaxed relative z-10" style={{ color: "var(--color-text-light)" }}>
          Semua anggota tim kami didedikasikan untuk mendukung sekolah dalam membangun budaya digital yang cerdas dan positif.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto relative z-10">
          <Link href="/visi-misi" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-sm transition-all duration-300" style={{ color: "var(--color-text-dark)", borderColor: "var(--color-border)" }}>
            Visi &amp; Misi
          </Link>
          <Link href="/tentang" className="w-full sm:w-auto btn-pill-primary text-sm">
            Pelajari Gerakan Kami <ArrowRight className="w-4 h-4 ml-2 inline" />
          </Link>
        </motion.div>

        {/* Team Cards */}
        <div className="w-full max-w-7xl relative mx-auto pb-10 z-10">
          <div className="flex justify-center flex-wrap xl:flex-nowrap gap-4 lg:gap-6 px-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                {...fadeUp(0.2 + i * 0.1)}
                className="group relative w-full sm:w-64 max-w-[260px] aspect-[3/4] rounded-[1.5rem] overflow-hidden cursor-pointer border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:z-10"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill={true}
                  sizes="(max-width: 640px) 100vw, 260px"
                  className="object-cover transition-all duration-500 ease-in-out filter grayscale-0 md:grayscale md:group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-60 md:group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" style={{ background: "radial-gradient(circle at top right, rgba(46, 125, 50,0.15) 0%, transparent 70%)" }} />
                <div className="absolute bottom-4 left-4 right-4 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 z-20">
                  <div className="backdrop-blur-md border rounded-xl p-3 text-center" style={{ background: "rgba(0,0,0,0.65)", borderColor: "rgba(255,255,255,0.12)" }}>
                    <p className="text-white font-bold text-sm leading-tight">{member.name}</p>
                    <p className="text-info text-xs font-semibold mt-0.5">{member.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section className="py-24 px-4 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-16">

          {/* Form Card */}
          <motion.div {...fadeUp(0.1)} className="flex-1 rounded-3xl p-8 md:p-10 shadow-sm" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
            <h2 className="text-2xl font-extrabold mb-8 tracking-tight" style={{ color: "var(--color-text-dark)" }}>Hubungi tim layanan</h2>
            <div className="flex flex-col sm:flex-row gap-5 mb-5">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text-light)" }}>Nama Depan *</label>
                <input type="text" placeholder="Nama awal" className="w-full px-4 py-3 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all" style={{ background: "var(--color-surface-alt)", borderColor: "var(--color-border)", color: "var(--color-text-dark)" }} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text-light)" }}>Nama Belakang *</label>
                <input type="text" placeholder="Nama akhir" className="w-full px-4 py-3 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all" style={{ background: "var(--color-surface-alt)", borderColor: "var(--color-border)", color: "var(--color-text-dark)" }} />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text-light)" }}>Email *</label>
              <input type="email" placeholder="email@sekolah.sch.id" className="w-full px-4 py-3 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all" style={{ background: "var(--color-surface-alt)", borderColor: "var(--color-border)", color: "var(--color-text-dark)" }} />
            </div>
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text-light)" }}>Pesan</label>
              <textarea rows={4} placeholder="Tuliskan pertanyaan Anda..." className="w-full px-4 py-3 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all resize-none" style={{ background: "var(--color-surface-alt)", borderColor: "var(--color-border)", color: "var(--color-text-dark)" }} />
            </div>
            <button className="btn-pill-primary w-full text-base py-3.5">Kirim Pesan</button>
          </motion.div>

          {/* Info Cards */}
          <div className="flex-1 flex flex-col justify-center gap-6">
            <motion.div {...fadeUp(0.15)} className="rounded-3xl p-7 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden shadow-sm" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle at top left, rgba(46, 125, 50,0.05) 0%, transparent 70%)" }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative z-10" style={{ background: "rgba(46, 125, 50,0.12)", border: "1px solid rgba(46, 125, 50,0.25)" }}>
                <MessageCircle className="w-6 h-6 text-info" />
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10" style={{ color: "var(--color-text-dark)" }}>Chat dengan tim kami</h3>
              <p className="text-sm font-medium mb-4 leading-relaxed relative z-10" style={{ color: "var(--color-text-light)" }}>Tertarik berkolaborasi? Berbicara dengan asisten kami langsung.</p>
              <a href="mailto:sales@gesemega.id" className="font-bold text-info hover:text-info-dark transition-colors relative z-10">sales@gesemega.id</a>
            </motion.div>

            <motion.div {...fadeUp(0.25)} className="rounded-3xl p-7 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden shadow-sm" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle at top left, rgba(16,185,129,0.05) 0%, transparent 70%)" }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative z-10" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
                <Mail className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10" style={{ color: "var(--color-text-dark)" }}>Email dukungan</h3>
              <p className="text-sm font-medium mb-4 leading-relaxed relative z-10" style={{ color: "var(--color-text-light)" }}>Punya pertanyaan seputar platform? Balasan cepat di bawah 24 jam.</p>
              <a href="mailto:support@gesemega.id" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors relative z-10">support@gesemega.id</a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
