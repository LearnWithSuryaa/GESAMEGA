"use client";

import nextDynamic from "next/dynamic";
import type { DriveStep } from "driver.js";
import {
  MapPin,
  ArrowRight,
  ClipboardList,
  Building,
  Users,
  PieChart,
  Calendar,
  Globe,
  ShieldCheck,
  CheckCircle2,
  RotateCw,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { TourGuide } from "@/components/TourGuide";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const PetaMap = nextDynamic(() => import("@/components/PetaMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-50/50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">
          Memuat Peta Nusantara…
        </span>
      </div>
    </div>
  ),
});

interface School {
  id: string;
  nama_sekolah: string;
  latitude: number;
  longitude: number;
  status: string;
  status_validasi: string;
}

interface PetaClientProps {
  schools: School[];
  counts: { total: number; komitmen: number; survei: number };
}

function PetaContent({ schools }: { schools: School[] }) {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolId");
  return <PetaMap schoolId={schoolId || undefined} schools={schools} />;
}

export function PetaClient({ schools, counts }: PetaClientProps) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const komitmenPct =
    counts.total > 0 ? Math.round((counts.komitmen / counts.total) * 100) : 0;

  const totalSurveiSelesai = counts.survei + counts.komitmen;

  const belumIkutCount = Math.max(
    0,
    counts.total - counts.komitmen - counts.survei,
  );

  const tourSteps: DriveStep[] = [
    {
      element: "#tour-header",
      popover: {
        title: "Peta Partisipasi",
        description:
          "Selamat datang! Di sini Anda dapat melihat komitmen pemanfaatan gadget sehat dari sekolah-sekolah di Nusantara.",
      },
    },
    {
      element: "#tour-stats",
      popover: {
        title: "Ringkasan Data",
        description:
          "Pantau angka total pendaftar, sekolah yang telah berkomitmen, dan yang sudah survei secara real-time.",
      },
    },
    {
      element: "#tour-map",
      popover: {
        title: "Peta Interaktif",
        description:
          "Jelajahi peta ini untuk melihat sebaran titik sekolah berdasarkan status partisipasi mereka.",
      },
    },
    {
      element: "#tour-indicator",
      popover: {
        title: "Indikator Status",
        description:
          "Rincian kalkulasi status sekolah beserta informasi waktu pembaruan data terakhir.",
      },
    },
    {
      element: "#tour-bottom-info",
      popover: {
        title: "Informasi Sistem",
        description:
          "Detail mengenai jadwal pembaruan data, cakupan wilayah, dan status operasional sistem saat ini.",
      },
    },
  ];

  if (from === "survei" || from === "komitmen") {
    tourSteps.unshift({
      element: "#tour-journey-bar",
      popover: {
        title: "Jejak Langkah",
        description:
          "Lihat dimana Anda berada dari keseluruhan 3 langkah partisipasi ekosistem.",
      },
    });
  }

  if (from === "survei") {
    tourSteps.push({
      element: "#tour-peta-cta",
      popover: {
        title: "Langkah Terakhir",
        description:
          "Setelah melihat Peta, klik tombol di sini untuk melegalkan pengesahan komitmen.",
      },
    });
  }

  // Get current date string
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDate = today.toLocaleDateString("id-ID", dateOptions);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-16">
        {/* Success alert */}
        {(from === "survei" || from === "komitmen") && (
          <div className="max-w-2xl mx-auto mb-8 flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-black bg-emerald-100 text-emerald-600">
              ✓
            </div>
            <p className="text-sm font-medium text-emerald-800">
              {from === "survei"
                ? "Data survei berhasil disimpan. Posisi sekolah Anda kini terlihat di peta."
                : "Sertifikat berhasil disahkan. Sekolah Anda resmi berstatus komitmen."}
            </p>
          </div>
        )}

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          id="tour-header"
          className="mb-0 relative rounded-3xl overflow-hidden bg-linear-to-r from-blue-50 to-blue-100/50 border border-blue-100/50 pt-10 pb-28 px-8 md:px-12 flex flex-col md:flex-row items-center justify-between transform-gpu will-change-transform"
        >
          {/* Background Illustration / Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/peta/7.svg"
              alt="Background Header"
              fill
              className="object-cover"
              style={{ objectPosition: "120% 20%" }}
              priority
            />
          </div>

          <div className="relative z-10 max-w-lg">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight text-slate-900 mb-3">
              Peta Partisipasi <br />
              <span className="text-emerald-600">Sekolah Nasional</span>
            </h1>
            <p className="text-slate-800 font-medium text-base md:text-lg leading-relaxed mt-3 max-w-sm md:max-w-md">
              Lihat distribusi komitmen pemanfaatan gadget sehat dari sekolah di
              seluruh Kota Sidoarjo.
            </p>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div
          id="tour-stats"
          className="relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 -mt-16 px-4 md:px-6"
        >
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 shrink-0">
              <Building className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">
                {counts.total}
              </div>
              <div className="text-sm font-semibold text-slate-700">
                Total Sekolah
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-0.5">
                Terdaftar dalam sistem
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">
                {counts.komitmen}
              </div>
              <div className="text-sm font-semibold text-slate-700">
                Komitmen
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-0.5">
                Sekolah berkomitmen
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 shrink-0">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">
                {totalSurveiSelesai}
              </div>
              <div className="text-sm font-semibold text-slate-700">
                Sudah Survei
              </div>
              <div className="text-xs text-blue-600 font-medium mt-0.5">
                Total yang berpartisipasi mengisi survei
              </div>
            </div>
          </div>
          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500 shrink-0">
              <PieChart className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">
                {komitmenPct}%
              </div>
              <div className="text-sm font-semibold text-slate-700">
                Rasio Komitmen
              </div>
              <div className="text-xs text-blue-500 font-medium mt-0.5">
                Dari total sekolah
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content (Map & Indicator) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Map Area */}
          <div
            id="tour-map"
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-800">
                Peta Sebaran Sekolah
              </h2>
            </div>
            <div className="relative flex-1" style={{ minHeight: "550px" }}>
              <style>{`
                  .peta-leaflet-wrap,
                  .peta-leaflet-wrap .leaflet-container {
                    position: absolute !important;
                    inset: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    background: #eef2f6 !important;
                  }
                `}</style>
              <div className="peta-leaflet-wrap">
                <Suspense
                  fallback={
                    <div className="w-full h-full animate-pulse bg-slate-50" />
                  }
                >
                  <PetaContent schools={schools} />
                </Suspense>
              </div>

              {/* Mini Legend inside Map */}
              <div className="absolute bottom-6 left-6 z-400 bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 py-3 px-5 flex flex-wrap gap-5">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">
                    Komitmen
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-500 fill-blue-500" />
                  <span className="text-xs font-semibold text-slate-700">
                    Sudah Survei
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-500 fill-slate-500" />
                  <span className="text-xs font-semibold text-slate-700">
                    Belum Ikut
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Indicator Sidebar */}
          <div
            id="tour-indicator"
            className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              Indikator Status
            </h2>

            <div className="space-y-3 mb-8">
              {/* Komitmen Row */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100/50">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-slate-800 text-sm">
                    Komitmen
                  </span>
                </div>
                <span className="text-emerald-700 font-bold text-sm">
                  {counts.komitmen} Sekolah
                </span>
              </div>

              {/* Sudah Survei Row */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-slate-800 text-sm">
                    Sudah Survei
                  </span>
                </div>
                <span className="text-blue-700 font-bold text-sm">
                  {totalSurveiSelesai} Sekolah
                </span>
              </div>

              {/* Belum Ikut Row */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-500" />
                  <span className="font-semibold text-slate-800 text-sm">
                    Belum Ikut
                  </span>
                </div>
                <span className="text-slate-600 font-bold text-sm">
                  {belumIkutCount} Sekolah
                </span>
              </div>
            </div>

            <hr className="border-slate-100 mb-6" />

            <div className="space-y-5 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">
                  Total Terdaftar
                </span>
                <span className="font-bold text-slate-900">
                  {counts.total} Sekolah
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Berkomitmen</span>
                <span className="font-bold text-slate-900">
                  {counts.komitmen} Sekolah
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">
                  Rasio Komitmen
                </span>
                <span className="font-bold text-slate-900">{komitmenPct}%</span>
              </div>
            </div>

            <div className="mt-auto bg-emerald-50/70 rounded-xl p-5 flex items-start gap-4 border border-emerald-100">
              <RotateCw className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-sm text-emerald-800 mb-1">
                  Data diperbarui setiap hari
                </div>
                <div className="text-xs text-emerald-600/80 font-medium">
                  Terakhir update: {formattedDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Info Strip ── */}
        <div
          id="tour-bottom-info"
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex flex-col md:flex-row relative overflow-hidden"
        >
          <div className="flex-1 flex items-center gap-5 py-5 px-6 border-b md:border-b-0 md:border-r border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold mb-1">
                Data Diperbarui
              </div>
              <div className="font-bold text-slate-900 text-base">
                Setiap hari
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Informasi selalu up to date
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-5 py-5 px-6 border-b md:border-b-0 md:border-r border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold mb-1">
                Cakupan Wilayah
              </div>
              <div className="font-bold text-slate-900 text-base">
                Seluruh Indonesia
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                34 Provinsi • 514 Kabupaten/Kota
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-5 py-5 px-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold mb-1">
                Status Sistem
              </div>
              <div className="font-bold text-emerald-600 text-base">
                Operasional
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Sistem berjalan dengan baik
              </div>
            </div>
          </div>

          {/* Optional background illustration */}
          <div className="hidden lg:block absolute right-0 bottom-0 pointer-events-none">
            <Image
              src="/images/peta/8.svg"
              alt="Footer Illustration"
              width={600}
              height={600}
              className="object-contain"
            />
          </div>
        </div>

        {/* CTA strip — from=survei */}
        {from === "survei" && (
          <div
            id="tour-peta-cta"
            className="mt-6 relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm"
          >
            {/* Primary accent left bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b from-primary to-info" />
            {/* Glow */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full blur-2xl opacity-10 bg-primary" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pl-8 pr-6 py-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-primary">
                  Langkah Berikutnya
                </p>
                <h3 className="text-lg font-black text-slate-900 mb-1">
                  Sudah melihat posisi sekolah Anda?
                </h3>
                <p className="text-slate-600 text-sm font-medium">
                  Langkah selanjutnya adalah mengesahkan komitmen digital.
                </p>
              </div>
              <Link
                href="/komitmen"
                className="group shrink-0 w-full md:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 bg-gradient-to-r from-primary to-info hover:from-primary hover:to-info/90 shadow-md shadow-primary/20"
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = "scale(1)";
                }}
              >
                Lanjut ke Komitmen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <TourGuide pageName="Peta" steps={tourSteps} />
    </div>
  );
}
