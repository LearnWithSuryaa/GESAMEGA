"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ArticleItem } from "@/types/article";
import {
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Smartphone,
  Brain,
  Shield,
  GraduationCap,
  X,
  ImageIcon,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { label: "Semua", value: "all", icon: Sparkles },
  { label: "Literasi Digital", value: "literasi", icon: Brain },
  { label: "Kebijakan Sekolah", value: "kebijakan", icon: Shield },
  { label: "Kesehatan Digital", value: "kesehatan", icon: Smartphone },
  { label: "Panduan Guru", value: "guru", icon: GraduationCap },
];

/* Badge accent per kategori */
const BADGE_STYLE: Record<
  string,
  { bg: string; border: string; color: string }
> = {
  literasi: {
    bg: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.28)",
    color: "#c084fc",
  },
  kebijakan: {
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.28)",
    color: "#34d399",
  },
  kesehatan: {
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.28)",
    color: "#60a5fa",
  },
  guru: {
    bg: "rgba(46, 125, 50,0.12)",
    border: "rgba(46, 125, 50,0.28)",
    color: "#64B5F6",
  },
  default: {
    bg: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.14)",
    color: "rgba(255,255,255,0.55)",
  },
};

function getBadge(category: string) {
  return BADGE_STYLE[category] ?? BADGE_STYLE.default;
}

export default function ClientArticleList({
  initialArticles,
}: {
  initialArticles: ArticleItem[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = initialArticles.filter((a) => {
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const hero = filtered[0];
  const rest = filtered.slice(1);
  const showHero = activeCategory === "all" && searchQuery === "";

  return (
    <div
      className="min-h-screen pt-24 pb-20 relative overflow-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      {/* ── Ambient Glowing Mesh ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-right warm glow */}
        <div
          className="absolute -top-[8%] right-[-5%] w-187.5 h-187.5 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(46, 125, 50,0.13) 0%, rgba(46, 125, 50,0.04) 50%, transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
        {/* Center amber pulse */}
        <div
          className="absolute top-[30%] left-[30%] w-125 h-125 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 60%)",
            mixBlendMode: "screen",
          }}
        />
        {/* Bottom-left cool accent */}
        <div
          className="absolute bottom-0 left-[-5%] w-125 h-125 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)",
            mixBlendMode: "screen",
          }}
        />
        {/* Subtle warm strip across header */}
        <div
          className="absolute top-0 left-0 right-0 h-80"
          style={{
            background:
              "linear-gradient(180deg, rgba(46, 125, 50,0.06) 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-7 relative z-10">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-4xl overflow-hidden bg-[#90D2ED] px-6 md:px-12 flex flex-col items-center justify-center transform-gpu will-change-transform"
          style={{ paddingTop: "64px", paddingBottom: "120px" }}
        >
          {/* Background Illustration / Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/artikel/9.svg"
              alt="Background Header"
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "100% 8%" }}
            />
          </div>

          <div className="relative z-10 max-w-xl mx-auto text-center w-full">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
              style={{ color: "var(--color-text-dark)" }}
            >
              Artikel &amp;{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Edukasi
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-medium leading-relaxed"
              style={{ color: "var(--color-text-light)" }}
            >
              Wawasan, riset, dan panduan praktis untuk ekosistem pendidikan
              digital yang sehat.
            </motion.p>
          </div>
        </motion.div>

        {/* ── Overlapping Search & Category Filters ── */}
        <div
          className="relative z-20 max-w-4xl mx-auto px-4 mb-16"
          style={{ marginTop: "-112px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/40 backdrop-blur-lg border border-white/40 p-4 md:p-5 rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
          >
            {/* ── Search Bar ── */}
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-gray-200 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 mb-4">
              <Search className="w-5 h-5 shrink-0 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[15px] font-medium placeholder-gray-400"
                style={{ color: "var(--color-text-dark)" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 transition-colors text-gray-400 hover:text-gray-700 p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* ── Category Filters ── */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = activeCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
                    style={
                      active
                        ? {
                            background:
                              "linear-gradient(135deg, #1E88E5, #2E7D32)",
                            color: "white",
                            boxShadow: "0 4px 15px rgba(46, 125, 50,0.25)",
                          }
                        : {
                            background: "#ffffff",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-light)",
                          }
                    }
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
              <span className="ml-2 text-xs font-bold uppercase tracking-widest text-gray-400 hidden md:inline-block">
                {filtered.length} artikel
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Hero Featured Article ── */}
        <AnimatePresence mode="wait">
          {showHero && hero && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4" style={{ color: "#64B5F6" }} />
                <span
                  className="text-xs font-black uppercase tracking-widest"
                  style={{ color: "#64B5F6" }}
                >
                  Terbaru
                </span>
              </div>
              <Link href={`/artikel/${hero.slug}`} className="group block">
                <div
                  className="relative rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-lg"
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {/* top glow strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(46, 125, 50,0.6), transparent)",
                    }}
                  />
                  <div className="grid md:grid-cols-[1fr_380px]">
                    {/* Text */}
                    <div className="p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <HeroBadge
                          category={hero.category}
                          badge={hero.badge}
                        />
                        <h2
                          className="text-2xl md:text-3xl font-extrabold mt-4 mb-4 leading-snug group-hover:text-info-dark transition-colors"
                          style={{
                            letterSpacing: "-0.02em",
                            color: "var(--color-text-dark)",
                          }}
                        >
                          {hero.title}
                        </h2>
                        <p
                          className="text-[15px] leading-relaxed line-clamp-3"
                          style={{ color: "var(--color-text-light)" }}
                        >
                          {hero.excerpt}
                        </p>
                      </div>
                      <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{
                              background:
                                "linear-gradient(135deg,#1E88E5,#2E7D32)",
                              color: "white",
                            }}
                          >
                            {(hero.author || "A")[0].toUpperCase()}
                          </div>
                          <div>
                            <p
                              className="text-[12px] font-semibold"
                              style={{ color: "var(--color-text-dark)" }}
                            >
                              {hero.author}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {hero.date} · {hero.readTime}
                            </p>
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all group-hover:shadow-[0_0_16px_rgba(46, 125, 50,0.3)]"
                          style={{
                            background:
                              "linear-gradient(135deg,#1E88E5,#2E7D32)",
                            color: "white",
                          }}
                        >
                          Baca{" "}
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                    {/* Image */}
                    <div className="relative h-56 md:h-auto overflow-hidden">
                      <Image
                        src={hero.thumbnail}
                        alt={hero.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to right, rgba(5,5,5,0.5) 0%, transparent 50%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Article Grid ── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="font-semibold text-lg text-gray-400 hover:text-gray-600">
                Artikel tidak ditemukan.
              </p>
              <p className="text-sm mt-1 text-gray-400">
                Coba kata kunci lain atau pilih kategori berbeda.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {(showHero ? rest : filtered).map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom CTA ── */}
        {filtered.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-20 relative rounded-4xl overflow-hidden bg-[#90D2ED] px-6 md:px-12 flex flex-col items-center justify-center transform-gpu will-change-transform text-center"
              style={{ paddingTop: "50px", paddingBottom: "20px" }}
            >
              {/* CTA Background Illustration */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                  src="/images/artikel/10.svg"
                  alt="CTA Background"
                  fill
                  sizes="100vw"
                  className="object-cover opacity-90"
                  style={{ objectPosition: "100% 100%" }}
                />
              </div>

              <div className="relative z-10 max-w-xl mx-auto w-full">
                <h3
                  className="text-2xl md:text-3xl font-extrabold mb-2"
                  style={{ color: "var(--color-text-dark)" }}
                >
                  Ikuti Dampak Nyata
                </h3>
                <p
                  className="mb-8 max-w-sm mx-auto text-sm md:text-base font-medium"
                  style={{ color: "var(--color-text-dark)" }}
                >
                  Lihat bagaimana literasi digital membentuk generasi sehat dan
                  cerdas bersama GESAMEGA.
                </p>
                <Link
                  href="/peta"
                  className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-2xl transition-all hover:scale-105"
                  style={{
                    background: "#2E7D32",
                    color: "white",
                    boxShadow: "0 8px 25px rgba(46, 125, 50,0.30)",
                  }}
                >
                  Lihat Peta Partisipasi <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function HeroBadge({ category, badge }: { category: string; badge: string }) {
  const s = getBadge(category);
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
      }}
    >
      {badge}
    </span>
  );
}

function ArticleCard({ article, index }: { article: ArticleItem; index: number }) {
  const badge = getBadge(article.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link href={`/artikel/${article.slug}`} className="group block h-full">
        <div
          className="rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md group-hover:-translate-y-0.75"
          style={{
            background: "#ffffff",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden">
            {article.thumbnail ? (
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <ImageIcon className="w-8 h-8 text-gray-300" />
              </div>
            )}
            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.1) 60%, transparent 100%)",
              }}
            />
            {/* Badge over image */}
            <div className="absolute bottom-3 left-3">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm"
                style={{
                  background: badge.bg,
                  border: `1px solid ${badge.border}`,
                  color: badge.color,
                }}
              >
                {article.badge}
              </span>
            </div>
            {/* Read time */}
            <div className="absolute bottom-3 right-3">
              <span
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm"
                style={{
                  background: "rgba(5,5,5,0.55)",
                  border: "1px solid var(--color-border)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                <Clock className="w-2.5 h-2.5" />
                {article.readTime}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h3
              className="font-extrabold mb-2 leading-snug line-clamp-2 transition-colors group-hover:text-info"
              style={{ fontSize: "15px", color: "var(--color-text-dark)" }}
            >
              {article.title}
            </h3>
            <p
              className="text-[13px] leading-relaxed line-clamp-2 flex-1 mb-4"
              style={{ color: "var(--color-text-light)" }}
            >
              {article.excerpt}
            </p>

            {/* Footer */}
            <div
              className="flex items-center justify-between pt-4"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#1E88E5,#2E7D32)",
                    color: "white",
                  }}
                >
                  {(article.author || "A")[0].toUpperCase()}
                </div>
                <div>
                  <p
                    className="text-[11px] font-semibold leading-none"
                    style={{ color: "var(--color-text-dark)" }}
                  >
                    {article.author}
                  </p>
                  <p
                    className="text-[10px] leading-none mt-0.5"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    {article.date}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 transition-all group-hover:text-info group-hover:translate-x-0.5 text-gray-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
