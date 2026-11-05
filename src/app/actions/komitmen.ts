"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function submitKomitmen(data: {
  sekolahId?: string;
  sekolah: string;
  penanggungJawab: string;
  signatureUrl: string;
  captchaToken: string;
}) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown_ip";

    // --- Google reCAPTCHA v3 Verification ---
    const captchaResult = await verifyRecaptcha(data.captchaToken, ip);
    if (!captchaResult.success) {
      return { success: false, error: captchaResult.error };
    }

    // 1. Insert to commitments table
    const { error: dbError } = await supabase.from("commitments").insert({
      school_id: data.sekolahId,
      penanggung_jawab: data.penanggungJawab,
      signature_url: data.signatureUrl
    });
    
    if (dbError) throw dbError;

    // 2. Update schools table status
    let matchQuery = supabase.from("schools").update({ 
      status: "komitmen",
      status_validasi: "valid", // Promote to valid!
    });

    if (data.sekolahId) {
       matchQuery = matchQuery.eq("id", data.sekolahId);
    } else {
       matchQuery = matchQuery.eq("nama_sekolah", data.sekolah);
    }

    const { data: updatedSchool, error: updateError } = await matchQuery.select();

    if (updateError) throw updateError;

    // Invalidate peta page cache so new komitmen marker appears immediately
    revalidatePath("/peta");

    return { success: true, schoolId: updatedSchool?.[0]?.id || data.sekolahId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    console.error("Server Action Komitmen Error:", error);
    return { success: false, error: message };
  }
}
