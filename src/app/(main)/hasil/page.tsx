"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { SchoolAutocomplete } from "@/components/SchoolAutocomplete";
import { TourGuide } from "@/components/TourGuide";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  School,
  User,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  BarChart3,
  Brain,
  ShieldCheck,
  ArrowRight,
  LogOut,
  TrendingUp,
  FileText,
  Star,
  Sparkles,
  Zap,
  Target,
  ChevronRight,
  Award,
  Eye,
  EyeOff,
  AlertOctagon,
  ClipboardList,
  Megaphone,
  Info,
  Trophy,
  Cpu,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SchoolData {
  id: string;
  nama_sekolah: string;
  wilayah: string | null;
  status: "belum" | "survei" | "komitmen";
  status_validasi: "pending" | "valid" | "flagged";
  pengirim_nama: string | null;
  submit_timestamp: string | null;
  created_at: string;
}

interface SurveyResult {
  id: string;
  nama: string | null;
  jawaban: Record<string, string>;
  created_at: string;
}

interface QuizResult {
  id: string;
  user_name: string | null;
  answers: number[];
  result_category: string;
  qualification: string;
  indicator_color: string;
  description: string;
  created_at: string;
}

interface CommitmentData {
  created_at: string;
}

const SESSION_KEY = "hasil_session";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcDigitalScore(jawaban: Record<string, string>): number {
  let score = 0;
  const v1 = jawaban["1"] || "";
  const v2 = jawaban["2"] || "";
  const v3 = jawaban["4"] || "";
  if (v1.includes("Jarang") || v1.includes("Tidak pernah")) score += 33;
  else if (v1.includes("Kadang-kadang") || v1.includes("Beberapa kali"))
    score += 17;
  else score += 10;
  if (v2.includes("konsisten") && !v2.includes("kurang")) score += 34;
  else if (v2.includes("kurang konsisten") || v2.includes("Netral"))
    score += 17;
  else score += 10;
  if (v3.includes("baik") || v3.includes("Setuju")) score += 33;
  else if (v3.includes("Sebagian") || v3.includes("Netral")) score += 16;
  else score += 10;
  return Math.min(score, 100);
}

function getScoreConfig(score: number) {
  if (score >= 70)
    return {
      label: "Ekosistem Siap",
      grade: "A",
      textColor: "#34d399",
      gradFrom: "#059669",
      gradTo: "#34d399",
      glow: "rgba(52,211,153,0.30)",
      bg: "rgba(16, 185, 129, 0.15)",
      border: "rgba(16, 185, 129,0.22)",
    };
  if (score >= 40)
    return {
      label: "Berkembang",
      grade: "B",
      textColor: "#fbbf24",
      gradFrom: "#d97706",
      gradTo: "#fbbf24",
      glow: "rgba(251,191,36,0.30)",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.22)",
    };
  return {
    label: "Perlu Perhatian",
    grade: "C",
    textColor: "#f87171",
    gradFrom: "#dc2626",
    gradTo: "#f87171",
    glow: "rgba(248,113,113,0.30)",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.22)",
  };
}

function getStatusConfig(status: SchoolData["status"]) {
  if (status === "komitmen")
    return {
      label: "Berkomitmen",
      dot: "#34d399",
      bg: "rgba(16, 185, 129,0.12)",
      border: "rgba(16, 185, 129,0.25)",
      text: "#34d399",
    };
  if (status === "survei")
    return {
      label: "Survei Terkirim",
      dot: "#fbbf24",
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.25)",
      text: "#fbbf24",
    };
  return {
    label: "Belum Berpartisipasi",
    dot: "#CFD8DC",
    bg: "var(--color-surface-alt)",
    border: "1px solid #ECEFF1",
    text: "#90A4AE",
  };
}

function getValidasiConfig(v: SchoolData["status_validasi"]) {
  if (v === "valid")
    return {
      label: "Terverifikasi",
      icon: CheckCircle2,
      bg: "rgba(16, 185, 129,0.12)",
      border: "rgba(16, 185, 129,0.25)",
      text: "#34d399",
    };
  if (v === "flagged")
    return {
      label: "Ditandai",
      icon: AlertTriangle,
      bg: "rgba(239,68,68,0.10)",
      border: "rgba(239,68,68,0.25)",
      text: "#f87171",
    };
  return {
    label: "Pending Validasi",
    icon: Clock,
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.22)",
    text: "#fbbf24",
  };
}

function getCatConfig(cat: string) {
  if (
    cat.includes("Sangat Bijak") ||
    cat === "Bijak" ||
    cat.includes("Disiplin") ||
    cat.includes("Champion")
  )
    return {
      color: "#34d399",
      bg: "rgba(16, 185, 129,0.12)",
      border: "rgba(16, 185, 129,0.20)",
    };
  if (
    cat.includes("Cukup Bijak") ||
    cat.includes("Sadar") ||
    cat.includes("Developing")
  )
    return {
      color: "#fbbf24",
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.20)",
    };
  return {
    color: "#f87171",
    bg: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.20)",
  };
}

function formatDate(ts: string | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getRecommendations(
  s: SurveyResult | null,
  status: string,
  quizzes: QuizResult[],
) {
  const recs: Array<{ text: string; icon: React.ElementType; color: string }> =
    [];
  if (s) {
    const j = s.jawaban;
    if ((j["1"] || "").includes("Sering"))
      recs.push({
        text: "Terapkan kebijakan 'Gadget-Free Zone' di ruang kelas",
        icon: AlertOctagon,
        color: "#f87171",
      });
    if (
      (j["2"] || "").includes("kurang konsisten") ||
      (j["2"] || "").includes("Tidak ada")
    )
      recs.push({
        text: "Perkuat konsistensi penegakan aturan penggunaan HP",
        icon: ClipboardList,
        color: "#fbbf24",
      });
    if ((j["4"] || "").includes("Sebagian") || (j["4"] || "").includes("Belum"))
      recs.push({
        text: "Sosialisasi dampak digital ke siswa & wali murid",
        icon: Megaphone,
        color: "#64B5F6",
      });
  }

  if (quizzes && quizzes.length > 0) {
    const daruratCount = quizzes.filter(
      (q) =>
        q.result_category === "Darurat Digital" ||
        q.result_category === "Perlu Pendampingan",
    ).length;
    if (daruratCount > 0) {
      recs.push({
        text: `Perlu pendampingan khusus untuk ${daruratCount} siswa dengan indikasi rentan perilaku digital negatif`,
        icon: AlertTriangle,
        color: "#f87171",
      });
    }
    const championCount = quizzes.filter(
      (q) => q.result_category === "Sangat Bijak",
    ).length;
    if (championCount > 0 && championCount === quizzes.length) {
      recs.push({
        text: "Luar biasa! Seluruh siswa sejauh ini menunjukkan etika digital yang sangat bijak",
        icon: Star,
        color: "#34d399",
      });
    }
  }

  if (recs.length === 0)
    recs.push({
      text: "Pertahankan ekosistem digital positif yang ada",
      icon: Star,
      color: "#34d399",
    });
  if (status !== "komitmen")
    recs.push({
      text: "Daftarkan sekolah dalam program Komitmen Digital Nasional",
      icon: Target,
      color: "var(--color-primary)",
    });
  else
    recs.push({
      text: "Terus pertahankan implementasi Komitmen Digital Nasional",
      icon: Trophy,
      color: "#34d399",
    });
  return recs;
}

// ─── Smart Analysis Helpers ──────────────────────────────────────────────────

function getHealthConfig(key: string, val: string) {
  if (!val || val === "—") return null;
  if (key === "1") {
    if (val.includes("Jarang") || val.includes("Tidak pernah"))
      return { label: "Rendah", color: "#34d399", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.20)", emoji: "🟢" };
    if (val.includes("Kadang") || val.includes("Beberapa"))
      return { label: "Sedang", color: "#fbbf24", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.20)", emoji: "🟡" };
    return { label: "Tinggi", color: "#f87171", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.20)", emoji: "🔴" };
  }
  if (key === "2") {
    if (val.includes("konsisten") && !val.includes("kurang"))
      return { label: "Konsisten", color: "#34d399", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.20)", emoji: "🟢" };
    if (val.includes("kurang") || val.includes("Netral"))
      return { label: "Kurang", color: "#fbbf24", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.20)", emoji: "🟡" };
    return { label: "Tidak Ada", color: "#f87171", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.20)", emoji: "🔴" };
  }
  if (val.includes("baik") || val.includes("Setuju"))
    return { label: "Sudah", color: "#34d399", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.20)", emoji: "🟢" };
  if (val.includes("Sebagian") || val.includes("Netral"))
    return { label: "Sebagian", color: "#fbbf24", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.20)", emoji: "🟡" };
  return { label: "Belum", color: "#f87171", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.20)", emoji: "🔴" };
}

function generateNarrative(
  score: number,
  sc: ReturnType<typeof getScoreConfig>,
  latestSurvey: SurveyResult | null,
  quizzes: QuizResult[],
  school: SchoolData,
): string {
  const parts: string[] = [];
  parts.push(
    `${school.nama_sekolah} berada di fase **${sc.label}** dengan skor kesiapan digital **${score}/100**.`,
  );
  if (latestSurvey) {
    const j = latestSurvey.jawaban;
    const v1 = j["1"] || "";
    const v2 = j["2"] || "";
    const v4 = j["4"] || "";
    if (v1.includes("Sering") || v1.includes("Setiap"))
      parts.push(
        "Penggunaan gadget di luar jam belajar **sangat sering terjadi** — tantangan utama yang perlu ditangani segera.",
      );
    else if (v1.includes("Kadang") || v1.includes("Beberapa"))
      parts.push(
        "Penggunaan gadget di luar jam belajar **masih terjadi sesekali** dan perlu pemantauan lebih ketat.",
      );
    else if (v1)
      parts.push(
        "Penggunaan gadget di luar jam belajar sudah **terkontrol dengan baik**.",
      );
    if (v2.includes("konsisten") && !v2.includes("kurang"))
      parts.push("Aturan penggunaan HP **diterapkan secara konsisten**.");
    else if (v2.includes("kurang") || v2.includes("Netral"))
      parts.push("Konsistensi penegakan aturan HP **masih perlu diperkuat**.");
    else if (v2)
      parts.push(
        "Aturan penggunaan HP **belum diterapkan** — tindakan prioritas diperlukan.",
      );
    if (v4.includes("baik") || v4.includes("Setuju"))
      parts.push(
        "Sosialisasi kebijakan digital kepada warga sekolah sudah **berjalan baik**.",
      );
    else if (v4.includes("Sebagian") || v4.includes("Netral"))
      parts.push(
        "Sosialisasi kebijakan digital **baru menjangkau sebagian** warga sekolah.",
      );
    else if (v4)
      parts.push("Sosialisasi dampak digital **belum dilakukan menyeluruh**.");
  }
  const total = quizzes.length;
  if (total > 0) {
    const watchCount = quizzes.filter(
      (q) =>
        q.result_category === "Darurat Digital" ||
        q.result_category === "Perlu Pendampingan",
    ).length;
    const champCount = quizzes.filter(
      (q) =>
        q.result_category === "Sangat Bijak" || q.result_category === "Bijak",
    ).length;
    if (watchCount > 0)
      parts.push(
        `Dari **${total} peserta kuis**, **${watchCount} siswa (${Math.round((watchCount / total) * 100)}%)** memerlukan pendampingan perilaku digital.`,
      );
    else if (champCount > 0)
      parts.push(
        `Dari **${total} peserta kuis**, mayoritas (**${champCount} siswa**) menunjukkan literasi digital yang positif.`,
      );
    else
      parts.push(
        `Terdapat **${total} peserta kuis** refleksi digital dari sekolah ini.`,
      );
  } else {
    parts.push("**Belum ada siswa** yang mengikuti kuis refleksi digital.");
  }
  if (school.status === "komitmen")
    parts.push(
      "Sekolah ini telah **resmi berkomitmen** dalam program Komitmen Digital Nasional.",
    );
  else
    parts.push(
      "Sekolah belum mengambil **Komitmen Digital Nasional** — pertimbangkan untuk mendaftar.",
    );
  return parts.join(" ");
}

function calcDimensions(
  latestSurvey: SurveyResult | null,
  quizzes: QuizResult[],
  school: SchoolData,
) {
  const j = latestSurvey?.jawaban || {};
  const v1 = (j["1"] || "").toLowerCase();
  const v2 = (j["2"] || "").toLowerCase();
  const v4 = (j["4"] || "").toLowerCase();

  // Regulasi: Konsistensi aturan
  const regulasi = !latestSurvey
    ? 0
    : v2.includes("sangat") && v2.includes("konsisten")
      ? 100
      : v2.includes("konsisten") && !v2.includes("kurang")
        ? 80
        : v2.includes("kurang") || v2.includes("sebagian")
          ? 50
          : v2
            ? 20
            : 0;

  // Literasi: Sosialisasi kebijakan
  const literasi = !latestSurvey
    ? 0
    : v4.includes("sangat baik") || v4.includes("sangat setuju")
      ? 100
      : v4.includes("baik") || v4.includes("setuju")
        ? 80
        : v4.includes("sebagian") || v4.includes("netral")
          ? 50
          : v4
            ? 20
            : 0;

  // Kontrol: Frekuensi gadget di luar belajar (makin jarang makin baik)
  const kontrol = !latestSurvey
    ? 0
    : v1.includes("tidak pernah") || v1.includes("sangat jarang")
      ? 100
      : v1.includes("jarang")
        ? 80
        : v1.includes("kadang") || v1.includes("beberapa")
          ? 50
          : v1.includes("sering") || v1.includes("setiap")
            ? 20
            : 0;

  // Siswa: Persentase siswa Bijak/Sangat Bijak (skala absolut)
  const total = quizzes.length;
  const champCount = quizzes.filter(
    (q) =>
      q.result_category === "Sangat Bijak" ||
      q.result_category === "Bijak" ||
      q.result_category.includes("Champion"),
  ).length;
  const kesadaran = total > 0 ? Math.round((champCount / total) * 100) : 0;

  // Komitmen: Status pendaftaran program
  const komitmen =
    school.status === "komitmen" ? 100 : school.status === "survei" ? 60 : 20;

  return [
    {
      label: "Regulasi",
      value: regulasi,
      desc: "Konsistensi penerapan aturan penggunaan gawai di lingkungan sekolah.",
    },
    {
      label: "Literasi",
      value: literasi,
      desc: "Upaya edukasi dan sosialisasi kebijakan digital kepada warga sekolah.",
    },
    {
      label: "Kontrol",
      value: kontrol,
      desc: "Tingkat pembatasan frekuensi penggunaan gawai di luar jam belajar.",
    },
    {
      label: "Siswa",
      value: kesadaran,
      desc: "Persentase siswa dengan literasi digital positif berdasarkan kuis refleksi.",
    },
    {
      label: "Komitmen",
      value: komitmen,
      desc: "Status partisipasi sekolah dalam program Komitmen Digital Nasional.",
    },
  ];
}

// ─── Radar Chart Component ────────────────────────────────────────────────────

function RadarChart({ dims }: { dims: { label: string; value: number }[] }) {
  const cx = 130,
    cy = 130,
    r = 90;
  const n = dims.length;
  const angles = dims.map((_, i) => (i * 2 * Math.PI) / n - Math.PI / 2);
  const pt = (angle: number, ratio: number) => ({
    x: cx + ratio * r * Math.cos(angle),
    y: cy + ratio * r * Math.sin(angle),
  });
  const toPath = (pts: { x: number; y: number }[]) =>
    pts
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
      )
      .join(" ") + " Z";
  const levels = [0.25, 0.5, 0.75, 1];
  const avg = dims.reduce((s, d) => s + d.value, 0) / n;
  const strokeColor =
    avg >= 70 ? "#34d399" : avg >= 40 ? "#fbbf24" : "#f87171";
  const fillColor =
    avg >= 70
      ? "rgba(52,211,153,0.15)"
      : avg >= 40
        ? "rgba(251,191,36,0.12)"
        : "rgba(248,113,113,0.12)";
  const dataPoints = angles.map((a, i) =>
    pt(a, Math.max(dims[i].value, 3) / 100),
  );
  const dataPath = toPath(dataPoints);
  return (
    <svg viewBox="-28 -18 316 296" className="w-full max-w-50 mx-auto">
      {levels.map((lvl, li) => (
        <path
          key={li}
          d={toPath(angles.map((a) => pt(a, lvl)))}
          fill="none"
          stroke="#ECEFF1"
          strokeWidth={li === 3 ? 1.5 : 1}
        />
      ))}
      {angles.map((a, i) => {
        const outer = pt(a, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={outer.x.toFixed(1)}
            y2={outer.y.toFixed(1)}
            stroke="#ECEFF1"
            strokeWidth="1"
          />
        );
      })}
      <path
        d={dataPath}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x.toFixed(1)}
          cy={p.y.toFixed(1)}
          r="4"
          fill={strokeColor}
        />
      ))}
      {angles.map((a, i) => {
        const lp = pt(a, 1.32);
        return (
          <g key={i}>
            <text
              x={lp.x.toFixed(1)}
              y={(lp.y - 6).toFixed(1)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill="#607D8B"
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
            >
              {dims[i].label}
            </text>
            <text
              x={lp.x.toFixed(1)}
              y={(lp.y + 7).toFixed(1)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill={strokeColor}
              fontWeight="800"
              fontFamily="system-ui, sans-serif"
            >
              {dims[i].value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Nav Sections ─────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "profil", label: "Profil", icon: School },
  { id: "survei", label: "Survei", icon: FileText },
  { id: "dimensi", label: "Dimensi", icon: BarChart3 },
  { id: "kuis", label: "Kuis", icon: Brain },
  { id: "rekomendasi", label: "Rekomendasi", icon: Star },
];

// ─── Login Gate ───────────────────────────────────────────────────────────────

function LoginGate({ onLogin }: { onLogin: (s: SchoolData) => void }) {
  const [schoolName, setSchoolName] = useState("");
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [pengirim, setPengirim] = useState("");
  const [showPengirim, setShowPengirim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleNext = () => {
    if (!schoolId) {
      setError("Pilih sekolah terlebih dahulu.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!schoolId || !pengirim.trim()) {
      setError("Harap isi nama pengirim.");
      return;
    }
    setLoading(true);
    setError("");
    const { data, error: qErr } = await supabase
      .from("schools")
      .select(
        "id, nama_sekolah, status, status_validasi, wilayah, pengirim_nama, submit_timestamp, created_at",
      )
      .eq("id", schoolId)
      .ilike("pengirim_nama", pengirim.trim())
      .maybeSingle();
    setLoading(false);
    if (qErr || !data) {
      setError("Kredensial tidak cocok. Periksa kembali nama pengirim survei.");
      setBlocked(true);
      setTimeout(() => setBlocked(false), 4000);
      return;
    }
    if (data.status === "belum") {
      setError("Sekolah belum berpartisipasi. Isi survei terlebih dahulu.");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    onLogin(data as SchoolData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Mesh bg */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: 800,
            height: 800,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(46, 125, 50,0.12) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-15%",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "35%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
        style={{ zIndex: 1 }}
      >
        {/* Brand mark */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(46, 125, 50,0.20) 0%, rgba(46, 125, 50,0.12) 100%)",
              border: "1px solid rgba(46, 125, 50,0.30)",
              boxShadow: "0 0 40px rgba(46, 125, 50,0.20)",
            }}
          >
            <Lock
              className="w-7 h-7"
              style={{ color: "var(--color-primary)" }}
            />
          </motion.div>
          <h1
            className="text-3xl font-black tracking-tight mb-2"
            style={{
              color: "var(--color-text-dark)",
              letterSpacing: "-0.02em",
            }}
          >
            Akses Laporan
          </h1>
          <p className="text-sm" style={{ color: "#607D8B" }}>
            Lihat analitik lengkap sekolah Anda
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6 px-1">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-black transition-all duration-300"
                style={{
                  background:
                    step >= s
                      ? "linear-gradient(135deg, var(--color-info), var(--color-primary))"
                      : "var(--color-surface-alt)",
                  color: step >= s ? "#ffffff" : "#90A4AE",
                  boxShadow:
                    step === s ? "0 0 16px rgba(46, 125, 50,0.40)" : "none",
                }}
              >
                {step > s ? "✓" : s}
              </div>
              <span
                className="text-xs font-semibold"
                style={{
                  color: step >= s ? "var(--color-text-dark)" : "#90A4AE",
                }}
              >
                {s === 1 ? "Pilih Sekolah" : "Verifikasi"}
              </span>
              {s < 2 && (
                <div
                  className="flex-1 h-px"
                  style={{
                    background: step > s ? "rgba(46, 125, 50,0.40)" : "#ECEFF1",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-7 space-y-5"
          style={{
            background: "#ffffff",
            border: "1px solid #ECEFF1",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                <div>
                  <label
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2.5"
                    style={{ color: "#90A4AE" }}
                  >
                    <School
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--color-primary)" }}
                    />{" "}
                    Nama Sekolah
                  </label>
                  <div className="school-autocomplete-light">
                    <SchoolAutocomplete
                      value={schoolName}
                      onChange={(val, s) => {
                        setSchoolName(val);
                        setSchoolId(s?.id ?? null);
                        setError("");
                      }}
                      hasError={false}
                    />
                    <style>{`
                      .school-autocomplete-light input,
                      .school-autocomplete-light input::placeholder,
                      .school-autocomplete-light [role="option"],
                      .school-autocomplete-light [role="listbox"] {
                        color: var(--color-text-dark) !important;
                      }
                      .school-autocomplete-light input::placeholder {
                        color: #90A4AE !important;
                      }
                      .school-autocomplete-light input {
                        background: var(--color-surface) !important;
                        border-color: #CFD8DC !important;
                        color: var(--color-text-dark) !important;
                      }
                      .school-autocomplete-light input:focus {
                        border-color: rgba(46, 125, 50, 0.60) !important;
                        box-shadow: 0 0 0 4px rgba(46, 125, 50,0.10) !important;
                        outline: none !important;
                      }
                      .school-autocomplete-light [role="listbox"],
                      .school-autocomplete-light ul,
                      .school-autocomplete-light [data-headlessui-state],
                      .school-autocomplete-light > div > div {
                        background: #ffffff !important;
                        border: 1px solid #CFD8DC !important;
                        border-radius: 12px !important;
                      }
                      .school-autocomplete-light [role="option"],
                      .school-autocomplete-light li {
                        color: var(--color-text-dark) !important;
                        background: transparent !important;
                      }
                      .school-autocomplete-light [role="option"]:hover,
                      .school-autocomplete-light [role="option"][data-headlessui-state~="active"],
                      .school-autocomplete-light li:hover {
                        background: rgba(46, 125, 50,0.12) !important;
                        color: var(--color-text-dark) !important;
                      }
                      .school-autocomplete-light [aria-selected="true"],
                      .school-autocomplete-light [role="option"][data-headlessui-state~="selected"] {
                        background: rgba(46, 125, 50,0.18) !important;
                        color: var(--color-primary) !important;
                      }
                      .school-autocomplete-light svg {
                        color: #90A4AE !important;
                      }
                    `}</style>
                  </div>
                </div>
                {error && <ErrorBanner msg={error} />}
                <button
                  onClick={handleNext}
                  disabled={!schoolId}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-30"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-info), var(--color-primary))",
                    color: "#ffffff",
                    boxShadow: schoolId
                      ? "0 4px 24px rgba(46, 125, 50,0.35)"
                      : "none",
                  }}
                >
                  Lanjutkan <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Selected school */}
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: "rgba(46, 125, 50,0.08)",
                    border: "1px solid rgba(46, 125, 50,0.20)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(46, 125, 50,0.15)" }}
                  >
                    <School
                      className="w-4 h-4"
                      style={{ color: "var(--color-primary)" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-bold"
                      style={{ color: "#90A4AE" }}
                    >
                      Sekolah dipilih
                    </p>
                    <p
                      className="text-sm font-bold truncate"
                      style={{ color: "var(--color-text-dark)" }}
                    >
                      {schoolName}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Ubah
                  </button>
                </div>

                <div>
                  <label
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2.5"
                    style={{ color: "#90A4AE" }}
                  >
                    <User
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--color-primary)" }}
                    />{" "}
                    Nama Pengirim Survei
                  </label>
                  <div className="relative">
                    <input
                      type={showPengirim ? "text" : "password"}
                      value={pengirim}
                      onChange={(e) => {
                        setPengirim(e.target.value);
                        setError("");
                      }}
                      placeholder="Nama yang terdaftar saat survei"
                      className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #CFD8DC",
                        color: "var(--color-text-dark)",
                        outline: "none",
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !blocked && handleSubmit()
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPengirim(!showPengirim)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "#90A4AE" }}
                    >
                      {showPengirim ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs mt-2 pl-1" style={{ color: "#90A4AE" }}>
                    Nama ini harus sesuai persis dengan data yang dikirimkan.
                  </p>
                </div>

                {error && <ErrorBanner msg={error} />}

                <button
                  onClick={handleSubmit}
                  disabled={loading || blocked || !pengirim.trim()}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-30"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-info), var(--color-primary))",
                    color: "#ffffff",
                    boxShadow: pengirim.trim()
                      ? "0 4px 24px rgba(46, 125, 50,0.35)"
                      : "none",
                  }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      Lihat Laporan Saya <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: "#CFD8DC" }}>
          Hanya untuk perwakilan sekolah yang telah mengirimkan survei
        </p>
      </motion.div>
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div
      className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm"
      style={{
        background: "rgba(239,68,68,0.10)",
        border: "1px solid rgba(239,68,68,0.25)",
      }}
    >
      <AlertTriangle
        className="w-4 h-4 mt-0.5 shrink-0"
        style={{ color: "#f87171" }}
      />
      <span style={{ color: "#f87171" }}>{msg}</span>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({
  school,
  onLogout,
}: {
  school: SchoolData;
  onLogout: () => void;
}) {
  const [surveys, setSurveys] = useState<SurveyResult[]>([]);
  const [quizzes, setQuizzes] = useState<QuizResult[]>([]);
  const [commitment, setCommitment] = useState<CommitmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("profil");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    async function fetch() {
      const [{ data: sv }, { data: qz }, { data: cm }] = await Promise.all([
        supabase
          .from("survey_results")
          .select("id, school_id, nama, jawaban, created_at")
          .eq("school_id", school.id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("quiz_results")
          .select(
            "id, user_name, result_category, answers, description, indicator_color, qualification, created_at",
          )
          .eq("school_id", school.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("commitments")
          .select("created_at")
          .eq("school_id", school.id)
          .maybeSingle(),
      ]);
      setSurveys((sv as SurveyResult[]) || []);
      setQuizzes((qz as QuizResult[]) || []);
      setCommitment(cm as CommitmentData | null);
      setLoading(false);
    }
    fetch();
  }, [school.id]);

  // Scrollspy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveNav(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const latestSurvey = surveys[0] ?? null;
  const score = latestSurvey ? calcDigitalScore(latestSurvey.jawaban) : 0;
  const sc = getScoreConfig(score);
  const statusCfg = getStatusConfig(school.status);
  const validCfg = getValidasiConfig(school.status_validasi);
  const recs = getRecommendations(latestSurvey, school.status, quizzes);

  const quizCats = quizzes.reduce<Record<string, number>>((a, q) => {
    a[q.result_category] = (a[q.result_category] || 0) + 1;
    return a;
  }, {});
  const championCount = quizzes.filter(
    (q) =>
      q.result_category === "Sangat Bijak" ||
      q.result_category === "Bijak" ||
      q.result_category.includes("Disiplin") ||
      q.result_category.includes("Champion"),
  ).length;
  const watchCount = quizzes.filter(
    (q) =>
      q.result_category === "Darurat Digital" ||
      q.result_category === "Perlu Pendampingan" ||
      q.result_category.includes("Waspada") ||
      q.result_category.includes("Addicted"),
  ).length;

  const narrative = latestSurvey
    ? generateNarrative(score, sc, latestSurvey, quizzes, school)
    : "";
  const narrativeParts = narrative.split(/\*\*(.*?)\*\*/g);
  const dims = calcDimensions(latestSurvey, quizzes, school);

  const fade = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Fixed bg mesh */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 900,
            height: 900,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(46, 125, 50,0.09) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16, 185, 129,0.07) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Top navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6"
        style={{
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid #ECEFF1",
        }}
      >
        <div className="max-w-7xl mx-auto h-16 flex items-center gap-4">
          {/* Logo/brand */}
          <div className="flex items-center gap-3 mr-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-info), var(--color-primary))",
              }}
            >
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: "var(--color-primary)", lineHeight: 1 }}
              >
                Laporan
              </p>
              <p
                className="text-xs font-bold truncate max-w-45"
                style={{ color: "#607D8B" }}
              >
                {school.nama_sekolah}
              </p>
            </div>
          </div>

          {/* Scrollspy nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                style={{
                  background:
                    activeNav === id ? "rgba(46, 125, 50,0.12)" : "transparent",
                  color: activeNav === id ? "var(--color-primary)" : "#607D8B",
                  border:
                    activeNav === id
                      ? "1px solid rgba(46, 125, 50,0.22)"
                      : "1px solid transparent",
                }}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </nav>

          {/* Status pill */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: statusCfg.bg,
              border: `1px solid ${statusCfg.border}`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: statusCfg.dot }}
            />
            <span
              className="text-xs font-bold"
              style={{ color: statusCfg.text }}
            >
              {statusCfg.label}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ml-auto md:ml-0"
            style={{
              background: "var(--color-surface-alt)",
              border: "1px solid #ECEFF1",
              color: "#607D8B",
            }}
          >
            <LogOut className="w-3.5 h-3.5" />{" "}
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="flex flex-col gap-8">
            {/* ── Hero score banner ── */}
            <motion.div
              {...fade}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: sc.bg,
                border: `1px solid ${sc.border}`,
                boxShadow: `0 0 80px ${sc.glow}`,
              }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div
                  style={{
                    position: "absolute",
                    top: "-40%",
                    right: "-10%",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${sc.glow} 0%, transparent 60%)`,
                    mixBlendMode: "screen",
                  }}
                />
              </div>
              <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {latestSurvey ? (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Sparkles
                          className="w-5 h-5"
                          style={{ color: sc.textColor }}
                        />
                        <span
                          className="text-xs font-black uppercase tracking-widest"
                          style={{ color: sc.textColor }}
                        >
                          Skor Kesiapan Digital
                        </span>
                      </div>
                      <h2
                        className="text-4xl sm:text-5xl font-black mb-2"
                        style={{
                          color: "var(--color-text-dark)",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {score}
                        <span className="text-2xl" style={{ color: "#90A4AE" }}>
                          /100
                        </span>
                      </h2>
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold"
                        style={{
                          background: `${sc.glow}`,
                          color: sc.textColor,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {sc.grade === "A"
                          ? "🏆"
                          : sc.grade === "B"
                            ? "📈"
                            : "⚡"}{" "}
                        {sc.label}
                      </span>
                    </div>
                    <div className="w-full sm:w-64">
                      <div
                        className="flex justify-between text-xs mb-2"
                        style={{ color: "#607D8B" }}
                      >
                        <span>Progress</span>
                        <span style={{ color: sc.textColor }}>{score}%</span>
                      </div>
                      <div
                        className="h-3 rounded-full overflow-hidden"
                        style={{ background: "var(--color-surface-alt)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${sc.gradFrom}, ${sc.gradTo})`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{
                            duration: 1.2,
                            ease: [0.22, 1, 0.36, 1],
                            delay: 0.3,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-4 gap-3">
                        {[
                          {
                            label: "Survei Terkirim",
                            val: surveys.length,
                            icon: FileText,
                          },
                          {
                            label: "Peserta Kuis",
                            val: quizzes.length,
                            icon: Brain,
                          },
                        ].map(({ label, val }) => (
                          <div
                            key={label}
                            className="flex-1 p-3 rounded-xl"
                            style={{
                              background: "#ffffff",
                              border: "1px solid #ECEFF1",
                            }}
                          >
                            <p
                              className="text-xl font-black"
                              style={{ color: "var(--color-text-dark)" }}
                            >
                              {val}
                            </p>
                            <p
                              className="text-[10px] font-bold uppercase tracking-wide mt-0.5"
                              style={{ color: "#90A4AE" }}
                            >
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 text-center py-4">
                    <p
                      className="text-2xl font-black mb-2"
                      style={{ color: "#607D8B" }}
                    >
                      Belum Ada Data Survei
                    </p>
                    <p className="text-sm" style={{ color: "#90A4AE" }}>
                      Isi survei untuk melihat skor kesiapan digital sekolah
                      Anda.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Analisis Naratif Cerdas */}
            {narrative && (
              <motion.div
                {...fade}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="rounded-3xl px-6 py-5"
                style={{
                  background: sc.bg,
                  border: `1px solid ${sc.border}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: sc.glow }}
                  >
                    <Cpu
                      className="w-4 h-4"
                      style={{ color: sc.textColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[10px] font-black uppercase tracking-widest mb-2"
                      style={{ color: sc.textColor }}
                    >
                      Analisis Cerdas
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#607D8B" }}
                    >
                      {narrativeParts.map((part, idx) =>
                        idx % 2 === 1 ? (
                          <strong
                            key={idx}
                            style={{
                              color: "var(--color-text-dark)",
                              fontWeight: 800,
                            }}
                          >
                            {part}
                          </strong>
                        ) : (
                          <span key={idx}>{part}</span>
                        )
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Section: Profil ── */}
            <Section
              id="profil"
              innerRef={(el) => {
                sectionRefs.current["profil"] = el;
              }}
            >
              <SectionHeader icon={School} label="Profil Sekolah" delay={0.1} />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  {
                    label: "Wilayah",
                    value: school.wilayah || "—",
                    icon: MapPin,
                    color: "#64B5F6",
                  },
                  {
                    label: "Pengirim",
                    value: school.pengirim_nama || "—",
                    icon: User,
                    color: "#a78bfa",
                  },
                  {
                    label: "Tanggal Survei",
                    value: formatDate(school.submit_timestamp),
                    icon: Clock,
                    color: "#60a5fa",
                  },
                ].map(({ label, value, icon: Icon, color }) => (
                  <motion.div
                    key={label}
                    {...fade}
                    transition={{ duration: 0.4, delay: 0.12 }}
                    className="col-span-1 p-4 rounded-2xl"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #ECEFF1",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: `${color}18` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <p
                      className="text-[10px] font-black uppercase tracking-widest mb-1"
                      style={{ color: "#90A4AE" }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-sm font-bold leading-tight"
                      style={{ color: "var(--color-text-dark)" }}
                    >
                      {value}
                    </p>
                  </motion.div>
                ))}
                <motion.div
                  {...fade}
                  transition={{ duration: 0.4, delay: 0.14 }}
                  className="p-4 rounded-2xl"
                  style={{ background: "#ffffff", border: "1px solid #ECEFF1" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `${statusCfg.dot}18` }}
                  >
                    <CheckCircle2
                      className="w-4 h-4"
                      style={{ color: statusCfg.dot }}
                    />
                  </div>
                  <p
                    className="text-[10px] font-black uppercase tracking-widest mb-1"
                    style={{ color: "#90A4AE" }}
                  >
                    Partisipasi
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold"
                    style={{
                      background: statusCfg.bg,
                      border: `1px solid ${statusCfg.border}`,
                      color: statusCfg.text,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: statusCfg.dot }}
                    />{" "}
                    {statusCfg.label}
                  </span>
                </motion.div>
                <motion.div
                  {...fade}
                  transition={{ duration: 0.4, delay: 0.16 }}
                  className="p-4 rounded-2xl"
                  style={{ background: "#ffffff", border: "1px solid #ECEFF1" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: "rgba(99,102,241,0.15)" }}
                  >
                    <ShieldCheck
                      className="w-4 h-4"
                      style={{ color: "#818cf8" }}
                    />
                  </div>
                  <p
                    className="text-[10px] font-black uppercase tracking-widest mb-1"
                    style={{ color: "#90A4AE" }}
                  >
                    Validasi
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold"
                    style={{
                      background: validCfg.bg,
                      border: `1px solid ${validCfg.border}`,
                      color: validCfg.text,
                    }}
                  >
                    <validCfg.icon className="w-3.5 h-3.5" /> {validCfg.label}
                  </span>
                </motion.div>
              </div>

              {/* ── Timeline Perjalanan Sekolah ── */}
              <motion.div
                {...fade}
                transition={{ duration: 0.4, delay: 0.22 }}
                className="mt-5 pt-5"
                style={{ borderTop: "1px solid #ECEFF1" }}
              >
                <p
                  className="text-[10px] font-black uppercase tracking-widest mb-4"
                  style={{ color: "#90A4AE" }}
                >
                  Perjalanan Sekolah
                </p>
                <div className="flex items-start">
                  {[
                    {
                      label: "Terdaftar",
                      date: school.created_at,
                      done: true,
                      active: school.status === "belum",
                    },
                    {
                      label: "Survei Dikirim",
                      date: school.submit_timestamp,
                      done: !!school.submit_timestamp,
                      active: school.status === "survei",
                    },
                    {
                      label: "Komitmen",
                      date: commitment?.created_at ?? null,
                      done: school.status === "komitmen",
                      active: school.status === "komitmen",
                    },
                  ].map((step, i, arr) => (
                    <div
                      key={step.label}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div className="flex items-center w-full">
                        {i > 0 && (
                          <div
                            className="flex-1 h-0.5"
                            style={{
                              background: step.done
                                ? "var(--color-primary)"
                                : "#ECEFF1",
                            }}
                          />
                        )}
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300"
                          style={{
                            background: step.done
                              ? "linear-gradient(135deg, var(--color-info), var(--color-primary))"
                              : "#ECEFF1",
                            boxShadow: step.active
                              ? "0 0 0 5px rgba(46,125,50,0.15)"
                              : "none",
                          }}
                        >
                          {step.done && (
                            <CheckCircle2
                              className="w-3 h-3 text-white"
                              style={{ strokeWidth: 3 }}
                            />
                          )}
                        </div>
                        {i < arr.length - 1 && (
                          <div
                            className="flex-1 h-0.5"
                            style={{
                              background: arr[i + 1].done
                                ? "var(--color-primary)"
                                : "#ECEFF1",
                            }}
                          />
                        )}
                      </div>
                      <div className="mt-2 text-center px-1">
                        <p
                          className="text-[10px] font-black"
                          style={{
                            color: step.done
                              ? "var(--color-text-dark)"
                              : "#CFD8DC",
                          }}
                        >
                          {step.label}
                        </p>
                        <p
                          className="text-[10px] mt-0.5"
                          style={{ color: "#90A4AE" }}
                        >
                          {step.date ? formatDate(step.date) : "Belum"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Section>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2/3 */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* ── Section: Survei ── */}
                <Section
                  id="survei"
                  innerRef={(el) => {
                    sectionRefs.current["survei"] = el;
                  }}
                >
                  <SectionHeader
                    icon={FileText}
                    label="Hasil Survei"
                    badge={`${surveys.length} kiriman`}
                    delay={0.15}
                  />
                  {!latestSurvey ? (
                    <EmptyState
                      icon={FileText}
                      msg="Belum ada data survei dari sekolah ini."
                    />
                  ) : (
                    <div className="space-y-3">
                      {[
                        {
                          label: "Penggunaan Gadget di Luar Belajar",
                          val: latestSurvey.jawaban["1"] || "—",
                          icon: Clock,
                          iconColor: "#64B5F6",
                          qKey: "1",
                        },
                        {
                          label: "Konsistensi Aturan HP",
                          val: latestSurvey.jawaban["2"] || "—",
                          icon: ShieldCheck,
                          iconColor: "#60a5fa",
                          qKey: "2",
                        },
                        {
                          label: "Sosialisasi Kebijakan Digital",
                          val: latestSurvey.jawaban["4"] || "—",
                          icon: TrendingUp,
                          iconColor: "#34d399",
                          qKey: "4",
                        },
                      ].map(({ label, val, icon: Icon, iconColor, qKey }, i) => {
                        const health = getHealthConfig(qKey, val);
                        return (
                          <motion.div
                            key={label}
                            {...fade}
                            transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                            className="flex items-start gap-4 p-4 rounded-2xl group transition-all duration-200 cursor-default"
                            style={{
                              background: "#ffffff",
                              border: "1px solid #ECEFF1",
                            }}
                            onMouseEnter={(e) => {
                              Object.assign(
                                (e.currentTarget as HTMLDivElement).style,
                                { background: "#ffffff", borderColor: "#CFD8DC" },
                              );
                            }}
                            onMouseLeave={(e) => {
                              Object.assign(
                                (e.currentTarget as HTMLDivElement).style,
                                { background: "#ffffff", borderColor: "#ECEFF1" },
                              );
                            }}
                          >
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: `${iconColor}18` }}
                            >
                              <Icon
                                className="w-5 h-5"
                                style={{ color: iconColor }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <p
                                  className="text-[10px] font-black uppercase tracking-widest"
                                  style={{ color: "#90A4AE" }}
                                >
                                  {label}
                                </p>
                                {health && (
                                  <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                                    style={{
                                      background: health.bg,
                                      border: `1px solid ${health.border}`,
                                      color: health.color,
                                    }}
                                  >
                                    {health.emoji} {health.label}
                                  </span>
                                )}
                              </div>
                              <p
                                className="text-sm font-bold leading-relaxed"
                                style={{ color: "var(--color-text-dark)" }}
                              >
                                {val}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                      <p
                        className="text-xs text-right pt-1"
                        style={{ color: "#CFD8DC" }}
                      >
                        Dikirim oleh:{" "}
                        <span style={{ color: "#607D8B", fontWeight: 700 }}>
                          {latestSurvey.nama || "Anonim"}
                        </span>
                      </p>
                    </div>
                  )}
                </Section>

                {/* ── Section: Dimensi ── */}
                <Section
                  id="dimensi"
                  innerRef={(el) => {
                    sectionRefs.current["dimensi"] = el;
                  }}
                >
                  <SectionHeader
                    icon={BarChart3}
                    label="Dimensi Kesiapan Digital"
                    delay={0.18}
                  />
                  {!latestSurvey ? (
                    <EmptyState
                      icon={BarChart3}
                      msg="Lengkapi survei untuk melihat analisis 5 dimensi kesiapan digital."
                    />
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="shrink-0">
                        <RadarChart dims={dims} />
                      </div>
                      <div className="flex-1 w-full space-y-3">
                        {dims.map((dim) => {
                          const dimColor =
                            dim.value >= 70
                              ? "#34d399"
                              : dim.value >= 40
                                ? "#fbbf24"
                                : "#f87171";
                          return (
                            <div
                              key={dim.label}
                              className="flex items-center gap-3"
                            >
                              <div className="flex items-center gap-1.5 w-24 shrink-0 group relative">
                                <span
                                  className="text-xs font-bold"
                                  style={{ color: "#607D8B" }}
                                >
                                  {dim.label}
                                </span>
                                <Info className="w-3 h-3 text-text-dark/30 cursor-help" />
                                
                                {/* Tooltip */}
                                <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-text-dark text-white text-[10px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl pointer-events-none">
                                  {dim.desc}
                                  <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-text-dark"></div>
                                </div>
                              </div>
                              <div
                                className="flex-1 h-1.5 rounded-full overflow-hidden"
                                style={{
                                  background: "var(--color-surface-alt)",
                                }}
                              >
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ background: dimColor }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${dim.value}%` }}
                                  transition={{
                                    duration: 0.8,
                                    ease: "easeOut",
                                    delay: 0.3,
                                  }}
                                />
                              </div>
                              <span
                                className="text-xs font-bold w-8 text-right shrink-0"
                                style={{ color: dimColor }}
                              >
                                {dim.value}
                              </span>
                            </div>
                          );
                        })}
                        <p
                          className="text-[10px] pt-2"
                          style={{ color: "#CFD8DC" }}
                        >
                          Skala 0–100 • Data survei &amp; kuis sekolah
                        </p>
                      </div>
                    </div>
                  )}
                </Section>

                {/* ── Section: Kuis ── */}
                <Section
                  id="kuis"
                  innerRef={(el) => {
                    sectionRefs.current["kuis"] = el;
                  }}
                >
                  <SectionHeader
                    icon={Brain}
                    label="Data Kuis Refleksi Digital"
                    badge={`${quizzes.length} peserta`}
                    delay={0.2}
                  />
                  {quizzes.length === 0 ? (
                    <EmptyState
                      icon={Brain}
                      msg="Belum ada peserta kuis dari sekolah ini."
                    />
                  ) : (
                    <div className="space-y-5">
                      {/* Stat cards */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            label: "Total Peserta",
                            val: quizzes.length,
                            color: "#a78bfa",
                            bg: "rgba(139,92,246,0.12)",
                            border: "rgba(139,92,246,0.22)",
                          },
                          {
                            label: "Champion",
                            val: championCount,
                            color: "#34d399",
                            bg: "rgba(16, 185, 129,0.12)",
                            border: "rgba(16, 185, 129,0.22)",
                          },
                          {
                            label: "Perlu Perhatian",
                            val: watchCount,
                            color: "#f87171",
                            bg: "rgba(239,68,68,0.10)",
                            border: "rgba(239,68,68,0.20)",
                          },
                        ].map(({ label, val, color, bg, border }) => (
                          <motion.div
                            key={label}
                            {...fade}
                            transition={{ duration: 0.4, delay: 0.22 }}
                            className="p-4 rounded-2xl text-center"
                            style={{
                              background: bg,
                              border: `1px solid ${border}`,
                            }}
                          >
                            <p
                              className="text-3xl font-black"
                              style={{ color }}
                            >
                              {val}
                            </p>
                            <p
                              className="text-[10px] font-black uppercase tracking-widest mt-1"
                              style={{ color: "#90A4AE" }}
                            >
                              {label}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Distribution */}
                      <div
                        className="p-4 rounded-2xl"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #ECEFF1",
                        }}
                      >
                        <p
                          className="text-[10px] font-black uppercase tracking-widest mb-4"
                          style={{ color: "#90A4AE" }}
                        >
                          Distribusi Kategori
                        </p>
                        <div className="space-y-3">
                          {Object.entries(quizCats).map(([cat, count]) => {
                            const cfg = getCatConfig(cat);
                            const pct = Math.round(
                              (count / quizzes.length) * 100,
                            );
                            return (
                              <div
                                key={cat}
                                className="flex items-center gap-3"
                              >
                                <div
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{
                                    background: cfg.color,
                                    boxShadow: `0 0 6px ${cfg.color}`,
                                  }}
                                />
                                <span
                                  className="text-sm font-semibold flex-1"
                                  style={{ color: "#607D8B" }}
                                >
                                  {cat}
                                </span>
                                <div className="flex items-center gap-3 w-36">
                                  <div
                                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                                    style={{
                                      background: "var(--color-surface-alt)",
                                    }}
                                  >
                                    <motion.div
                                      className="h-full rounded-full"
                                      style={{ background: cfg.color }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{
                                        duration: 0.8,
                                        ease: "easeOut",
                                        delay: 0.3,
                                      }}
                                    />
                                  </div>
                                  <span
                                    className="text-xs font-bold w-8 text-right"
                                    style={{ color: cfg.color }}
                                  >
                                    {count}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recent participants */}
                      <div>
                        <p
                          className="text-[10px] font-black uppercase tracking-widest mb-3"
                          style={{ color: "#90A4AE" }}
                        >
                          Peserta Terbaru
                        </p>
                        <div className="space-y-2">
                          {quizzes.slice(0, 5).map((q, i) => {
                            const cfg = getCatConfig(q.result_category);
                            return (
                              <motion.div
                                key={q.id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.35,
                                  delay: 0.25 + i * 0.05,
                                }}
                                className="p-3.5 rounded-xl transition-all duration-200"
                                style={{
                                  background: "#ffffff",
                                  border: "1px solid #ECEFF1",
                                }}
                                onMouseEnter={(e) => {
                                  Object.assign(
                                    (e.currentTarget as HTMLDivElement).style,
                                    {
                                      background: cfg.bg,
                                      borderColor: cfg.border,
                                    },
                                  );
                                }}
                                onMouseLeave={(e) => {
                                  Object.assign(
                                    (e.currentTarget as HTMLDivElement).style,
                                    {
                                      background: "#ffffff",
                                      borderColor: "#ECEFF1",
                                    },
                                  );
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                                    style={{
                                      background: cfg.bg,
                                      border: `1px solid ${cfg.border}`,
                                      color: cfg.color,
                                    }}
                                  >
                                    {(q.user_name || "?")[0].toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="text-sm font-bold truncate"
                                      style={{
                                        color: "var(--color-text-dark)",
                                      }}
                                    >
                                      {q.user_name || "Anonim"}
                                    </p>
                                    {q.qualification && (
                                      <p
                                        className="text-xs truncate"
                                        style={{ color: "#90A4AE" }}
                                      >
                                        {q.qualification}
                                      </p>
                                    )}
                                  </div>
                                  <span
                                    className="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0"
                                    style={{
                                      background: cfg.bg,
                                      border: `1px solid ${cfg.border}`,
                                      color: cfg.color,
                                    }}
                                  >
                                    {q.result_category}
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </Section>
              </div>

              {/* Right 1/3 — Sidebar */}
              <div className="flex flex-col gap-6">
                {/* ── Section: Rekomendasi ── */}
                <Section
                  id="rekomendasi"
                  innerRef={(el) => {
                    sectionRefs.current["rekomendasi"] = el;
                  }}
                  className="lg:sticky lg:top-24"
                >
                  <SectionHeader
                    icon={Zap}
                    label="Rekomendasi Aksi"
                    delay={0.2}
                  />
                  <div className="space-y-2.5 mb-5">
                    {recs.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
                        className="flex items-start gap-3 p-3.5 rounded-xl"
                        style={{
                          background: "rgba(46, 125, 50,0.06)",
                          border: "1px solid rgba(46, 125, 50,0.15)",
                        }}
                      >
                        <span className="mt-0.5 shrink-0">
                          <rec.icon className="w-5 h-5" color={rec.color} />
                        </span>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "#607D8B" }}
                        >
                          {rec.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick action buttons */}
                  <div className="space-y-2.5">
                    <a
                      href="/peta"
                      className="flex items-center justify-between p-3.5 rounded-xl group transition-all duration-200"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #ECEFF1",
                      }}
                      onMouseEnter={(e) =>
                        Object.assign(
                          (e.currentTarget as HTMLAnchorElement).style,
                          {
                            background: "var(--color-surface-alt)",
                            borderColor: "#CFD8DC",
                          },
                        )
                      }
                      onMouseLeave={(e) =>
                        Object.assign(
                          (e.currentTarget as HTMLAnchorElement).style,
                          { background: "#ffffff", borderColor: "#ECEFF1" },
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(96,165,250,0.15)" }}
                        >
                          <MapPin
                            className="w-4 h-4"
                            style={{ color: "#60a5fa" }}
                          />
                        </div>
                        <span
                          className="text-sm font-bold"
                          style={{ color: "#607D8B" }}
                        >
                          Lihat Peta Partisipasi
                        </span>
                      </div>
                      <ChevronRight
                        className="w-4 h-4"
                        style={{ color: "#90A4AE" }}
                      />
                    </a>

                    {school.status !== "komitmen" && (
                      <a
                        href="/komitmen"
                        className="flex items-center justify-center gap-2 p-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--color-info), var(--color-primary))",
                          boxShadow: "0 4px 24px rgba(46, 125, 50,0.35)",
                        }}
                        onMouseEnter={(e) =>
                          Object.assign(
                            (e.currentTarget as HTMLAnchorElement).style,
                            {
                              boxShadow: "0 6px 36px rgba(46, 125, 50,0.50)",
                              transform: "translateY(-1px)",
                            },
                          )
                        }
                        onMouseLeave={(e) =>
                          Object.assign(
                            (e.currentTarget as HTMLAnchorElement).style,
                            {
                              boxShadow: "0 4px 24px rgba(46, 125, 50,0.35)",
                              transform: "none",
                            },
                          )
                        }
                      >
                        <Target className="w-4 h-4" /> Ambil Komitmen{" "}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                    {school.status === "komitmen" && (
                      <div
                        className="flex items-center gap-3 p-3.5 rounded-xl"
                        style={{
                          background: "rgba(16, 185, 129, 0.15)",
                          border: "1px solid rgba(16, 185, 129,0.20)",
                        }}
                      >
                        <Award
                          className="w-5 h-5 shrink-0"
                          style={{ color: "#34d399" }}
                        />
                        <div>
                          <p
                            className="text-xs font-black"
                            style={{ color: "#34d399" }}
                          >
                            Komitmen Aktif
                          </p>
                          <p className="text-xs" style={{ color: "#90A4AE" }}>
                            Sekolah ini telah berkomitmen
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              </div>
            </div>
          </div>
        )}
      </main>

      <TourGuide
        pageName="Laporan"
        steps={[
          {
            element: "#profil",
            popover: {
              title: "Profil Sekolah",
              description: "Informasi detail terkait identitas dan status validasi sekolah Anda dalam sistem.",
            },
          },
          {
            element: "#survei",
            popover: {
              title: "Hasil Survei",
              description: "Melihat rekapitulasi jawaban dari kuesioner instansi yang telah diisi sebelumnya.",
            },
          },
          {
            element: "#dimensi",
            popover: {
              title: "Dimensi Kesiapan",
              description: "Radar chart yang memvisualisasikan 5 dimensi kesiapan digital sekolah Anda: Regulasi, Literasi, Kontrol, Siswa, dan Komitmen.",
            },
          },
          {
            element: "#kuis",
            popover: {
              title: "Statistik Kuis",
              description: "Menampilkan analisis agregat dari seluruh respons kuis refleksi individu.",
            },
          },
          {
            element: "#rekomendasi",
            popover: {
              title: "Rekomendasi Tindakan",
              description: "Saran strategis dan langkah aksi konkrit berdasarkan pengolahan data Anda.",
            },
          },
        ]}
      />
    </div>
  );
}

// ─── Reusable sub-components ──────────────────────────────────────────────────

function Section({
  id,
  innerRef,
  children,
  className = "",
}: {
  id: string;
  innerRef: (el: HTMLDivElement | null) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      id={id}
      ref={innerRef}
      className={`rounded-3xl p-5 sm:p-6 scroll-mt-24 ${className}`}
      style={{ background: "#ffffff", border: "1px solid #ECEFF1" }}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  label,
  badge,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  badge?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-2.5 mb-5"
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(46, 125, 50,0.12)" }}
      >
        <Icon className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
      </div>
      <h2
        className="text-base font-black"
        style={{ color: "var(--color-text-dark)" }}
      >
        {label}
      </h2>
      {badge && (
        <span
          className="ml-auto text-xs font-bold px-2.5 py-1 rounded-lg"
          style={{
            background: "#ffffff",
            border: "1px solid #ECEFF1",
            color: "#607D8B",
          }}
        >
          {badge}
        </span>
      )}
    </motion.div>
  );
}

function EmptyState({
  icon: Icon,
  msg,
}: {
  icon: React.ElementType;
  msg: string;
}) {
  return (
    <div className="text-center py-10">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
        style={{ background: "var(--color-surface-alt)" }}
      >
        <Icon className="w-6 h-6" style={{ color: "#CFD8DC" }} />
      </div>
      <p className="text-sm font-semibold" style={{ color: "#90A4AE" }}>
        {msg}
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-40 rounded-3xl" style={{ background: "#ffffff" }} />
      <div className="grid grid-cols-5 gap-3">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl"
              style={{ background: "#ffffff" }}
            />
          ))}
      </div>
      <div className="h-64 rounded-3xl" style={{ background: "#ffffff" }} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HasilPage() {
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SchoolData;
        timer = setTimeout(() => {
          setSchool(parsed);
          setChecked(true);
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch {
      /* ignore */
    }
    timer = setTimeout(() => setChecked(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!checked) return null;

  return (
    <AnimatePresence mode="wait">
      {school ? (
        <motion.div
          key="dash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard
            school={school}
            onLogout={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setSchool(null);
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoginGate onLogin={setSchool} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
