"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  TrendingUp,
  School,
  User,
  Search,
  Sparkles,
  Lock,
  Zap,
  ShieldCheck,
  MessageSquare,
  FileText,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface CaseStudy {
  id: string | number;
  judul: string;
  sekolah: string;
  penulis: string;
  isi: string;
  category: "regulasi" | "pembelajaran" | "literasi" | "inovasi";
  impact: string;
  badge: string;
  icon: LucideIcon;
  color: string;
}

interface DbCaseStudyRow {
  id: string | number;
  judul: string;
  isi: string;
  penulis: string;
  category: "regulasi" | "pembelajaran" | "literasi" | "inovasi";
  impact: string | null;
  badge: string | null;
  created_at: string;
  school_id: string | null;
  schools: { nama_sekolah: string } | null;
}

const CATEGORIES = [
  { id: "all", label: "Semua", icon: Sparkles },
  { id: "regulasi", label: "Regulasi", icon: Lock },
  { id: "pembelajaran", label: "Metode Belajar", icon: Zap },
  { id: "literasi", label: "Literasi Digital", icon: ShieldCheck },
  { id: "inovasi", label: "Inovasi Sekolah", icon: TrendingUp },
];

export default function StudiKasusPage() {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCases() {
      const { data, error } = await supabase
        .from("case_studies")
        .select(
          "id, judul, isi, penulis, category, impact, badge, created_at, school_id, schools(nama_sekolah)",
        )
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setCases(
          (data as unknown as DbCaseStudyRow[]).map((d) => {
            let icon: LucideIcon = Sparkles;
            let color = "bg-gray-50 text-gray-600 border-gray-200";

            switch (d.category) {
              case "regulasi":
                icon = Lock;
                color = "bg-surface-alt text-primary border-primary-soft";
                break;
              case "pembelajaran":
                icon = Zap;
                color = "bg-blue-50 text-blue-600 border-blue-200";
                break;
              case "literasi":
                icon = ShieldCheck;
                color = "bg-emerald-50 text-emerald-600 border-emerald-200";
                break;
              case "inovasi":
                icon = TrendingUp;
                color = "bg-rose-50 text-rose-600 border-rose-200";
                break;
            }

            return {
              id: d.id,
              judul: d.judul,
              isi: d.isi,
              penulis: d.penulis,
              sekolah: d.schools?.nama_sekolah || "Sekolah Tidak Diketahui",
              category: d.category || "inovasi",
              impact: d.impact || "Terverifikasi",
              badge: d.badge || "Praktik Baik",
              icon,
              color,
            };
          }),
        );
      }
    }
    fetchCases();
  }, []);

  const filtered = cases.filter((cs) => {
    const matchCat = activeTab === "all" || cs.category === activeTab;
    const matchSearch =
      cs.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.sekolah.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20 relative overflow-hidden">
      {/* Glowing Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[5%] right-[5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] mix-blend-screen" />
        <div className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] bg-rose-500/8 rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute top-[35%] left-[40%] w-[400px] h-[400px] bg-amber-500/6 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-3 rounded-2xl mb-6"
            style={{
              background: "rgba(46, 125, 50,0.12)",
              border: "1px solid rgba(46, 125, 50,0.25)",
            }}
          >
            <BookOpen className="w-8 h-8" style={{ color: "#64B5F6" }} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight"
          >
            Studi Kasus &{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Praktik Baik
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Pelajari bagaimana sekolah-sekolah di seluruh Kota Sidoarjo
            menghadapi tantangan digital dan mengimplementasikan solusi inovatif
            demi masa depan siswa yang lebih cerah.
          </motion.p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mb-12 space-y-8">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              type="text"
              placeholder="Cari sekolah atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all font-medium text-white/80 placeholder:text-white/25"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
                  style={
                    activeTab === cat.id
                      ? {
                          background: "linear-gradient(135deg,#1E88E5,#2E7D32)",
                          color: "white",
                          boxShadow: "0 0 20px rgba(46, 125, 50,0.35)",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.45)",
                        }
                  }
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Card (if showing all and first item exists) */}
        <AnimatePresence mode="wait">
          {activeTab === "all" && searchQuery === "" && filtered.length > 0 && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <div className="group relative bg-[#111] rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(46, 125, 50,0.15),transparent)] pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                      Studi Kasus Pilihan
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                      {filtered[0].judul}
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl whitespace-pre-line line-clamp-3">
                      {filtered[0].isi}
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-white/80 font-bold">
                        <School className="w-5 h-5 text-info" />
                        {filtered[0].sekolah}
                      </div>
                      <div className="flex items-center gap-2 text-white/80 font-bold">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        {filtered[0].impact}
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <Link
                      href={`/studi-kasus/${filtered[0].id}`}
                      className="w-full md:w-auto bg-white hover:bg-surface-alt text-gray-900 font-black px-8 py-5 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                      Baca Selengkapnya <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered
              .slice(activeTab === "all" && searchQuery === "" ? 1 : 0)
              .map((cs, i) => {
                const Icon = cs.icon;
                return (
                  <motion.div
                    key={cs.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link
                      href={`/studi-kasus/${cs.id}`}
                      className="block h-full"
                    >
                      <div
                        className="group rounded-2xl transition-all duration-300 p-6 h-full flex flex-col"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${cs.color}`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <span
                            className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                            style={{
                              color: "rgba(255,255,255,0.35)",
                              background: "rgba(255,255,255,0.06)",
                            }}
                          >
                            {cs.badge}
                          </span>
                        </div>

                        <h3 className="text-xl font-extrabold text-white mb-3 leading-snug group-hover:text-info transition-colors">
                          {cs.judul}
                        </h3>

                        <p
                          className="text-white/35 text-sm leading-relaxed mb-6 flex-1 line-clamp-4 pl-4 py-1 whitespace-pre-line"
                          style={{
                            borderLeft: "2px solid rgba(46, 125, 50,0.25)",
                          }}
                        >
                          {cs.isi}
                        </p>

                        <div
                          className="space-y-4 pt-4"
                          style={{
                            borderTop: "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <School className="w-4 h-4 text-white/25" />
                            <span className="text-xs font-bold text-white/55">
                              {cs.sekolah}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-white/22" />
                              <span className="text-[11px] font-medium text-white/30">
                                {cs.penulis}
                              </span>
                            </div>
                            <div
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black"
                              style={{
                                background: "rgba(16,185,129,0.12)",
                                color: "#10b981",
                              }}
                            >
                              <TrendingUp className="w-3.5 h-3.5" />
                              {cs.impact}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20 px-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              <BookOpen className="w-10 h-10" />
            </div>

            {cases.length === 0 ? (
              <>
                <h3 className="text-2xl font-extrabold text-white mb-3">
                  Belum Ada Studi Kasus
                </h3>
                <p className="text-white/40 max-w-md mx-auto mb-8">
                  Jadilah sekolah pertama yang membagikan praktik baik, inovasi,
                  atau regulasi yang telah Anda terapkan!
                </p>
                <Link
                  href="/hasil"
                  className="bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-primary/20"
                >
                  <FileText className="w-5 h-5" /> Bagikan Studi Kasus Anda
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  Studi kasus tidak ditemukan
                </h3>
                <p className="text-white/40">
                  Coba gunakan kategori lain atau kata kunci pencarian yang
                  berbeda.
                </p>
              </>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20">
          <div className="bg-primary rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                Punya Praktik Baik di Sekolah Anda?
              </h2>
              <p className="text-white/80 text-lg mb-10 font-medium leading-relaxed">
                Jadilah inspirasi bagi sekolah lain. Bagikan pengalaman unik
                sekolah Anda dalam membangun ekosistem digital yang sehat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link
                  href="/panduan"
                  className="flex-1 sm:flex-initial w-full bg-white text-primary font-black px-8 py-5 rounded-2xl shadow-xl hover:bg-surface-alt transition-all active:scale-95 text-center"
                >
                  Pelajari Panduan Kebijakan
                </Link>
                <button className="flex-1 sm:flex-initial bg-primary text-white border border-white/20 font-black px-8 py-5 rounded-2xl hover:bg-primary transition-all active:scale-95">
                  Hubungi Tim Riset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
