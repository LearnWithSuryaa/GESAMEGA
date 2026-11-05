import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET: Fetch all QR campaigns with participant counts
export async function GET() {
  try {
    // Fetch campaigns & pre-aggregated stats in parallel
    const [campaignsRes, countsRes] = await Promise.all([
      supabaseAdmin
        .from("qr_campaigns")
        .select("id, name, source, created_at")
        .not("source", "ilike", "survei-%")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("quiz_source_stats")
        .select("source, participant_count"),
    ]);

    if (campaignsRes.error) throw campaignsRes.error;
    if (countsRes.error) throw countsRes.error;

    // Build a count map from source → number of participants
    const countMap: Record<string, number> = {};
    for (const row of countsRes.data || []) {
      if (row.source) {
        countMap[row.source] = Number(row.participant_count) || 0;
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
    console.error("[qr-stats GET] error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
