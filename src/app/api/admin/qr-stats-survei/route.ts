import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const [campaignsRes, surveyRes] = await Promise.all([
      supabaseAdmin
        .from("qr_campaigns")
        .select("id, name, source, created_at")
        .ilike("source", "survei-%")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("survey_source_stats")
        .select("source, participant_count")
    ]);

    if (campaignsRes.error) throw campaignsRes.error;
    if (surveyRes.error) throw surveyRes.error;

    // Build a count map from source → number of participants
    const countMap: Record<string, number> = {};
    for (const row of surveyRes.data || []) {
      const source = row.source;
      if (source) {
        countMap[source] = Number(row.participant_count) || 0;
      }
    }

    interface CampaignRow {
      id: string;
      name: string;
      source: string;
      created_at: string;
    }

    const enriched = ((campaignsRes.data || []) as CampaignRow[]).map((campaign) => ({
      ...campaign,
      participantCount: countMap[campaign.source] || 0,
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("[qr-stats-survei GET] error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
