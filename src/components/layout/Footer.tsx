"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MapPin, Activity } from "lucide-react";

const navLinks = [
  { href: "/peta", label: "Peta" },
  { href: "/artikel", label: "Artikel" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/visi-misi", label: "Visi & Misi" },
  { href: "/tim", label: "Tim Pengembang" },
];

export function Footer() {
  const pathname = usePathname();
  const isHiddenPage = pathname === "/kuis" || pathname === "/survei";
  if (isHiddenPage) return null;

  return (
    <footer
      className="relative overflow-hidden mt-auto bg-surface"
      style={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Background decorations (mirrors MapPreview) ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* mesh glow */}
        <div
          className="absolute bottom-0 left-[10%] w-[500px] h-[300px] rounded-full opacity-[0.035] blur-[100px]"
          style={{
            background: "radial-gradient(circle, #64B5F6, transparent)",
          }}
        />
        <div
          className="absolute top-0 right-[5%] w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[90px]"
          style={{
            background: "radial-gradient(circle, #2E7D32, transparent)",
          }}
        />
        {/* grid dots */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.022]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="footer-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>

        {/* top orange accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #64B5F6 30%, #2E7D32 70%, transparent 100%)",
            opacity: 0.4,
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-4 sm:pt-8 sm:pb-6">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-4">
          {/* Brand col */}
          <div className="md:col-span-5">
            {/* Wordmark */}
            <div className="mb-4">
              <span className="font-black text-2xl tracking-tighter text-text-dark uppercase">
                GESA
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, #2E7D32 0%, #1E88E5 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  MEGA
                </span>
              </span>
            </div>

            <p className="text-text-dark text-xs leading-relaxed max-w-xs mb-4 font-medium">
              Platform kolaboratif nasional untuk mendorong penggunaan gadget
              yang lebih sehat, terukur, dan berdampak pada kualitas pendidikan.
            </p>

            {/* Partner logos */}
            <div
              className="inline-flex items-center gap-4 px-4 py-2.5 rounded-2xl mb-4"
              style={{
                background: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <Image
                src="/assets/Logo-Gesa-media.svg"
                alt="Gesa Media Logo"
                width={80}
                height={20}
                unoptimized
                className="h-5 w-auto object-contain"
                style={{ filter: "brightness(0)", opacity: 0.6 }}
              />
              <div
                className="w-px h-4 self-center"
                style={{ background: "rgba(0,0,0,0.12)" }}
              />
              <Image
                src="/assets/logo-kmpus.png"
                alt="Logo Kampus"
                width={80}
                height={24}
                className="h-6 w-auto object-contain"
                style={{ filter: "brightness(0)", opacity: 0.55 }}
              />
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/gesamega.official?igsh=YjZ5cGJzcDk3MHV2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: "rgba(0,0,0,0.05)",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "rgba(46, 125, 50,0.12)";
                  el.style.borderColor = "rgba(46, 125, 50,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "rgba(0,0,0,0.05)";
                  el.style.borderColor = "rgba(0,0,0,0.08)";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 text-slate-500 group-hover:text-primary transition-colors duration-200"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Nav col */}
          <div className="md:col-span-3">
            <h4 className="text-[9px] font-black tracking-[0.2em] uppercase text-slate-400 mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2.5 text-xs font-medium text-text-dark hover:text-text-dark transition-colors duration-200"
                  >
                    <span
                      className="w-1 h-1 rounded-full transition-all duration-200 group-hover:w-3"
                      style={{
                        background: "#2E7D32",
                        opacity: 0,
                        transition:
                          "width 200ms, opacity 200ms, background 200ms",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLSpanElement).style.opacity =
                          "1")
                      }
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA card */}
          <div className="md:col-span-4">
            <div className="relative rounded-2xl p-5 overflow-hidden h-full flex flex-col justify-between border border-slate-200 bg-white shadow-sm">
              {/* corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-50">
                <svg viewBox="0 0 48 48" fill="none">
                  <path
                    d="M46 24 L46 2 L24 2"
                    stroke="#2E7D32"
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                  />
                </svg>
              </div>

              {/* glow */}
              <div
                className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full blur-2xl opacity-10"
                style={{ background: "#2E7D32" }}
              />

              <div className="relative z-10">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{
                    background: "rgba(46, 125, 50,0.12)",
                    border: "1px solid rgba(46, 125, 50,0.25)",
                  }}
                >
                  <Activity className="w-3.5 h-3.5 text-primary" />
                </div>
                <h4 className="text-text-dark font-bold text-sm mb-1.5">
                  Perluas Wawasan?
                </h4>
                <p className="text-text-dark text-xs leading-relaxed mb-4">
                  Jelajahi berbagai artikel dan wawasan terbaru untuk membangun
                  ekosistem digital yang sehat di sekolah Anda.
                </p>
              </div>

              <Link
                href="/artikel"
                className="group relative z-10 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs text-white transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
                  boxShadow: "0 0 20px rgba(46, 125, 50,0.25)",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.boxShadow = "0 0 32px rgba(46, 125, 50,0.45)";
                  el.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.boxShadow = "0 0 20px rgba(46, 125, 50,0.25)";
                  el.style.transform = "scale(1)";
                }}
              >
                Baca Artikel
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <p className="text-slate-500 text-[10px] font-medium tracking-wide">
            © {new Date().getFullYear()} GESAMEGA. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-primary/50" />
            <span className="text-slate-500 text-[10px] font-medium">
              Indonesia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
