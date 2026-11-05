"use client";

import { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { generatePiagamPDF } from "@/lib/pdfGenerator";

export function PiagamPreview({ sekolah }: { sekolah: string }) {
  const [downloadingPiagam, setDownloadingPiagam] = useState(false);

  return (
    <div className="space-y-3" id="tour-komitmen-preview">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-text-dark/80">
          Pratinjau Piagam Apresiasi
        </label>
        <span className="text-xs text-text-dark/40">Otomatis</span>
      </div>
      <div
        className="relative w-full aspect-[1.414] rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.08)" }}
      >
        <Image
          src="/assets/Piagam-GESAMEGA.jpg"
          alt="Template Piagam"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 z-10 pointer-events-none">
          {(() => {
            const sekolahText = sekolah || "INSTANSI / SEKOLAH";
            const words = sekolahText.trim().split(/\s+/);
            const isMulti = words.length > 3;
            return (
              <div
                className={`absolute ${isMulti ? "top-[61%]" : "top-[64%]"} left-0 right-0 text-center px-20`}
              >
                <h3 className="font-serif font-bold text-text-dark uppercase tracking-[0.05em] leading-[0.9]">
                  <span className="block text-[14px] sm:text-[16px] md:text-[20px] lg:text-[26px]">
                    {isMulti ? words.slice(0, 3).join(" ") : sekolahText}
                  </span>
                  {isMulti && (
                    <span className="block text-[14px] sm:text-[16px] md:text-[20px] lg:text-[26px] mt-0.5">
                      {words.slice(3).join(" ")}
                    </span>
                  )}
                </h3>
              </div>
            );
          })()}
          <div className="absolute top-[77%] left-3 right-0 text-center px-8">
            <p className="text-[8px] sm:text-[10px] md:text-[12px] font-serif font-bold text-text-dark uppercase tracking-[0.08em]">
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        disabled={!sekolah || downloadingPiagam}
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!sekolah) return;
          setDownloadingPiagam(true);
          try {
            await generatePiagamPDF(sekolah);
          } catch (err: unknown) {
            console.error("Error generating Piagam:", err);
            alert("Gagal mengunduh Piagam. Silakan periksa koneksi atau hubungi admin.");
          } finally {
            setDownloadingPiagam(false);
          }
        }}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: "rgba(46, 125, 50,0.10)",
          border: "1px solid rgba(46, 125, 50,0.22)",
          color: "#64B5F6",
        }}
      >
        <Download className="w-4 h-4" />
        {downloadingPiagam
          ? "Memproses Piagam..."
          : "Unduh Piagam Apresiasi (.pdf)"}
      </button>
    </div>
  );
}
