/**
 * Verifies a Google reCAPTCHA v3 token server-side.
 * Returns { success: boolean; score?: number; error?: string }
 */
export async function verifyRecaptcha(
  token: string,
  remoteip?: string,
): Promise<{ success: boolean; score?: number; error?: string }> {
  if (process.env.NODE_ENV === "development") {
    return { success: true, score: 0.9 };
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY is not set.");
    return { success: false, error: "Konfigurasi server tidak lengkap." };
  }

  const params = new URLSearchParams({ secret, response: token });
  if (remoteip) params.set("remoteip", remoteip);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await res.json();

  if (!data.success || data.score < 0.5) {
    console.warn("reCAPTCHA failed:", data);
    return {
      success: false,
      score: data.score,
      error:
        "Verifikasi keamanan gagal. Aktivitas Anda terdeteksi mencurigakan.",
    };
  }

  return { success: true, score: data.score };
}
