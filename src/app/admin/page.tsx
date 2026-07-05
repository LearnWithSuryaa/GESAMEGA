import { supabase } from "@/lib/supabase";
import {
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Database,
  QrCode,
  ArrowRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

async function getStats() {
  const [quizRes, surveyRes, recentQuizRes, recentSurveyRes] =
    await Promise.all([
      supabase.from("quiz_results").select("id, result_category, created_at"),
      supabase
        .from("survey_results")
        .select("id, created_at", { count: "exact" }),
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
    ]);

  const quizRows = quizRes.data || [];
  const totalQuizzes = quizRows.length;
  const totalSurveys = surveyRes.count || 0;

  const categories: Record<string, number> = {};
  quizRows.forEach((r) => {
    categories[r.result_category] = (categories[r.result_category] || 0) + 1;
  });

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const quizzesThisWeek = quizRows.filter(
    (r) => new Date(r.created_at) >= sevenDaysAgo
  ).length;

  const recentQuizzes = (recentQuizRes.data || []).slice(0, 5);
  const recentSurveys = (recentSurveyRes.data || []).slice(0, 5);

  return {
    totalQuizzes,
    totalSurveys,
    totalUsers: totalQuizzes + totalSurveys,
    categories,
    quizzesThisWeek,
    recentQuizzes,
    recentSurveys,
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CATEGORY_CONFIG: Record<
  string,
  { bar: string; badge: string; badgeText: string; dot: string }
> = {
  "Sangat Peduli": {
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    badgeText: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  "Peduli Sosial": {
    bar: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border border-blue-100",
    badgeText: "text-blue-700",
    dot: "bg-blue-500",
  },
  "Cukup Peduli": {
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border border-amber-100",
    badgeText: "text-amber-700",
    dot: "bg-amber-500",
  },
  "Kurang Peduli": {
    bar: "bg-red-500",
    badge: "bg-red-50 text-red-700 border border-red-100",
    badgeText: "text-red-700",
    dot: "bg-red-500",
  },
};

const AVATAR_COLORS = [
  { bg: "bg-blue-50", text: "text-blue-700" },
  { bg: "bg-emerald-50", text: "text-emerald-700" },
  { bg: "bg-orange-50", text: "text-orange-700" },
  { bg: "bg-purple-50", text: "text-purple-700" },
  { bg: "bg-amber-50", text: "text-amber-700" },
];

export default async function AdminDashboard() {
  const stats = await getStats();

  const categories = Object.entries(stats.categories).sort(
    ([, a], [, b]) => b - a
  );
  const totalCategoryCount = categories.reduce(
    (sum, [, count]) => sum + count,
    0
  );

  return (
    <div className="min-h-screen bg-[#F7F6F3] p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 leading-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-normal">
            Pantau aktivitas &amp; metrik platform secara real-time
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live · Aktif
        </div>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          {
            label: "Total Partisipasi",
            value: stats.totalUsers,
            icon: Users,
            iconClass: "text-blue-600",
            iconBg: "bg-blue-50",
            foot: "Semua waktu",
          },
          {
            label: "Kuis Diselesaikan",
            value: stats.totalQuizzes,
            icon: CheckCircle2,
            iconClass: "text-orange-600",
            iconBg: "bg-orange-50",
            foot: "+12% minggu ini",
            footClass: "text-emerald-600",
          },
          {
            label: "Survei Diselesaikan",
            value: stats.totalSurveys,
            icon: FileText,
            iconClass: "text-emerald-600",
            iconBg: "bg-emerald-50",
            foot: "+8% minggu ini",
            footClass: "text-emerald-600",
          },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-black/[0.07] p-5 shadow-sm"
            >
              <div
                className={`w-9 h-9 ${s.iconBg} rounded-lg flex items-center justify-center mb-4`}
              >
                <Icon className={`w-4 h-4 ${s.iconClass}`} />
              </div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1">
                {s.label}
              </p>
              <p className="text-4xl font-semibold text-gray-900 tabular-nums leading-none tracking-tight">
                {s.value.toLocaleString("id-ID")}
              </p>
              <p
                className={`text-xs mt-2.5 ${s.footClass ?? "text-gray-400"}`}
              >
                {s.foot}
              </p>
            </div>
          );
        })}
      </div>

      {/* Weekly Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          {
            label: "Kuis minggu ini",
            value: stats.quizzesThisWeek,
            trend: "+12%",
            icon: BarChart3,
            iconClass: "text-orange-600",
            iconBg: "bg-orange-50",
          },
          {
            label: "Survei minggu ini",
            value: 0,
            trend: "+8%",
            icon: TrendingUp,
            iconClass: "text-emerald-600",
            iconBg: "bg-emerald-50",
          },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-black/[0.07] p-5 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="text-sm text-gray-500 mb-1.5">{s.label}</p>
                <p className="text-3xl font-semibold text-gray-900 tabular-nums tracking-tight">
                  {s.value.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div
                  className={`w-9 h-9 ${s.iconBg} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${s.iconClass}`} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                  <ArrowUpRight className="w-3 h-3" />
                  {s.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Category Chart + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Category Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Distribusi Kategori Kuis
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {totalCategoryCount} responden
              </p>
            </div>
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
              };
              return (
                <div key={category}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm font-medium text-gray-800">
                      {category}
                    </span>
                    <span className="text-xs tabular-nums text-gray-400">
                      <span className="font-semibold text-gray-700 mr-1">
                        {count}
                      </span>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {categories.length === 0 && (
              <div className="text-center py-10">
                <Activity className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Belum ada data kuis</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          {[
            {
              href: "/admin/data-kuis",
              icon: Database,
              iconClass: "text-blue-600",
              iconBg: "bg-blue-50",
              title: "Data Kuis",
              sub: "Lihat semua hasil kuis siswa",
              linkColor: "text-blue-600",
            },
            {
              href: "/admin/data-survei",
              icon: FileText,
              iconClass: "text-emerald-600",
              iconBg: "bg-emerald-50",
              title: "Data Survei",
              sub: "Lihat hasil survei sekolah",
              linkColor: "text-emerald-600",
            },
            {
              href: "/admin/qr-generator",
              icon: QrCode,
              iconClass: "text-purple-600",
              iconBg: "bg-purple-50",
              title: "Kelola QR",
              sub: "Buat & kelola kode QR",
              linkColor: "text-purple-600",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={i}
                href={item.href}
                className="bg-white rounded-2xl border border-black/[0.07] p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
              >
                <div
                  className={`w-9 h-9 ${item.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-4 h-4 ${item.iconClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {item.sub}
                  </p>
                </div>
                <ArrowRight
                  className={`w-4 h-4 text-gray-300 group-hover:${item.linkColor} group-hover:translate-x-0.5 transition-all flex-shrink-0`}
                />
              </Link>
            );
          })}

          {/* Category Mini Summary */}
          {categories.length > 0 && (
            <div className="bg-white rounded-2xl border border-black/[0.07] p-4 shadow-sm flex-1">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">
                Ringkasan Kategori
              </p>
              <div className="space-y-2.5">
                {categories.map(([name, count]) => {
                  const pct = Math.round((count / totalCategoryCount) * 100);
                  const cfg = CATEGORY_CONFIG[name];
                  return (
                    <div key={name} className="flex items-center gap-2 text-xs">
                      <span
                        className={`w-2 h-2 rounded-sm flex-shrink-0 ${cfg?.dot ?? "bg-blue-500"}`}
                      />
                      <span className="text-gray-600 flex-1 truncate">
                        {name}
                      </span>
                      <span className="tabular-nums text-gray-400 font-medium">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Quizzes */}
        <div className="bg-white rounded-2xl border border-black/[0.07] shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 pt-5 pb-4">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Kuis Terbaru
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                5 aktivitas terakhir
              </p>
            </div>
          </div>
          <div className="border-t border-black/[0.06]" />

          <div className="px-3 py-2">
            {stats.recentQuizzes.length > 0 ? (
              stats.recentQuizzes.map((quiz: any, i: number) => {
                const initials = getInitials(quiz.user_name);
                const av = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const cfg = CATEGORY_CONFIG[quiz.result_category];
                return (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg ${av.bg} ${av.text} flex items-center justify-center text-[11px] font-semibold flex-shrink-0`}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 leading-tight">
                          {quiz.user_name}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {formatDate(quiz.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${cfg?.badge ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {quiz.result_category}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">Belum ada data</p>
              </div>
            )}
          </div>

          <div className="border-t border-black/[0.06] px-5 py-3">
            <Link
              href="/admin/data-kuis"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700"
            >
              Lihat semua
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Recent Surveys */}
        <div className="bg-white rounded-2xl border border-black/[0.07] shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 pt-5 pb-4">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Survei Terbaru
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                5 aktivitas terakhir
              </p>
            </div>
          </div>
          <div className="border-t border-black/[0.06]" />

          <div className="px-3 py-2">
            {stats.recentSurveys.length > 0 ? (
              stats.recentSurveys.map((survey: any, i: number) => {
                const initials = getInitials(survey.nama);
                const av = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <div
                    key={survey.id}
                    className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg ${av.bg} ${av.text} flex items-center justify-center text-[11px] font-semibold flex-shrink-0`}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 leading-tight">
                          {survey.nama}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {formatDate(survey.created_at)}
                        </p>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">Belum ada data</p>
              </div>
            )}
          </div>

          <div className="border-t border-black/[0.06] px-5 py-3">
            <Link
              href="/admin/data-survei"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              Lihat semua
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
