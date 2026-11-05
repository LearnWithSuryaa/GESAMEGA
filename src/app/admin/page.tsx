import { supabase } from "@/lib/supabase";
import {
  Users,
  FileText,
  BarChart3,
  CheckCircle2,
  Database,
  QrCode,
  ArrowRight,
  Activity,
  School,
  ArrowUpRight,
  Calendar,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface RecentQuizItem {
  id: string;
  user_name: string;
  result_category: string;
  created_at: string;
}

interface RecentSurveyItem {
  id: string;
  nama: string;
  created_at: string;
}

export const revalidate = 0;

async function getStats() {
  const [quizRes, surveyRes, recentQuizRes, recentSurveyRes, schoolsRes] =
    await Promise.all([
      supabase.from("quiz_results").select("id, result_category, created_at"),
      supabase.from("survey_results").select("id, created_at"),
      supabase
        .from("quiz_results")
        .select("id, user_name, result_category, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("survey_results")
        .select("id, nama, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase.from("schools").select("id", { count: "exact", head: true }),
    ]);

  const quizRows = quizRes.data || [];
  const surveyRows = surveyRes.data || [];
  const totalQuizzes = quizRows.length;
  const totalSurveys = surveyRows.length;
  const totalSchools = schoolsRes.count || 0;

  const categories: Record<string, number> = {};
  quizRows.forEach((r) => {
    if (r.result_category) {
      categories[r.result_category] = (categories[r.result_category] || 0) + 1;
    }
  });

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const quizzesThisWeek = quizRows.filter(
    (r) => new Date(r.created_at) >= sevenDaysAgo
  ).length;

  const surveysThisWeek = surveyRows.filter(
    (r) => new Date(r.created_at) >= sevenDaysAgo
  ).length;

  const recentQuizzes = (recentQuizRes.data || []).slice(0, 5);
  const recentSurveys = (recentSurveyRes.data || []).slice(0, 5);

  return {
    totalQuizzes,
    totalSurveys,
    totalSchools,
    totalUsers: totalQuizzes + totalSurveys,
    categories,
    quizzesThisWeek,
    surveysThisWeek,
    recentQuizzes,
    recentSurveys,
  };
}

function getInitials(name: string) {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRelativeOrDate(dateStr: string) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Baru saja";
  if (diffInMinutes < 60) return `${diffInMinutes} mnt lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const CATEGORY_CONFIG: Record<
  string,
  { bar: string; badge: string; dot: string; textColor: string }
> = {
  "Sangat Peduli": {
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    dot: "bg-emerald-500",
    textColor: "text-emerald-700",
  },
  "Peduli Sosial": {
    bar: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border border-blue-200/60",
    dot: "bg-blue-500",
    textColor: "text-blue-700",
  },
  "Cukup Peduli": {
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border border-amber-200/60",
    dot: "bg-amber-500",
    textColor: "text-amber-700",
  },
  "Kurang Peduli": {
    bar: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 border border-rose-200/60",
    dot: "bg-rose-500",
    textColor: "text-rose-700",
  },
};

export default async function AdminDashboard() {
  const stats = await getStats();

  const categories = Object.entries(stats.categories).sort(
    ([, a], [, b]) => b - a
  );
  const totalCategoryCount = categories.reduce(
    (sum, [, count]) => sum + count,
    0
  );

  const dominantCategory = categories.length > 0 ? categories[0][0] : null;

  const todayStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 font-sans">
      {/* ── Top Header Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Panel Pengelola Ekosistem
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Ringkasan Platform
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {todayStr}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Database Terhubung
          </div>
          <Link
            href="/peta"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs hover:border-primary-soft transition-all"
          >
            Peta Publik
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── 4 Main Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Partisipasi */}
        <div className="relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-300 group overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Partisipasi
            </span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-transform group-hover:scale-105">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {stats.totalUsers.toLocaleString("id-ID")}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center text-primary font-bold">
              Kuis &amp; Survei
            </span>
            <span>• Seluruh instansi</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-info opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Card 2: Kuis Siswa */}
        <div className="relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-300 group overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Kuis Diselesaikan
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-105">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {stats.totalQuizzes.toLocaleString("id-ID")}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">
              +{stats.quizzesThisWeek} minggu ini
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Card 3: Survei Sekolah */}
        <div className="relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-300 group overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Survei Instansi
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-info transition-transform group-hover:scale-105">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {stats.totalSurveys.toLocaleString("id-ID")}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-700 font-semibold">
            <span className="px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-100">
              +{stats.surveysThisWeek} minggu ini
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-info opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Card 4: Sekolah Terdaftar */}
        <div className="relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-300 group overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Database Sekolah
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 transition-transform group-hover:scale-105">
              <School className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {stats.totalSchools.toLocaleString("id-ID")}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-amber-700">Wilayah Sidoarjo</span>
            <span>• Siap dipetakan</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* ── Mid Section: Kategori Kuis & Quick Actions Hub ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri (8/12): Grafik Distribusi Kategori Kuis */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 md:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center border border-primary-soft/50 text-primary">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Distribusi Refleksi Siswa
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Berdasarkan {totalCategoryCount} responden kuis yang tercatat
                </p>
              </div>
            </div>

            {dominantCategory && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-slate-400 font-normal">Dominan:</span>
                <span className="text-primary font-bold">{dominantCategory}</span>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {categories.map(([category, count]) => {
              const pct =
                totalCategoryCount > 0
                  ? Math.round((count / totalCategoryCount) * 100)
                  : 0;
              const cfg = CATEGORY_CONFIG[category] ?? {
                bar: "bg-blue-500",
                badge: "bg-blue-50 text-blue-700 border border-blue-100",
                dot: "bg-blue-500",
                textColor: "text-blue-700",
              };

              return (
                <div key={category} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                      <span className="text-sm font-semibold text-slate-800">
                        {category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">
                        {count}{" "}
                        <span className="text-slate-400 font-normal">siswa</span>
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 tabular-nums px-2 py-0.5 rounded-md bg-slate-100">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${cfg.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {categories.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">
                  Belum ada data kuis masuk
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan (4/12): Pusat Aksi Cepat (Quick Hub) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Aksi &amp; Generator
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Menu Cepat
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    href: "/admin/qr-generator",
                    icon: QrCode,
                    color: "text-primary bg-primary/10",
                    title: "Generator QR Kuis",
                    desc: "Buat kode QR kuis untuk sekolah",
                  },
                  {
                    href: "/admin/qr-survei",
                    icon: QrCode,
                    color: "text-info bg-blue-50",
                    title: "Generator QR Survei",
                    desc: "Buat kode QR evaluasi instansi",
                  },
                  {
                    href: "/admin/data-kuis",
                    icon: Database,
                    color: "text-emerald-600 bg-emerald-50",
                    title: "Tabel Data Kuis",
                    desc: "Eksplorasi & ekspor hasil kuis siswa",
                  },
                  {
                    href: "/admin/data-survei",
                    icon: FileText,
                    color: "text-amber-600 bg-amber-50",
                    title: "Tabel Data Survei",
                    desc: "Daftar hasil survei instansi",
                  },
                ].map((act) => {
                  const Icon = act.icon;
                  return (
                    <Link
                      key={act.href}
                      href={act.href}
                      className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-primary-soft hover:bg-surface-alt/40 transition-all duration-200"
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${act.color} transition-transform group-hover:scale-105`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {act.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {act.desc}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                href="/peta"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors border border-slate-200"
              >
                Pratinjau Peta Sebaran Publik
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Dual Feed Aktivitas Terkini ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kuis Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Kuis Siswa Terbaru
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    5 pengisian kuis terakhir
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Siswa
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {stats.recentQuizzes.length > 0 ? (
                (stats.recentQuizzes as RecentQuizItem[]).map((quiz) => {
                  const initials = getInitials(quiz.user_name);
                  const cfg = CATEGORY_CONFIG[quiz.result_category];

                  return (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {quiz.user_name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {formatRelativeOrDate(quiz.created_at)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                          cfg?.badge ?? "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {quiz.result_category}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-400 font-medium">
                    Belum ada kuis masuk
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50/60 border-t border-slate-100">
            <Link
              href="/admin/data-kuis"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-light transition-colors"
            >
              Lihat seluruh data kuis
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Survei Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-info border border-blue-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Survei Instansi Terbaru
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    5 pengisian survei terakhir
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Sekolah
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {stats.recentSurveys.length > 0 ? (
                (stats.recentSurveys as RecentSurveyItem[]).map((survey) => {
                  const initials = getInitials(survey.nama);

                  return (
                    <div
                      key={survey.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-info border border-blue-200/50 flex items-center justify-center text-xs font-bold shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {survey.nama}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {formatRelativeOrDate(survey.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-semibold shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Tervalidasi
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-400 font-medium">
                    Belum ada survei masuk
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50/60 border-t border-slate-100">
            <Link
              href="/admin/data-survei"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-info hover:text-blue-700 transition-colors"
            >
              Lihat seluruh data survei
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
