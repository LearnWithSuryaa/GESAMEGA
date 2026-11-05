import { supabase } from "@/lib/supabase";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { ParticipationFlow } from "@/components/landing/ParticipationFlow";
import { MapPreview } from "@/components/landing/MapPreview";
import { ArticleSection } from "@/components/landing/ArticleSection";

// Fallback numbers to provide immediate context & social proof
const BASE_SCHOOLS = 500;
const BASE_COMMITMENTS = 320;

// ISR: revalidate every 1 hour — keeps stats fresh without serverless call per visitor
export const revalidate = 3600;

async function getLandingData() {
  try {
    const [
      { count: totalSchools },
      { count: totalCommitments },
      { data: caseStudies },
      { data: articles },
    ] = await Promise.all([
      supabase.from("schools").select("*", { count: "exact", head: true }),
      supabase
        .from("schools")
        .select("*", { count: "exact", head: true })
        .eq("status", "komitmen"),
      supabase
        .from("case_studies")
        .select(
          "id, judul, isi, penulis, category, impact, badge, created_at, school_id, schools(nama_sekolah)",
        )
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("articles")
        .select("id, judul, isi, penulis, kategori, thumbnail_url, created_at")
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

    return {
      schools: BASE_SCHOOLS + (totalSchools || 0),
      commitments: BASE_COMMITMENTS + (totalCommitments || 0),
      caseStudies: caseStudies || [],
      articles: articles || [],
    };
  } catch {
    return {
      schools: BASE_SCHOOLS,
      commitments: BASE_COMMITMENTS,
      caseStudies: [],
      articles: [],
    };
  }
}

export default async function Home() {
  const data = await getLandingData();

  return (
    <div className="flex flex-col">
      {/* 1. Hero - Entry Point */}
      <HeroSection />

      {/* 2. Problem - Awareness */}
      <ProblemSection />

      {/* 3. Solution - Platform Value */}
      <SolutionSection />

      {/* 4. Participation Flow - User Journey */}
      <ParticipationFlow />

      {/* 5. Map Preview - Social Proof */}
      <MapPreview />

      {/* 6. Live Statistics - Data Driven */}
      {/*<LiveStatsSection schools={data.schools} commitments={data.commitments} />*/}

      {/* 7. Case Studies - Inspiration */}
      {/*<CaseStudySection caseStudies={data.caseStudies} />*/}

      {/* 8. Articles - Insights */}
      <ArticleSection articles={data.articles} />
    </div>
  );
}
