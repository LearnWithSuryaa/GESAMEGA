"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { supabase } from "@/lib/supabase";
import { generateKomitmenPDF } from "@/lib/pdfGenerator";
import { PenTool, Lock, ShieldCheck, AlertTriangle } from "lucide-react";
import { TourGuide } from "@/components/TourGuide";
import { SchoolAutocomplete } from "@/components/SchoolAutocomplete";
import { useRouter } from "next/navigation";
import { submitKomitmen } from "@/app/actions/komitmen";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { motion, AnimatePresence } from "framer-motion";
import { SuccessScreen } from "@/components/komitmen/SuccessScreen";
import { PillarsAccordion } from "@/components/komitmen/PillarsAccordion";
import { PiagamPreview } from "@/components/komitmen/PiagamPreview";
import { SignatureField } from "@/components/komitmen/SignatureField";

const inputStyle = {
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.08)",
  color: "var(--color-text-dark)",
};

const inputClass =
  "w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium placeholder:text-text-dark/40 focus:border-primary/50";

function KomitmenForm() {
  const router = useRouter();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ sekolah: "", penanggungJawab: "" });
  const [selectedSchoolStatus, setSelectedSchoolStatus] = useState<
    string | null
  >(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLocked =
    form.sekolah.length > 0 &&
    selectedSchoolStatus !== "survei" &&
    selectedSchoolStatus !== "komitmen";

  const clearSignature = () => sigCanvas.current?.clear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const ve: Record<string, string> = {};
    if (!form.sekolah) ve.sekolah = "Pilih sekolah yang terdaftar";
    if (!form.penanggungJawab)
      ve.penanggungJawab = "Nama penanggung jawab wajib diisi";
    if (sigCanvas.current?.isEmpty())
      ve.signature = "Harap isi tanda tangan digital";
    if (isLocked)
      ve.locked = "Sekolah harus menyelesaikan survei terlebih dahulu";
    if (Object.keys(ve).length > 0) {
      setErrors(ve);
      return;
    }
    if (!executeRecaptcha) {
      setErrors({ submit: "reCAPTCHA belum siap." });
      return;
    }
    setLoading(true);
    let captchaToken = "";
    try {
      captchaToken = await executeRecaptcha("komitmen_submit");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrors({ submit: `Gagal verifikasi: ${msg}` });
      setLoading(false);
      return;
    }
    try {
      const signatureDataUrl = sigCanvas
        .current!.getTrimmedCanvas()
        .toDataURL("image/png");
      let storageUrl = signatureDataUrl;
      try {
        const blob = await (await fetch(signatureDataUrl)).blob();
        const fileName = `signature_${Date.now()}_${form.sekolah.replace(/[^a-z0-9]/gi, "_")}.png`;
        const { error: se } = await supabase.storage
          .from("signatures")
          .upload(fileName, blob, { contentType: "image/png" });
        if (!se)
          storageUrl = supabase.storage
            .from("signatures")
            .getPublicUrl(fileName).data.publicUrl;
      } catch {}
      const result = await submitKomitmen({
        sekolahId: selectedSchoolId || undefined,
        sekolah: form.sekolah,
        penanggungJawab: form.penanggungJawab,
        signatureUrl: storageUrl,
        captchaToken,
      });
      if (!result.success) {
        setErrors({ submit: result.error || "Terjadi kesalahan" });
        setLoading(false);
        return;
      }
      generateKomitmenPDF(form.sekolah, form.penanggungJawab, signatureDataUrl);
      setSuccess(true);
      setTimeout(
        () =>
          router.push(`/peta?schoolId=${result.schoolId || ""}&from=komitmen`),
        4000,
      );
    } catch {
      setErrors({ submit: "Terjadi kesalahan sistem." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <SuccessScreen sekolah={form.sekolah} />;
  }

  return (
    <div
      className="min-h-screen relative pb-20"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Glowing Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-[5%] right-[5%] w-162.5 h-162.5 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(46, 125, 50,0.10) 0%, transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
        <div
          className="absolute bottom-0 left-[10%] w-100 h-100 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)",
            mixBlendMode: "screen",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-75"
          style={{
            background:
              "linear-gradient(180deg, rgba(46, 125, 50,0.05) 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-28 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex p-4 rounded-3xl mb-5"
            style={{
              background: "rgba(46, 125, 50,0.12)",
              border: "1px solid rgba(46, 125, 50,0.25)",
            }}
          >
            <PenTool className="w-8 h-8" style={{ color: "#64B5F6" }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-dark mb-3 tracking-tight">
            Kontrak Komitmen Bersama
          </h1>
          <p className="text-lg" style={{ color: "rgba(55, 71, 79, 0.6)" }}>
            Tunjukkan dedikasi nyata sekolah Anda melalui penandatanganan
            digital untuk menetapkan regulasi gadget yang lebih sehat.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          {/* Pilar Accordion */}
          <PillarsAccordion />

          {/* Error Banner */}
          {errors.submit && (
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(239,68,68,0.10)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <div className="flex items-center gap-2 font-bold mb-1 text-red-400">
                <AlertTriangle className="w-5 h-5" /> Gagal Mengesahkan
              </div>
              <p className="text-sm text-red-400/80">{errors.submit}</p>
            </div>
          )}

          {/* Main Form Card */}
          <div
            id="tour-komitmen-form"
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Sekolah */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-dark/80">
                  Instansi / Sekolah <span className="text-red-400">*</span>
                </label>
                <SchoolAutocomplete
                  value={form.sekolah}
                  onChange={(val, school) => {
                    setForm((prev) => ({ ...prev, sekolah: val }));
                    setSelectedSchoolStatus(school ? school.status : null);
                    setSelectedSchoolId(school ? school.id : null);
                    if (errors.sekolah)
                      setErrors((prev) => ({ ...prev, sekolah: "" }));
                    if (errors.locked)
                      setErrors((prev) => ({ ...prev, locked: "" }));
                  }}
                  placeholder="Ketik nama sekolah Anda"
                  hasError={!!errors.sekolah || isLocked}
                />
                {errors.sekolah && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertTriangle className="w-3.5 h-3.5" /> {errors.sekolah}
                  </p>
                )}
                <AnimatePresence>
                  {isLocked && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 p-4 rounded-xl"
                      style={{
                        background: "rgba(245,158,11,0.10)",
                        border: "1px solid rgba(245,158,11,0.25)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            background: "rgba(245,158,11,0.15)",
                            color: "#f59e0b",
                          }}
                        >
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <p
                            className="font-bold text-sm mb-1"
                            style={{ color: "#f59e0b" }}
                          >
                            Akses Terkunci
                          </p>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: "rgba(55, 71, 79, 0.6)" }}
                          >
                            Sekolah{" "}
                            <strong className="text-text-dark">
                              &ldquo;{form.sekolah}&rdquo;
                            </strong>{" "}
                            belum menyelesaikan Survei Diagnostik.
                          </p>
                          <button
                            type="button"
                            onClick={() => (window.location.href = "/survei")}
                            className="mt-3 text-sm font-bold px-4 py-2 rounded-lg transition-all"
                            style={{
                              background: "rgba(245,158,11,0.15)",
                              border: "1px solid rgba(245,158,11,0.30)",
                              color: "#f59e0b",
                            }}
                          >
                            Selesaikan Survei (Tahap 1) →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Nama PJ */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-dark/80">
                  Nama Penanggung Jawab <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.penanggungJawab}
                  onChange={(e) => {
                    setForm({ ...form, penanggungJawab: e.target.value });
                    if (errors.penanggungJawab)
                      setErrors((p) => ({ ...p, penanggungJawab: "" }));
                  }}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Cth: Bpk. Budi Santoso, S.Pd (Kepala Sekolah)"
                />
                {errors.penanggungJawab && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertTriangle className="w-3.5 h-3.5" />{" "}
                    {errors.penanggungJawab}
                  </p>
                )}
              </div>

              {/* Piagam Preview */}
              <PiagamPreview sekolah={form.sekolah} />

              {/* Signature */}
              <SignatureField
                ref={sigCanvas}
                isLocked={isLocked}
                error={errors.signature}
                onBegin={() => {
                  if (errors.signature)
                    setErrors((p) => ({ ...p, signature: "" }));
                }}
                onClear={clearSignature}
              />

              {/* reCAPTCHA note */}
              <div
                className="pt-4"
                style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
              >
                <div
                  className="flex items-center gap-3 text-xs font-medium"
                  style={{ color: "rgba(55, 71, 79, 0.4)" }}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500/60" />
                  <span>
                    Formulir ini dilindungi oleh{" "}
                    <span className="text-text-dark/60 font-bold">
                      Google reCAPTCHA v3
                    </span>
                    . Verifikasi berjalan otomatis.
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || isLocked || form.sekolah.length === 0}
                className="w-full py-5 rounded-2xl font-bold text-white text-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={
                  loading || isLocked || !form.sekolah
                    ? { background: "#ffffff", color: "rgba(55, 71, 79, 0.5)" }
                    : {
                        background: "linear-gradient(135deg, #2E7D32, #66BB6A)",
                        boxShadow: "0 0 32px rgba(46, 125, 50,0.35)",
                      }
                }
              >
                {loading
                  ? "Memproses Dokumen PDF & Menyimpan..."
                  : "Sahkan & Unduh Sertifikat PDF Resmi"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      <TourGuide
        pageName="Komitmen"
        steps={[
          {
            element: "#tour-journey-bar",
            popover: {
              title: "Tahap Akhir",
              description:
                "Anda berada di tahap ke-3 (terakhir) untuk meresmikan partisipasi sekolah.",
            },
          },
          {
            element: "#tour-komitmen-pilar",
            popover: {
              title: "Pilar Ekosistem",
              description:
                "Klik untuk membaca dan menyepakati 5 prinsip dasar penggunaan gadget yang sehat.",
            },
          },
          {
            element: "#tour-komitmen-form",
            popover: {
              title: "Legalitas",
              description:
                "Isi dengan cermat identitas instansi dan Penanggung Jawab sekolah Anda.",
            },
          },
          {
            element: "#tour-komitmen-signature",
            popover: {
              title: "Tanda Tangan",
              description:
                "Torehkan tanda tangan Anda secara digital di sini sebagai bukti pengesahan.",
            },
          },
        ]}
      />
    </div>
  );
}

export default function KomitmenPage() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      language="id"
    >
      <KomitmenForm />
    </GoogleReCaptchaProvider>
  );
}
