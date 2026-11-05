"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function submitSurvey(data: {
  nama: string;
  namaSekolah: string;
  wilayah: string;
  jawaban: Record<string, unknown>;
  captchaToken: string;
  source?: string;
}) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown_ip";

    // --- Google reCAPTCHA v3 Verification ---
    const captchaResult = await verifyRecaptcha(data.captchaToken, ip);
    if (!captchaResult.success) {
      return { success: false, error: captchaResult.error };
    }

    // Rate Limiting Logic (Simplified IP check)
    // We check how many submissions today from this IP
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: rateLimitCount } = await supabase
      .from("schools")
      .select("id", { count: "exact" })
      .eq("ip_address", ip)
      .gte("submit_timestamp", today.toISOString());

    if (rateLimitCount !== null && rateLimitCount >= 3) {
      return {
        success: false,
        error: "Batas pengiriman harian terlampaui. Coba lagi besok.",
      };
    }

    // 1. Cek apakah sekolah sudah terdaftar (Berdasarkan Nama Sekolah)
    const { data: existingSchools, error: lookupError } = await supabase
      .from("schools")
      .select("id, status, wilayah")
      .eq("nama_sekolah", data.namaSekolah);

    if (lookupError) {
      console.error("Supabase Lookup Error:", lookupError);
      return {
        success: false,
        error:
          "Gagal memverifikasi sekolah di database.(" +
          lookupError.message +
          ")",
      };
    }

    if (!existingSchools || existingSchools.length === 0) {
      return {
        success: false,
        error:
          "Sekolah belum terdaftar di sistem. Survei hanya dapat diisi oleh sekolah yang sudah terdaftar.",
      };
    }

    // Jika ada lebih dari satu sekolah dengan nama sama, prioritas yang wilayahnya sama (jika ada), kalau tidak pilih yang pertama.
    let school = existingSchools[0];
    const matchRegion = existingSchools.find((s) => s.wilayah === data.wilayah);
    if (matchRegion) {
      school = matchRegion;
    }

    const finalSchoolId = school.id;

    // 2. Insert to survey_results karena sekolah valid
    const { error: surveyError } = await supabase
      .from("survey_results")
      .insert({
        school_id: finalSchoolId,
        nama: data.nama || "Anonim",
        jawaban: data.jawaban,
        source: data.source || null,
      });

    if (surveyError) throw surveyError;

    // 3. Update status sekolah (Hanya update jika status saat ini 'belum')
    if (school.status === "belum") {
      await supabase
        .from("schools")
        .update({
          status: "survei",
          status_validasi: "pending",
          pengirim_nama: data.nama || "Anonim",
          wilayah: school.wilayah || data.wilayah, // mengisi wilayah jika sebelumnya kosong
          ip_address: ip,
          submit_timestamp: new Date().toISOString(),
        })
        .eq("id", school.id);
    } else {
      // Jika status sudah 'survei' atau 'komitmen', kita hanya update timestamp tracking
      await supabase
        .from("schools")
        .update({
          wilayah: school.wilayah || data.wilayah,
          ip_address: ip,
          submit_timestamp: new Date().toISOString(),
        })
        .eq("id", school.id);
    }

    // Invalidate peta page cache so new survei marker appears immediately
    revalidatePath("/peta");

    return { success: true, schoolId: finalSchoolId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    console.error("Server Action Error:", error);
    return { success: false, error: message };
  }
}
