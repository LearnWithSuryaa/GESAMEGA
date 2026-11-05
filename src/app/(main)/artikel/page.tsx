import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ClientArticleList from "@/components/landing/ClientArticleList";
import { ArticleItem, DbArticle } from "@/types/article";

export const revalidate = 3600; // ISR cache for 1 hour

export const metadata: Metadata = {
  title: "Artikel & Edukasi | GESAMEGA",
  description:
    "Wawasan, riset, dan panduan praktis seputar ekosistem pendidikan digital yang sehat untuk komunitas sekolah Indonesia.",
  openGraph: {
    title: "Artikel & Edukasi | GESAMEGA",
    description:
      "Wawasan, riset, dan panduan praktis seputar ekosistem pendidikan digital yang sehat untuk komunitas sekolah Indonesia.",
    type: "website",
  },
};

export default async function ArtikelPage() {
  const { data, error } = await supabase
    .from("articles")
    .select("id, judul, isi, penulis, kategori, thumbnail_url, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  let articles: ArticleItem[] = [];

  if (!error && data && data.length > 0) {
    articles = (data as unknown as DbArticle[]).map((d, index: number) => {
      let badgeColor = "bg-gray-50 text-gray-600 border-gray-200";
      let badge = "Artikel";
      switch (d.kategori) {
        case "literasi":
          badgeColor = "bg-purple-50 text-purple-600 border-purple-200";
          badge = "Edukasi";
          break;
        case "kebijakan":
          badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-200";
          badge = "Panduan Praktis";
          break;
        case "kesehatan":
          badgeColor = "bg-blue-50 text-blue-600 border-blue-200";
          badge = "Riset Terbaru";
          break;
        case "guru":
          badgeColor = "bg-surface-alt text-primary border-primary-soft";
          badge = "Tips & Trik";
          break;
      }

      const dateStr = new Date(d.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return {
        id: d.id,
        slug: d.id,
        category: d.kategori || "all",
        badge,
        badgeColor,
        title: d.judul,
        excerpt: d.isi
          ? d.isi.length > 120
            ? d.isi.substring(0, 120) + "..."
            : d.isi
          : "",
        author: d.penulis,
        authorRole: "Kontributor",
        readTime:
          Math.max(1, Math.ceil((d.isi?.length || 0) / 1000)) + " menit",
        date: dateStr,
        tags: [d.kategori || "umum"],
        featured: index === 0,
        thumbnail:
          d.thumbnail_url ||
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      };
    });
  }

  return <ClientArticleList initialArticles={articles} />;
}
