"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Download,
  Plus,
  Trash2,
  QrCode,
  Users,
  ExternalLink,
  Copy,
  CheckCheck,
  BarChart3,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QRCampaign {
  id: string;
  name: string;
  source: string;
  created_at: string;
  participantCount: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export default function QRGeneratorPage() {
  const [campaigns, setCampaigns] = useState<QRCampaign[]>([]);
  const [campaignName, setCampaignName] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const qrRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/qr-stats");
      const json = await res.json();
      if (json.success) {
        setCampaigns(json.data);
        if (json.data.length > 0) {
          setSelectedId((prev) => prev ?? json.data[0].id);
        }
      } else {
        setFetchError(json.error || "Gagal memuat data kampanye.");
      }
    } catch (e) {
      setFetchError("Tidak dapat terhubung ke server. Coba reload halaman.");
      console.error("Failed to fetch campaigns", e);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async () => {
    if (!campaignName.trim()) return;
    setCreating(true);
    setCreateError(null);
    const slug = slugify(campaignName);
    try {
      const res = await fetch("/api/admin/qr-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: campaignName.trim(), source: slug }),
      });
      const json = await res.json();
      if (json.success) {
        setCampaignName("");
        await fetchCampaigns();
        setSelectedId(json.data.id);
      } else {
        setCreateError(json.error || "Gagal membuat kampanye.");
      }
    } catch (e) {
      setCreateError("Tidak dapat terhubung ke server.");
      console.error("Failed to create campaign", e);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kampanye ini? Tindakan tidak dapat dibatalkan."))
      return;
    try {
      const res = await fetch(`/api/admin/qr-campaigns?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        const remaining = campaigns.filter((c) => c.id !== id);
        setCampaigns(remaining);
        if (selectedId === id) {
          setSelectedId(remaining[0]?.id || null);
        }
      } else {
        alert("Gagal menghapus: " + (json.error || "Unknown error"));
      }
    } catch (e) {
      alert("Gagal menghapus kampanye.");
      console.error("Failed to delete", e);
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadQR = (campaign: QRCampaign) => {
    const container = qrRefs.current[campaign.id];
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) return;

    // Resolusi tinggi proporsional (cocok untuk cetak standee A4/A5)
    const W = 720;
    const H = 940;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Helper: Rounded Rectangle
    const drawRoundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
      fill = true,
      stroke = false
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    };

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(blob);
    const qrImg = new Image();

    qrImg.onload = () => {
      // 1. Background dasar putih bersih (hemat tinta & resmi)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, W, H);

      // 2. Outer Border Frame halus
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1.5;
      drawRoundRect(24, 24, W - 48, H - 48, 28, false, true);

      // 3. Top Accent Bar (Gradien Hijau-ke-Biru GESAMEGA)
      const barGrad = ctx.createLinearGradient(40, 28, W - 40, 28);
      barGrad.addColorStop(0, "#2E7D32");
      barGrad.addColorStop(1, "#1E88E5");
      ctx.fillStyle = barGrad;
      drawRoundRect(40, 28, W - 80, 6, 3, true, false);

      // 4. Header Badge Kategori
      const badgeY = 56;
      const pillW = 240;
      const pillH = 30;
      const pillX = (W - pillW) / 2;
      ctx.fillStyle = "#F1F8E9";
      ctx.strokeStyle = "#C8E6C9";
      ctx.lineWidth = 1;
      drawRoundRect(pillX, badgeY, pillW, pillH, 15, true, true);

      ctx.fillStyle = "#2E7D32";
      ctx.font = "bold 10.5px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("PORTAL REFLEKSI DIGITAL SISWA", W / 2, badgeY + pillH / 2);

      // 5. Nama Gerakan & Subtitle
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 30px system-ui, -apple-system, sans-serif";
      ctx.fillText("GESAMEGA", W / 2, badgeY + 58);

      ctx.fillStyle = "#64748B";
      ctx.font = "500 12.5px system-ui, -apple-system, sans-serif";
      ctx.fillText("Gerakan Sekolah Bijak Mengelola Gadget", W / 2, badgeY + 82);

      // Divider halus
      ctx.strokeStyle = "#F1F5F9";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, badgeY + 104);
      ctx.lineTo(W - 60, badgeY + 104);
      ctx.stroke();

      // 6. Sasaran Kampanye / Sekolah
      const campY = badgeY + 124;
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 10px system-ui, -apple-system, sans-serif";
      ctx.fillText("TARGET KAMPANYE", W / 2, campY);

      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
      let displayName = campaign.name;
      while (ctx.measureText(displayName).width > W - 120 && displayName.length > 4) {
        displayName = displayName.slice(0, -1);
      }
      if (displayName !== campaign.name) displayName += "…";
      ctx.fillText(displayName, W / 2, campY + 26);

      // Source Tag Pill
      const sourceTag = `Kode Ref: #${campaign.source}`;
      ctx.font = "500 11.5px system-ui, -apple-system, sans-serif";
      const tagTW = ctx.measureText(sourceTag).width;
      const tagW = tagTW + 24;
      const tagH = 26;
      const tagX = (W - tagW) / 2;
      const tagY = campY + 38;
      ctx.fillStyle = "#F8FAFC";
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;
      drawRoundRect(tagX, tagY, tagW, tagH, 13, true, true);

      ctx.fillStyle = "#475569";
      ctx.fillText(sourceTag, W / 2, tagY + tagH / 2);

      // 7. White Card Container untuk QR Code
      const cardW = 320;
      const cardH = 320;
      const cardX = (W - cardW) / 2;
      const cardY = tagY + 44;
      const cardR = 20;

      // Soft drop shadow
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.05)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;
      drawRoundRect(cardX, cardY, cardW, cardH, cardR, true, true);
      ctx.restore();

      // Gambar QR Code
      const qrPad = 25;
      const qrSize = cardW - qrPad * 2;
      ctx.drawImage(qrImg, cardX + qrPad, cardY + qrPad, qrSize, qrSize);

      // Frame Siku Bidik Kamera (Camera Corner Brackets) warna hijau
      const cs = 16;
      const cPad = 12;
      ctx.strokeStyle = "#2E7D32";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(cardX + cPad, cardY + cPad + cs);
      ctx.lineTo(cardX + cPad, cardY + cPad);
      ctx.lineTo(cardX + cPad + cs, cardY + cPad);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(cardX + cardW - cPad - cs, cardY + cPad);
      ctx.lineTo(cardX + cardW - cPad, cardY + cPad);
      ctx.lineTo(cardX + cardW - cPad, cardY + cPad + cs);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(cardX + cPad, cardY + cardH - cPad - cs);
      ctx.lineTo(cardX + cPad, cardY + cardH - cPad);
      ctx.lineTo(cardX + cPad + cs, cardY + cardH - cPad);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(cardX + cardW - cPad - cs, cardY + cardH - cPad);
      ctx.lineTo(cardX + cardW - cPad, cardY + cardH - cPad);
      ctx.lineTo(cardX + cardW - cPad, cardY + cardH - cPad - cs);
      ctx.stroke();

      // Sub-label scan
      ctx.fillStyle = "#64748B";
      ctx.font = "500 12px system-ui, -apple-system, sans-serif";
      ctx.fillText("Pindai dengan kamera HP atau aplikasi pemindai QR", W / 2, cardY + cardH + 26);

      // 8. Panduan 3 Langkah Cepat
      const guideW = 560;
      const guideH = 68;
      const guideX = (W - guideW) / 2;
      const guideY = cardY + cardH + 46;
      ctx.fillStyle = "#F8FAFC";
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;
      drawRoundRect(guideX, guideY, guideW, guideH, 16, true, true);

      const colW = guideW / 3;
      const stepsData = [
        { num: "1", title: "Buka Kamera", sub: "Ponsel / Scanner", bg: "#E8F5E9", fg: "#2E7D32" },
        { num: "2", title: "Arahkan ke QR", sub: "Fokuskan layar", bg: "#E3F2FD", fg: "#1E88E5" },
        { num: "3", title: "Isi Refleksi", sub: "Hanya ±3 menit", bg: "#E8F5E9", fg: "#2E7D32" },
      ];

      stepsData.forEach((st, i) => {
        const cx = guideX + colW * i + colW / 2;
        // Bullet circle
        const circleR = 11;
        const cy = guideY + 24;
        ctx.fillStyle = st.bg;
        ctx.beginPath();
        ctx.arc(cx - 38, cy + 8, circleR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = st.fg;
        ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
        ctx.fillText(st.num, cx - 38, cy + 9);

        // Texts
        ctx.textAlign = "left";
        ctx.fillStyle = "#1E293B";
        ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
        ctx.fillText(st.title, cx - 20, cy + 4);

        ctx.fillStyle = "#64748B";
        ctx.font = "10px system-ui, -apple-system, sans-serif";
        ctx.fillText(st.sub, cx - 20, cy + 18);
        ctx.textAlign = "center";
      });

      // 9. Official Footer
      const footerY = guideY + guideH + 34;
      ctx.strokeStyle = "#F1F5F9";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, footerY);
      ctx.lineTo(W - 60, footerY);
      ctx.stroke();

      ctx.fillStyle = "#2E7D32";
      ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
      ctx.fillText("gesamega.web.id", W / 2, footerY + 22);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "10.5px system-ui, -apple-system, sans-serif";
      ctx.fillText("Inisiatif Budaya Digital Sehat — Kabupaten Sidoarjo, Jawa Timur", W / 2, footerY + 38);

      // Download
      URL.revokeObjectURL(svgUrl);
      const link = document.createElement("a");
      link.download = `qr-kuis-${campaign.source}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    qrImg.src = svgUrl;
  };

  const selected = campaigns.find((c) => c.id === selectedId);

  // ── TABLE NOT FOUND error banner ──────────────────────────────────
  const isTableMissing =
    fetchError?.toLowerCase().includes("does not exist") ||
    createError?.toLowerCase().includes("does not exist") ||
    fetchError?.toLowerCase().includes("relation") ||
    createError?.toLowerCase().includes("relation");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <QrCode className="w-8 h-8 text-primary" />
          QR Code Generator
        </h1>
        <p className="text-gray-500 mt-2">
          Buat QR Code per event atau sekolah. Lacak berapa siswa yang mengisi
          kuis dari masing-masing QR.
        </p>
      </div>

      {/* ── Setup Required Banner ── */}
      {(isTableMissing || fetchError || createError) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-amber-800 mb-1">
                {isTableMissing
                  ? "Setup Database Diperlukan"
                  : "Terjadi Kesalahan"}
              </p>
              <p className="text-sm text-amber-700 mb-3">
                {isTableMissing
                  ? "Tabel qr_campaigns belum ada di Supabase. Jalankan SQL berikut di Supabase → SQL Editor:"
                  : fetchError || createError}
              </p>
              <button
                onClick={fetchCampaigns}
                className="mt-3 text-sm font-semibold text-amber-700 underline hover:text-amber-900"
              >
                Coba muat ulang
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Campaign List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Create Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
              Buat Kampanye Baru
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Nama event / sekolah..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 focus:border-info focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
              <button
                onClick={handleCreate}
                disabled={!campaignName.trim() || creating}
                className="w-10 h-10 rounded-xl bg-primary hover:bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            </div>
            {createError && !isTableMissing && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {createError}
              </p>
            )}
          </div>

          {/* Campaigns List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Kampanye Aktif
              </h2>
              <span className="text-xs text-gray-400 font-medium">
                {campaigns.length} kampanye
              </span>
            </div>

            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-6 h-6 text-info animate-spin" />
              </div>
            ) : campaigns.length === 0 && !fetchError ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                Belum ada kampanye. Buat satu di atas!
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {campaigns.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedId(c.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all cursor-pointer ${
                      selectedId === c.id ? "bg-surface-alt" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p
                        className={`text-sm font-bold truncate ${
                          selectedId === c.id
                            ? "text-text-dark"
                            : "text-gray-800"
                        }`}
                      >
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        source: {c.source}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                        <Users className="w-3 h-3" />
                        {c.participantCount}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(c.id);
                        }}
                        className="w-7 h-7 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: QR Preview */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* QR Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* QR Code Preview */}
                    <div
                      className="bg-white border-2 border-gray-100 rounded-2xl p-5 flex items-center justify-center shrink-0"
                      ref={(el) => {
                        qrRefs.current[selected.id] = el;
                      }}
                    >
                      <QRCodeSVG
                        value={`${baseUrl}/kuis?source=${selected.source}`}
                        size={200}
                        fgColor="#1f2937"
                        bgColor="#ffffff"
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-5 w-full">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Nama Kampanye
                        </p>
                        <h2 className="text-2xl font-extrabold text-gray-900">
                          {selected.name}
                        </h2>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                          URL Tracking
                        </p>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                          <code className="text-xs text-gray-600 flex-1 truncate">
                            {baseUrl}/kuis?source={selected.source}
                          </code>
                          <button
                            onClick={() =>
                              handleCopyLink(
                                `${baseUrl}/kuis?source=${selected.source}`,
                                selected.id,
                              )
                            }
                            className="text-gray-400 hover:text-primary transition-colors shrink-0"
                          >
                            {copied === selected.id ? (
                              <CheckCheck className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          onClick={() => handleDownloadQR(selected)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary text-white text-sm font-bold rounded-xl transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download PNG
                        </button>
                        <a
                          href={`${baseUrl}/kuis?source=${selected.source}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Buka Link
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                    <h3 className="text-base font-bold text-gray-900">
                      Statistik Kampanye
                    </h3>
                    <button
                      onClick={fetchCampaigns}
                      className="ml-auto text-xs text-gray-400 hover:text-primary transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-alt rounded-xl p-4 border border-surface-alt">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                        Total Peserta
                      </p>
                      <p className="text-3xl font-extrabold text-text-dark">
                        {selected.participantCount}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Source ID
                      </p>
                      <p className="text-xl font-bold text-gray-700 break-all">
                        {selected.source}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : !loading && !fetchError ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border-2 border-dashed border-gray-200 h-64 flex flex-col items-center justify-center text-center p-8"
              >
                <QrCode className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-gray-400 font-medium">
                  Buat atau pilih kampanye untuk melihat QR Code.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
