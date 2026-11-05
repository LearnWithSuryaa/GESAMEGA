"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import type { DbArticle } from "@/types/article";

interface ArticleSectionProps {
  articles?: DbArticle[];
}

function getBadgeStyle(kategori?: string | null): { color: string; label: string } {
  switch (kategori) {
    case "literasi":
      return { color: "bg-purple-50 text-purple-600 border-purple-200", label: "Edukasi" };
    case "kebijakan":
      return { color: "bg-emerald-50 text-emerald-600 border-emerald-200", label: "Panduan Praktis" };
    case "kesehatan":
      return { color: "bg-blue-50 text-blue-600 border-blue-200", label: "Riset Terbaru" };
    case "guru":
      return { color: "bg-surface-alt text-primary border-primary-soft", label: "Tips & Trik" };
    default:
      return { color: "bg-surface text-text-dark border-slate-200", label: "Artikel" };
  }
}

export function ArticleSection({ articles = [] }: ArticleSectionProps) {
  if (articles.length === 0) return null;

  const [featured, ...rest] = articles;
  const featuredBadge = getBadgeStyle(featured.kategori);
  const featuredReadTime =
    Math.max(1, Math.ceil((featured.isi?.length || 0) / 1000)) + " menit";
  const featuredDate = new Date(featured.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const featuredExcerpt = featured.isi
    ? featured.isi.length > 240
      ? featured.isi.substring(0, 240) + "..."
      : featured.isi
    : "";

  return (
    <section className="relative py-28 px-4 overflow-hidden bg-white">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 80% 10%, rgba(46,125,50,0.04) 0%, transparent 40%)`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ── Header — rata kiri ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-soft bg-surface-alt text-primary text-xs font-bold uppercase tracking-[0.15em] mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Wawasan Terbaru
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-dark mt-2 mb-4 leading-tight tracking-tight">
            Artikel &{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Edukasi
            </span>
          </h2>
          <p className="text-text-dark max-w-xl text-lg font-medium leading-relaxed">
            Panduan praktis, riset terbaru, dan opini pakar seputar ekosistem digital yang sehat.
          </p>
        </motion.div>

        {/* ── Featured article ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <Link href={`/artikel/${featured.id}`}>
            <div className="group relative bg-surface-alt border border-primary-soft/40 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 hover:shadow-lg hover:border-primary-soft transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Hover tint */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top left, rgba(46,125,50,0.06) 0%, transparent 60%)`,
                }}
              />

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${featuredBadge.color}`}
                  >
                    {featuredBadge.label}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {featuredReadTime}
                  </span>
                </div>

                <h3 className="font-bold text-2xl md:text-3xl text-text-dark mb-4 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {featured.judul}
                </h3>
                <p className="text-text-dark text-base leading-relaxed mb-6 flex-1 line-clamp-3">
                  {featuredExcerpt}
                </p>

                <div className="flex items-center justify-between border-t border-primary-soft/30 pt-5">
                  <div>
                    <p className="text-sm font-bold text-text-dark">{featured.penulis}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{featuredDate}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2.5 transition-all duration-200">
                    Baca selengkapnya <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Article grid (sisanya) ── */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.slice(0, 3).map((article, i) => {
              const badge = getBadgeStyle(article.kategori);
              const readTime =
                Math.max(1, Math.ceil((article.isi?.length || 0) / 1000)) + " menit";
              const dateStr = new Date(article.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const excerpt = article.isi
                ? article.isi.length > 100
                  ? article.isi.substring(0, 100) + "..."
                  : article.isi
                : "";

              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                >
                  <Link href={`/artikel/${article.id}`}>
                    <div className="group bg-white border border-slate-200 shadow-sm rounded-2xl hover:shadow-md hover:border-primary-soft transition-all duration-300 p-6 h-full flex flex-col cursor-pointer overflow-hidden relative">
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at top right, rgba(46,125,50,0.04) 0%, transparent 70%)`,
                        }}
                      />

                      <div className="relative z-10 flex items-center justify-between mb-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Clock className="w-3 h-3" /> {readTime}
                        </span>
                      </div>

                      <h3 className="relative z-10 font-bold text-base text-text-dark mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {article.judul}
                      </h3>
                      <p className="relative z-10 text-text-dark text-sm leading-relaxed mb-5 flex-1 line-clamp-2">
                        {excerpt}
                      </p>

                      <div className="relative z-10 border-t border-slate-100 pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-text-dark">{article.penulis}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{dateStr}</p>
                        </div>
                        <div className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary-soft group-hover:bg-surface-alt transition-all">
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-slate-200 bg-white hover:bg-surface text-text-dark font-bold text-sm transition-all duration-300 hover:scale-[1.02] shadow-sm"
          >
            Lihat Semua Artikel
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
