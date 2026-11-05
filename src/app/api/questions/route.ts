import { NextResponse } from "next/server";
import { quizService } from "@/lib/services/quizService";

// Cache via CDN header — questions rarely change, served from Edge for 1h

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const questions = await quizService.getQuestions(category || undefined);

    return NextResponse.json(
      { success: true, data: questions },
      {
        headers: {
          // Cache on CDN for 1h, serve stale for another 1h while revalidating
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
        },
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch questions";
    console.error("GET /api/questions error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
