import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// POST: Create a new QR campaign
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, source } = body;

    if (!name || !source) {
      return NextResponse.json(
        { success: false, error: "Name and source are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("qr_campaigns")
      .insert({ name, source })
      .select()
      .single();

    if (error) {
      console.error("[qr-campaigns POST] Supabase error:", JSON.stringify(error));
      return NextResponse.json(
        { success: false, error: error.message, code: error.code, details: error.details },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("[qr-campaigns POST] Unexpected error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE: Delete a QR campaign by id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("qr_campaigns").delete().eq("id", id);
    if (error) {
      console.error("[qr-campaigns DELETE] Supabase error:", JSON.stringify(error));
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("[qr-campaigns DELETE] Unexpected error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

