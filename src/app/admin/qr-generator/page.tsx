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

    const W = 600;
    const H = 760;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(blob);
    const qrImg = new Image();

    qrImg.onload = () => {
      // 1. Background gradient
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#1c0a00");
      bg.addColorStop(0.5, "#3d1200");
      bg.addColorStop(1, "#1a0800");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // 2. Abstract glowing blobs
      const drawBlob = (
        x: number,
        y: number,
        r: number,
        color: string,
        alpha: number,
      ) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawBlob(80, 80, 220, "#2E7D32", 0.35);
      drawBlob(W - 60, 100, 180, "#64B5F6", 0.25);
      drawBlob(W - 40, H - 80, 200, "#2E7D32", 0.3);
      drawBlob(50, H - 60, 160, "#1E88E5", 0.2);
      drawBlob(W / 2, H / 2, 260, "#A5D6A7", 0.15);

      // 3. Dot grid
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = "#64B5F6";
      for (let x = 20; x < W; x += 28) {
        for (let y = 20; y < H; y += 28) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 4. Wavy abstract lines
      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.strokeStyle = "#64B5F6";
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const y = 40 + i * 100;
        ctx.beginPath();
        ctx.moveTo(0, y + 30);
        ctx.bezierCurveTo(W * 0.3, y - 20, W * 0.7, y + 60, W, y + 10);
        ctx.stroke();
      }
      ctx.restore();

      // 5. GESAMEGA top badge
      const badgeY = 44;
      const pillW = 200;
      const pillH = 38;
      const pillX = (W - pillW) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pillX, badgeY, pillW, pillH, 19);
      ctx.fillStyle = "rgba(46, 125, 50,0.15)";
      ctx.fill();
      ctx.strokeStyle = "rgba(46, 125, 50,0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#64B5F6";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✦  GESAMEGA  ✦", W / 2, badgeY + pillH / 2);
      ctx.restore();

      // 6. White QR card
      const cardW = 300;
      const cardH = 300;
      const cardX = (W - cardW) / 2;
      const cardY = 106;
      const cardR = 24;

      ctx.save();
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 50;
      ctx.shadowOffsetY = 16;
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.clip();
      const qrPad = 28;
      ctx.drawImage(
        qrImg,
        cardX + qrPad,
        cardY + qrPad,
        cardW - qrPad * 2,
        cardH - qrPad * 2,
      );
      ctx.restore();

      // Orange corner accents on card
      ctx.save();
      ctx.fillStyle = "#2E7D32";
      ctx.globalAlpha = 0.85;
      const as = 18;
      // top-left corner
      ctx.beginPath();
      ctx.moveTo(cardX, cardY + cardR);
      ctx.arcTo(cardX, cardY, cardX + cardR, cardY, cardR);
      ctx.lineTo(cardX + as + cardR, cardY);
      ctx.lineTo(cardX + as + cardR, cardY + as);
      ctx.lineTo(cardX + as, cardY + as);
      ctx.lineTo(cardX + as, cardY + as + cardR);
      ctx.lineTo(cardX, cardY + as + cardR);
      ctx.closePath();
      ctx.fill();
      // bottom-right corner
      const brX = cardX + cardW;
      const brY = cardY + cardH;
      ctx.beginPath();
      ctx.moveTo(brX, brY - cardR);
      ctx.arcTo(brX, brY, brX - cardR, brY, cardR);
      ctx.lineTo(brX - as - cardR, brY);
      ctx.lineTo(brX - as - cardR, brY - as);
      ctx.lineTo(brX - as, brY - as);
      ctx.lineTo(brX - as, brY - as - cardR);
      ctx.lineTo(brX, brY - as - cardR);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 7. Campaign name
      const nameY = cardY + cardH + 38;
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "500 11px system-ui, sans-serif";
      ctx.fillStyle = "rgba(253,186,116,0.65)";
      ctx.textBaseline = "middle";
      ctx.fillText("K A M P A N Y E", W / 2, nameY);
      ctx.font = "bold 26px system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      let displayName = campaign.name;
      while (
        ctx.measureText(displayName).width > W - 80 &&
        displayName.length > 4
      ) {
        displayName = displayName.slice(0, -1);
      }
      if (displayName !== campaign.name) displayName += "…";
      ctx.fillText(displayName, W / 2, nameY + 30);
      ctx.restore();

      // 8. Source chip
      const chipY = nameY + 70;
      const chipText = `source: ${campaign.source}`;
      ctx.save();
      ctx.font = "13px 'Courier New', monospace";
      ctx.textAlign = "center";
      const chipTW = ctx.measureText(chipText).width;
      const chipW2 = chipTW + 30;
      const chipH2 = 32;
      const chipX2 = (W - chipW2) / 2;
      ctx.fillStyle = "rgba(46, 125, 50,0.13)";
      ctx.strokeStyle = "rgba(46, 125, 50,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(chipX2, chipY, chipW2, chipH2, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#64B5F6";
      ctx.textBaseline = "middle";
      ctx.fillText(chipText, W / 2, chipY + chipH2 / 2);
      ctx.restore();

      // 9. Dashed divider
      const divY = chipY + chipH2 + 24;
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = "#64B5F6";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.moveTo(60, divY);
      ctx.lineTo(W - 60, divY);
      ctx.stroke();
      ctx.restore();

      // 10. Footer text
      const footerY = divY + 24;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillStyle = "rgba(253,186,116,0.5)";
      ctx.fillText(
        "Scan QR Code untuk mengisi Kuis Refleksi Digital",
        W / 2,
        footerY,
      );
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.fillStyle = "rgba(46, 125, 50,0.75)";
      ctx.fillText("gesamega.web.id", W / 2, footerY + 22);
      ctx.restore();

      // Download
      URL.revokeObjectURL(svgUrl);
      const link = document.createElement("a");
      link.download = `qr-${campaign.source}.png`;
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
