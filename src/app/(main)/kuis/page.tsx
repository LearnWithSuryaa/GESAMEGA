"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, notFound } from "next/navigation";
import { SchoolAutocomplete } from "@/components/SchoolAutocomplete";
import {
  Lightbulb,
  ArrowRight,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Zap,
  CheckCircle2,
  User,
  Loader2,
  ChevronRight,
  Sparkles,
  BookOpen,
  LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { TourGuide } from "@/components/TourGuide";
import { DriveStep } from "driver.js";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { Question } from "@/lib/repositories/quizRepository";

// ── Color config per result ───────────────────────────────────────────────────
const COLOR_CONFIG: Record<
  string,
  {
    icon: LucideIcon;
    gradient: string;
    softBg: string;
    iconColor: string;
    badge: string;
  }
> = {
  emerald: {
    icon: ShieldCheck,
    gradient: "from-emerald-500 to-teal-500",
    softBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
  },
  teal: {
    icon: ShieldCheck,
    gradient: "from-teal-500 to-emerald-500",
    softBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    badge: "bg-teal-500/10 text-teal-300 border border-teal-500/20",
  },
  amber: {
    icon: Zap,
    gradient: "from-amber-400 to-primary",
    softBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  },
  orange: {
    icon: Zap,
    gradient: "from-info to-red-500",
    softBg: "bg-primary/10",
    iconColor: "text-info",
    badge: "bg-primary/10 text-info-light border border-primary/20",
  },
  red: {
    icon: AlertTriangle,
    gradient: "from-red-500 to-rose-600",
    softBg: "bg-red-500/10",
    iconColor: "text-red-400",
    badge: "bg-red-500/10 text-red-300 border border-red-500/20",
  },
};

// ── Shared animation variants ─────────────────────────────────────────────────
const customEase = cubicBezier(0.22, 1, 0.36, 1);

const slideUp = {
  initial: { y: 24, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -16, opacity: 0 },
  transition: { duration: 0.35, ease: customEase },
};

const slideRight = {
  initial: { x: 40, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
  transition: { duration: 0.3, ease: customEase },
};

// ── Sub-components ────────────────────────────────────────────────────────────

/** Ambient background — shared across all states */
function Background() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute -top-32 right-0 w-160 h-160 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(46, 125, 50,0.09) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-120 h-120 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(30, 136, 229,0.05) 0%, transparent 65%)",
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

/** Consistent page header */
function PageHeader() {
  return (
    <motion.div
      className="text-center mb-10"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo pill */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
        style={{
          background: "rgba(46, 125, 50,0.1)",
          border: "1px solid rgba(46, 125, 50,0.2)",
        }}
      >
        <Lightbulb className="w-4 h-4 text-info" />
        <span className="text-[11px] font-bold text-info uppercase tracking-widest">
          Refleksi Digital Diri
        </span>
      </div>
      <h1
        className="text-3xl font-black text-text-dark mb-3 tracking-tight leading-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Kenali Dirimu di Era Digital
      </h1>
      <p className="text-text-dark/60 text-sm max-w-xs mx-auto leading-relaxed">
        Jawab jujur — hasilnya hanya untukmu dan data riset nasional.
      </p>
    </motion.div>
  );
}

/** Step indicator pills */
function StepIndicator({ step }: { step: number; total?: number }) {
  const steps = [
    { label: "Identitas", icon: User },
    { label: "Refleksi", icon: BookOpen },
    { label: "Hasil", icon: Sparkles },
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const active = i === step;
        const done = i < step;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300
              ${active ? "bg-primary text-white" : done ? "bg-primary/20 text-info" : "bg-black/5 text-text-dark/50"}`}
            >
              <Icon className="w-3 h-3" />
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight
                className={`w-3 h-3 ${done ? "text-primary/50" : "text-black/10"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Card shell */
function Card({
  children,
  className = "",
  id,
  overflow = "hidden",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  overflow?: "hidden" | "visible";
}) {
  return (
    <div
      id={id}
      className={`rounded-3xl ${overflow === "hidden" ? "overflow-hidden" : "overflow-visible"} ${className}`}
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );
}

/** Input field */
function InputField({
  id,
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  hint,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ElementType;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-bold text-text-dark/70 mb-2 ml-1 uppercase tracking-widest"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focused ? "text-info" : "text-text-dark/50"}`}
        />
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl outline-none transition-all duration-200 font-medium text-sm text-text-dark placeholder:text-text-dark/50"
          style={{
            background: focused ? "rgba(46, 125, 50,0.08)" : "#ffffff",
            border: `1px solid ${focused ? "rgba(46, 125, 50,0.4)" : "rgba(0,0,0,0.08)"}`,
            boxShadow: focused ? "0 0 0 3px rgba(46, 125, 50,0.08)" : "none",
          }}
        />
      </div>
      {hint && (
        <p className="text-[11px] text-text-dark/50 mt-1.5 ml-1">{hint}</p>
      )}
    </div>
  );
}

interface QuizResultData {
  totalScore: number;
  category: string;
  result_category?: string;
  indicator_color: string;
  description: string;
  motivation_message: string;
  qualification?: string;
}

interface QuizAnswerItem {
  question_id: number;
  option_id: number;
  score: number;
}

// ── Main form component ───────────────────────────────────────────────────────
function KuisForm() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || undefined;
  if (!source) notFound();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerItem[]>([]);
  const [result, setResult] = useState<QuizResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [userName, setUserName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [schoolError, setSchoolError] = useState("");
  const [hasCompleted, setHasCompleted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("kuis_completed") === "true"
    ) {
      setHasCompleted(true);
    }
    async function loadQuestions() {
      try {
        const res = await fetch("/api/questions?category=Kuis%20Siswa");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          setQuestions(json.data);
        } else {
          setLoadError("Pertanyaan kuis tidak ditemukan. Hubungi admin.");
        }
      } catch {
        setLoadError("Gagal memuat pertanyaan. Periksa koneksi internet Anda.");
      } finally {
        setLoadingQuestions(false);
      }
    }
    loadQuestions();
  }, []);

  const handleStartQuiz = () => {
    if (!schoolId) {
      setSchoolError("Pilih sekolah dari daftar yang tersedia.");
      return;
    }
    setSchoolError("");
    setIsStarted(true);
  };

  const handleAnswer = (
    questionId: number,
    optionId: number,
    score: number,
    idx: number,
  ) => {
    setSelectedIdx(idx);
    setTimeout(() => {
      const newAnswers = [
        ...answers,
        { question_id: questionId, option_id: optionId, score },
      ];
      setSelectedIdx(null);
      if (newAnswers.length < questions.length) {
        setAnswers(newAnswers);
        setCurrentQuestion(currentQuestion + 1);
      } else {
        finishQuiz(newAnswers);
      }
    }, 380);
  };

  const finishQuiz = async (finalAnswers: QuizAnswerItem[]) => {
    setAnswers(finalAnswers);
    setLoading(true);
    setSubmitError(null);
    let captchaToken = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (executeRecaptcha) {
          captchaToken = await executeRecaptcha("kuis_submit");
          if (captchaToken) break;
        } else {
          await new Promise((r) => setTimeout(r, 500));
        }
      } catch {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    try {
      const res = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: userName,
          school_id: schoolId,
          answers: finalAnswers,
          source,
          captchaToken,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
        if (typeof window !== "undefined")
          localStorage.setItem("kuis_completed", "true");
      } else {
        setSubmitError(
          json.error === "Token reCAPTCHA tidak ditemukan."
            ? "Verifikasi keamanan gagal. Pastikan koneksi internet Anda stabil dan coba lagi."
            : json.error || "Gagal menyimpan hasil. Silakan coba lagi.",
        );
      }
    } catch {
      setSubmitError(
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  const progress =
    questions.length > 0 ? (currentQuestion / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 pb-20 px-4 relative overflow-hidden">
      <Background />

      <div className="w-full max-w-xl relative z-10">
        <PageHeader />

        <AnimatePresence mode="wait">
          {/* ── LOADING INIT ── */}
          {loadingQuestions && (
            <motion.div key="loading-init" {...slideUp}>
              <Card className="p-16 text-center flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-info animate-spin" />
                  </div>
                </div>
                <div>
                  <p className="text-text-dark/80 font-semibold text-sm">
                    Memuat pertanyaan kuis...
                  </p>
                  <p className="text-text-dark/50 text-xs mt-1">Sebentar ya</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── LOAD ERROR ── */}
          {!loadingQuestions && loadError && (
            <motion.div key="load-error" {...slideUp}>
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-black text-text-dark mb-2">
                  Gagal Memuat
                </h2>
                <p className="text-text-dark/60 text-sm mb-6 max-w-xs mx-auto">
                  {loadError}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-primary hover:bg-info text-white font-bold rounded-2xl transition-colors text-sm"
                >
                  Coba Lagi
                </button>
              </Card>
            </motion.div>
          )}

          {/* ── SUBMITTING / SUBMIT ERROR ── */}
          {!loadingQuestions && (loading || submitError) && !result && (
            <motion.div key="submitting" {...slideUp}>
              <Card className="p-16 text-center">
                {submitError ? (
                  <>
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-xl font-black text-text-dark mb-2">
                      Gagal Menyimpan
                    </h2>
                    <p className="text-text-dark/60 text-sm max-w-xs mx-auto mb-6">
                      {submitError}
                    </p>
                    <button
                      onClick={() => {
                        setSubmitError(null);
                        finishQuiz(answers);
                      }}
                      className="px-6 py-3 bg-primary hover:bg-info text-white font-bold rounded-2xl transition-colors text-sm"
                    >
                      Coba Lagi
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-5">
                    {/* Animated analyzing indicator */}
                    <div className="relative w-20 h-20">
                      <div
                        className="absolute inset-0 rounded-full bg-primary/10 animate-ping"
                        style={{ animationDuration: "1.5s" }}
                      />
                      <div
                        className="absolute inset-0 rounded-full bg-primary/5 animate-ping"
                        style={{
                          animationDuration: "2s",
                          animationDelay: "0.3s",
                        }}
                      />
                      <div className="relative w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
                        <Flame className="w-9 h-9 text-info animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <p className="text-text-dark/80 font-bold text-base">
                        Menganalisis profil digital Anda...
                      </p>
                      <p className="text-text-dark/50 text-xs mt-1 text-center">
                        Memverifikasi keamanan · Harap tunggu
                      </p>
                    </div>
                    {/* Progress dots */}
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-info animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {!loadingQuestions &&
            !loading &&
            result &&
            (() => {
              const cfg =
                COLOR_CONFIG[result.indicator_color] || COLOR_CONFIG.emerald;
              const ResultIcon = cfg.icon;
              return (
                <motion.div key="result" {...slideRight} className="space-y-4">
                  <StepIndicator step={2} total={3} />

                  {/* Main result card */}
                  <Card id="quiz-result-card">
                    {/* Gradient accent top bar */}
                    <div
                      className={`h-1.5 w-full bg-linear-to-r ${cfg.gradient}`}
                    />

                    <div className="p-8 text-center">
                      {/* Icon circle with soft glow */}
                      <div
                        className={`w-20 h-20 ${cfg.softBg} rounded-full flex items-center justify-center mx-auto mb-5`}
                      >
                        <ResultIcon className={`w-10 h-10 ${cfg.iconColor}`} />
                      </div>

                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-4 ${cfg.badge}`}
                      >
                        Skor: {result.totalScore} / {questions.length * 3}
                      </span>

                      <h2
                        className="text-2xl font-black text-text-dark mb-3 tracking-tight"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {result.category}
                      </h2>

                      <p className="text-text-dark/70 text-sm max-w-sm mx-auto leading-relaxed mb-5">
                        &ldquo;{result.description}&rdquo;
                      </p>

                      {result.motivation_message && (
                        <div className="inline-block bg-primary/10 border border-primary/20 rounded-2xl px-5 py-3 mb-6">
                          <p className="text-info-light text-sm font-semibold leading-relaxed">
                            {result.motivation_message}
                          </p>
                        </div>
                      )}

                      {/* Score meter */}
                      <div className="max-w-70 mx-auto">
                        <div className="flex justify-between text-[10px] font-bold text-text-dark/50 mb-2 uppercase tracking-widest">
                          <span>Kritis</span>
                          <span>Bijak</span>
                        </div>
                        <div
                          className="w-full h-2 rounded-full overflow-hidden"
                          style={{ background: "rgba(0,0,0,0.06)" }}
                        >
                          <motion.div
                            className={`h-full rounded-full bg-linear-to-r ${cfg.gradient}`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(result.totalScore / (questions.length * 3)) * 100}%`,
                            }}
                            transition={{
                              duration: 1,
                              ease: "easeOut",
                              delay: 0.4,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Action steps */}
                  <Card className="p-6" id="quiz-action-steps">
                    <h3 className="text-sm font-black text-text-dark mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-info" />
                      Langkah Aksi
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Terapkan prinsip mindfulness setiap kali memegang perangkat digital.",
                        "Beri batas waktu (screen-time limit) pada aplikasi non-produktif.",
                        "Diskusikan hasil ini dengan teman atau guru di sekolahmu.",
                      ].map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary/15 text-info font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-text-dark/70 leading-relaxed">
                            {tip}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  {/* CTA */}
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="w-full py-4 rounded-2xl text-text-dark/70 text-sm font-bold border border-black/6 hover:bg-black/4 hover:text-text-dark/80 transition-all"
                  >
                    Kembali ke Beranda
                  </button>
                </motion.div>
              );
            })()}

          {/* ── ALREADY COMPLETED ── */}
          {!loadingQuestions &&
            !loadError &&
            !loading &&
            !result &&
            hasCompleted && (
              <motion.div key="completed" {...slideUp}>
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-black text-text-dark mb-3">
                    Sudah Mengisi
                  </h2>
                  <p className="text-text-dark/60 text-sm max-w-xs mx-auto leading-relaxed mb-8">
                    Setiap perangkat hanya dapat mengisi kuis satu kali untuk
                    menjaga integritas data riset nasional.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="w-full py-3.5 bg-primary hover:bg-info text-white font-bold rounded-2xl transition-colors text-sm"
                  >
                    Kembali ke Beranda
                  </button>
                </Card>
              </motion.div>
            )}

          {/* ── REGISTRATION ── */}
          {!loadingQuestions &&
            !loadError &&
            !loading &&
            !result &&
            !isStarted &&
            !hasCompleted && (
              <motion.div key="registration" {...slideUp}>
                <StepIndicator step={0} total={3} />
                <Card id="registration-card" className="p-8" overflow="visible">
                  {/* Card header */}
                  <div className="mb-7">
                    <h2
                      className="text-xl font-black text-text-dark mb-1.5"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Siapa Anda hari ini?
                    </h2>
                    <p className="text-text-dark/60 text-sm">
                      Isi data singkat untuk memulai refleksi.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <InputField
                      id="input-name"
                      label="Nama Lengkap"
                      placeholder="cth. Budi Santoso"
                      value={userName}
                      onChange={setUserName}
                      icon={User}
                      hint="Digunakan untuk personalisasi hasil kuis."
                    />

                    <div id="input-school">
                      <label className="block text-xs font-bold text-text-dark/70 mb-2 ml-1 uppercase tracking-widest">
                        Asal Sekolah
                      </label>
                      <SchoolAutocomplete
                        value={schoolName}
                        onChange={(val, school) => {
                          setSchoolName(val);
                          setSchoolId(school?.id ?? null);
                          if (school) setSchoolError("");
                        }}
                        hasError={!!schoolError}
                      />
                      {schoolError ? (
                        <p className="text-red-400 text-xs mt-2 ml-1 font-medium">
                          {schoolError}
                        </p>
                      ) : (
                        <p className="text-[11px] text-text-dark/50 mt-1.5 ml-1">
                          Pilih dari daftar yang muncul.
                        </p>
                      )}
                    </div>

                    {/* Start button — only active when both fields are filled */}
                    <motion.button
                      id="btn-start-quiz"
                      onClick={handleStartQuiz}
                      disabled={!userName.trim() || !schoolId}
                      whileHover={userName.trim() && schoolId ? { y: -1 } : {}}
                      whileTap={
                        userName.trim() && schoolId ? { scale: 0.98 } : {}
                      }
                      className="relative w-full py-4 rounded-2xl text-white text-sm font-black tracking-wide flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden disabled:cursor-not-allowed"
                      style={{
                        background:
                          userName.trim() && schoolId
                            ? "linear-gradient(135deg, #2E7D32, #66BB6A)"
                            : "#f1f5f9",
                        boxShadow:
                          userName.trim() && schoolId
                            ? "0 8px 24px rgba(46, 125, 50,0.3)"
                            : "none",
                        border:
                          userName.trim() && schoolId
                            ? "none"
                            : "1px solid rgba(0,0,0,0.08)",
                        color:
                          userName.trim() && schoolId
                            ? "white"
                            : "rgba(55, 71, 79, 0.4)",
                      }}
                    >
                      {/* Shimmer on active */}
                      {userName.trim() && schoolId && (
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                            x: "-100%",
                          }}
                          animate={{ x: ["−100%", "200%"] }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        />
                      )}
                      <span className="relative">Mulai Kuis</span>
                      <ArrowRight className="w-4 h-4 relative" />
                    </motion.button>
                  </div>
                </Card>

                {/* Trust signal */}
                <p className="text-center text-[11px] text-text-dark/50 mt-5 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Data dilindungi dan tidak diperjualbelikan
                </p>
              </motion.div>
            )}

          {/* ── QUIZ ── */}
          {!loadingQuestions &&
            !loadError &&
            !loading &&
            !result &&
            isStarted &&
            questions.length > 0 && (
              <motion.div key={`question-${currentQuestion}`} {...slideRight}>
                <StepIndicator step={1} total={3} />

                {/* Progress bar section */}
                <div className="mb-6" id="quiz-progress">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold text-info bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">
                      {currentQuestion + 1} / {questions.length}
                    </span>
                    <span className="text-[11px] font-bold text-text-dark/50 tabular-nums">
                      {Math.round(progress)}% selesai
                    </span>
                  </div>
                  {/* Segmented progress */}
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-1 flex-1 rounded-full"
                        style={{
                          background:
                            i < currentQuestion
                              ? "#2E7D32"
                              : i === currentQuestion
                                ? "rgba(46, 125, 50,0.4)"
                                : "rgba(0,0,0,0.06)",
                        }}
                        animate={
                          i === currentQuestion
                            ? { opacity: [0.4, 1, 0.4] }
                            : {}
                        }
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>

                {/* Question card */}
                <Card id="quiz-question-card" className="p-8">
                  {/* Question number eyebrow */}
                  <p className="text-[11px] font-bold text-text-dark/50 uppercase tracking-widest mb-4">
                    Pertanyaan {currentQuestion + 1}
                  </p>
                  <h2
                    className="text-xl font-black text-text-dark leading-snug mb-7"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {questions[currentQuestion].question_text}
                  </h2>

                  {/* Answer options */}
                  <div className="space-y-2.5">
                    {questions[currentQuestion].question_options.map(
                      (opt, idx: number) => {
                        const isSelected = selectedIdx === idx;
                        const isDimmed = selectedIdx !== null && !isSelected;
                        return (
                          <motion.button
                            key={opt.id}
                            onClick={() =>
                              handleAnswer(
                                questions[currentQuestion].id,
                                opt.id,
                                opt.score,
                                idx,
                              )
                            }
                            disabled={selectedIdx !== null}
                            whileHover={selectedIdx === null ? { x: 4 } : {}}
                            whileTap={
                              selectedIdx === null ? { scale: 0.985 } : {}
                            }
                            className="w-full text-left flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group"
                            style={{
                              background: isSelected
                                ? "rgba(46, 125, 50,0.12)"
                                : "#f8fafc",
                              border: isSelected
                                ? "1px solid rgba(46, 125, 50,0.4)"
                                : "1px solid rgba(0,0,0,0.08)",
                              opacity: isDimmed ? 0.35 : 1,
                              boxShadow: isSelected
                                ? "0 0 0 3px rgba(46, 125, 50,0.08)"
                                : "none",
                            }}
                          >
                            {/* Radio dot */}
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200
                          ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-black/20 group-hover:border-info/50"
                          }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span
                              className={`text-sm leading-snug font-medium transition-colors duration-200
                          ${isSelected ? "text-primary-soft" : "text-text-dark/80 group-hover:text-text-dark/90"}`}
                            >
                              {opt.option_text}
                            </span>
                          </motion.button>
                        );
                      },
                    )}
                  </div>
                </Card>

                {/* Helper text */}
                <p className="text-center text-[11px] text-text-dark/50 mt-5">
                  Pilih jawaban yang paling menggambarkan dirimu sehari-hari
                </p>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Contextual tour steps based on current active screen */}
      {(() => {
        let currentSteps: DriveStep[] = [];
        if (result) {
          currentSteps = [
            {
              element: "#quiz-result-card",
              popover: {
                title: "Hasil Profil Refleksi",
                description:
                  "Analisis kecenderungan gaya hidup digital Anda berdasarkan jawaban yang telah dianalisis.",
                side: "top",
                align: "center",
              },
            },
            {
              element: "#quiz-action-steps",
              popover: {
                title: "Rekomendasi Langkah Aksi",
                description:
                  "Tips dan tindakan praktis yang dirancang khusus untuk membangun kebiasaan digital yang lebih sehat.",
                side: "top",
                align: "center",
              },
            },
          ];
        } else if (isStarted) {
          currentSteps = [
            {
              element: "#quiz-progress",
              popover: {
                title: "Indikator Progres Soal",
                description:
                  "Menampilkan nomor soal yang sedang aktif dan persentase kelengkapan refleksi Anda.",
                side: "bottom",
                align: "start",
              },
            },
            {
              element: "#quiz-question-card",
              popover: {
                title: "Pertanyaan Refleksi",
                description:
                  "Pilihlah salah satu opsi jawaban yang paling menggambarkan kebiasaan digital harian Anda secara jujur.",
                side: "top",
                align: "center",
              },
            },
          ];
        } else {
          currentSteps = [
            {
              element: "#registration-card",
              popover: {
                title: "Selamat Datang!",
                description:
                  "Lengkapi identitas singkat Anda sebelum memulai kuis refleksi kebiasaan digital.",
                side: "bottom",
                align: "start",
              },
            },
            {
              element: "#input-name",
              popover: {
                title: "Nama Pengisi",
                description:
                  "Masukkan nama lengkap Anda agar hasil refleksi dan sertifikat lebih personal.",
                side: "bottom",
                align: "start",
              },
            },
            {
              element: "#input-school",
              popover: {
                title: "Asal Sekolah",
                description:
                  "Pilih sekolah Anda di Sidoarjo untuk pencatatan ekosistem digital.",
                side: "bottom",
                align: "start",
              },
            },
            {
              element: "#btn-start-quiz",
              popover: {
                title: "Mulai Kuis",
                description:
                  "Tombol ini akan aktif setelah nama dan sekolah dipilih. Klik untuk masuk ke pertanyaan refleksi.",
                side: "top",
                align: "center",
              },
            },
          ];
        }

        return <TourGuide steps={currentSteps} pageName="Kuis Refleksi" />;
      })()}
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function KuisPage() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      language="id"
    >
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-surface">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <KuisForm />
      </Suspense>
    </GoogleReCaptchaProvider>
  );
}
