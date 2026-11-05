import { NextResponse } from "next/server";
import { quizService } from "@/lib/services/quizService";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { success: false, error: "Invalid answers format" },
        { status: 400 },
      );
    }

    // --- Google reCAPTCHA v3 Verification ---
    const ip = request.headers.get("x-forwarded-for") || undefined;
    const captchaResult = await verifyRecaptcha(body.captchaToken || "", ip);
    if (!captchaResult.success) {
      return NextResponse.json(
        { success: false, error: captchaResult.error },
        { status: 403 },
      );
    }

    const result = await quizService.submitQuiz({
      user_name: body.user_name || "Anonim",
      school_id: body.school_id || null,
      answers: body.answers,
      source: body.source,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit quiz";
    console.error("POST /api/submit-quiz error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
