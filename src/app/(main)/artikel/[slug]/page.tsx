import { Metadata } from "next";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Clock, Calendar, ImageIcon, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButtons from "./ShareButtons";
import ReadingProgressBar from "./ReadingProgressBar";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: article } = await supabase
    .from("articles")
    .select("judul, isi, thumbnail_url, kategori")
    .eq("id", resolvedParams.slug)
    .single();

  if (!article) return { title: "Artikel Tidak Ditemukan" };

  const description = article.isi.substring(0, 160) + "...";
  const ogImage =
    article.thumbnail_url ||
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";

  return {
    title: `${article.judul} | GESAMEGA`,
    description,
    openGraph: {
      title: article.judul,
      description,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.judul }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.judul,
      description,
      images: [ogImage],
    },
  };
}

export default async function ArtikelDetail({ params }: Props) {
  const resolvedParams = await params;

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", resolvedParams.slug)
    .single();

  if (error || !article) notFound();

  const { data: related } = await supabase
    .from("articles")
    .select("id, judul, created_at, thumbnail_url, kategori")
    .neq("id", resolvedParams.slug)
    .limit(4);

  const relatedBlogs = related || [];

  const dateStr = new Date(article.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const wordCount = (article.isi?.split(/\s+/) || []).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " menit baca";

  const paragraphs = article.isi
    .split("\n")
    .filter((p: string) => p.trim() !== "");

  return (
    <div className="min-h-screen relative bg-surface">
      {/* Sticky Reading Progress */}
      <ReadingProgressBar />

      {/* ── Glowing Mesh ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-175 h-175 bg-primary-soft/40 rounded-full blur-[140px] mix-blend-multiply pointer-events-none transform-gpu" />
        <div className="absolute bottom-[10%] left-[-5%] w-125 h-125 bg-emerald-100/40 rounded-full blur-[130px] mix-blend-multiply pointer-events-none transform-gpu" />
      </div>

      {/* ── Hero ── */}
      <div className="relative w-full h-[55vh] min-h-95 max-h-150 overflow-hidden">
        {/* Image */}
        <Image
          src={
            article.thumbnail_url ||
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
          }
          alt={article.judul}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-surface/60 to-surface" />
        {/* Category badge over image */}
        <div className="absolute top-28 left-0 right-0 z-10 max-w-195 mx-auto px-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-surface-alt border border-primary-soft text-primary shadow-sm">
            <Tag className="w-3 h-3" />
            {article.kategori || "Umum"}
          </span>
        </div>
        {/* Title over image */}
        <div className="absolute bottom-0 left-0 right-0 z-10 max-w-195 mx-auto px-6 pb-10">
          <h1
            className="text-3xl md:text-[42px] lg:text-[48px] font-bold leading-[1.1] tracking-tight text-text-dark"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {article.judul}
          </h1>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="relative z-10 max-w-275 mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">

        {/* ── Meta bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-8 border-b border-slate-200">
          {/* Back + author */}
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/artikel"
              className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest transition-colors text-slate-500 hover:text-info"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Artikel
            </Link>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-2">
              {/* Author avatar placeholder */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-linear-to-br from-info to-primary text-white">
                {(article.penulis || "A")[0].toUpperCase()}
              </div>
              <span className="text-[12px] font-medium text-slate-600">
                {article.penulis}
              </span>
            </div>
          </div>
          {/* Date + readtime */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Calendar className="w-3 h-3" />
              {dateStr}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-surface-alt border border-primary-soft text-primary font-medium">
              <Clock className="w-3 h-3" />
              {readTime}
            </span>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14">

          {/* ── Article Body ── */}
          <article>
            {/* Lead paragraph */}
            {paragraphs.length > 0 && (
              <p
                className="text-[18px] md:text-[19px] leading-[1.80] mb-8 pl-5 text-slate-600 border-l-2 border-primary"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontWeight: 300,
                  fontStyle: "italic",
                }}
              >
                {paragraphs[0]}
              </p>
            )}

            {/* Body */}
            <div className="space-y-0">
              {paragraphs.slice(1).map((p: string, idx: number) => {
                const isHeading = p.length < 80 && !p.endsWith(".") && !p.endsWith(",");

                if (isHeading) {
                  return (
                    <h2
                      key={idx}
                      className="text-[22px] md:text-[24px] font-semibold mt-12 mb-5 leading-snug text-text-dark"
                      style={{
                        fontFamily: "'Georgia', serif",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {p}
                    </h2>
                  );
                }

                return (
                  <p
                    key={idx}
                    className="text-[16px] md:text-[17px] leading-[1.85] mb-6 text-slate-700"
                  >
                    {p}
                  </p>
                );
              })}
            </div>

            {/* ── Article Footer ── */}
            <div className="mt-14 pt-10 border-t border-slate-200">
              {/* Tags row */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-[10px] font-bold uppercase tracking-widest mr-2 text-slate-400">
                  Tag
                </span>
                {[article.kategori || "Umum"].map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold capitalize bg-white border border-slate-200 text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author card */}
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shrink-0 bg-linear-to-br from-info to-primary text-white">
                  {(article.penulis || "A")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-bold mb-1 text-text-dark">
                    {article.penulis}
                  </p>
                  <p className="text-[12px] leading-relaxed text-slate-500">
                    Kontributor di GESAMEGA — platform riset ekosistem pendidikan digital nasional.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* ── Sticky Sidebar ── */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-6">
            {/* Share */}
            <ShareButtons title={article.judul} />

            {/* Divider */}
            <div className="h-px bg-slate-200" />

            {/* Stats card */}
            <div className="rounded-2xl p-5 space-y-4 bg-white border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Info Artikel
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-500">Penulis</span>
                  <span className="text-[12px] font-semibold text-slate-700">{article.penulis}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-500">Diterbitkan</span>
                  <span className="text-[12px] font-semibold text-slate-700">{dateStr}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-500">Estimasi baca</span>
                  <span className="text-[12px] font-semibold text-info">{readTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-500">Kategori</span>
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-alt border border-primary-soft text-primary">
                    {article.kategori || "Umum"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-200" />

            {/* Related articles */}
            {relatedBlogs.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-4 text-slate-400">
                  Artikel Terkait
                </p>
                <div className="flex flex-col gap-1">
                  {relatedBlogs.map((blog, i) => (
                    <Link
                      href={`/artikel/${blog.id}`}
                      key={i}
                      className="flex gap-3 items-start p-2.5 rounded-xl transition-all group hover:bg-slate-50"
                    >
                      {/* Thumbnail */}
                      <div className="w-17 h-12.5 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        {blog.thumbnail_url ? (
                          <Image
                            src={blog.thumbnail_url}
                            alt={blog.judul}
                            width={68}
                            height={50}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100">
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] mb-0.5 text-slate-500">
                          {blog.kategori || "Umum"}
                        </p>
                        <h4 className="text-[12px] font-normal leading-snug line-clamp-2 transition-colors group-hover:text-info text-slate-700">
                          {blog.judul}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA back to all */}
            <Link
              href="/artikel"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[12px] font-semibold transition-all hover:bg-slate-50 bg-white border border-slate-200 text-slate-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Semua Artikel
            </Link>
          </aside>
        </div>

        {/* ── More Articles (bottom) ── */}
        {relatedBlogs.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-slate-200" />
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Baca Juga
              </p>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedBlogs.map((blog, i) => (
                <Link href={`/artikel/${blog.id}`} key={i} className="group">
                  <div className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 bg-white border border-slate-200 shadow-sm hover:shadow-md">
                    <div className="aspect-video relative overflow-hidden">
                      {blog.thumbnail_url ? (
                        <Image
                          src={blog.thumbnail_url}
                          alt={blog.judul}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-info">
                        {blog.kategori || "Umum"}
                      </p>
                      <h3 className="text-[13px] font-medium leading-snug line-clamp-2 transition-colors group-hover:text-primary text-text-dark">
                        {blog.judul}
                      </h3>
                      <p className="text-[11px] mt-2 text-slate-500">
                        {new Date(blog.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
