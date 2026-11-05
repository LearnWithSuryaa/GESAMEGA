"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Map,
  Lightbulb,
  Menu,
  X,
  ChevronDown,
  Newspaper,
  BarChart3,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const [hasilLoggedIn, setHasilLoggedIn] = useState(false);

  // Cek apakah user sudah login di halaman /hasil
  useEffect(() => {
    if (pathname !== "/hasil") return;
    const checkSession = () => {
      setHasilLoggedIn(!!sessionStorage.getItem("hasil_session"));
    };
    checkSession();
    // Reaktif saat login/logout terjadi di tab yang sama
    window.addEventListener("storage", checkSession);
    // Poll ringan untuk menangkap perubahan sessionStorage (same-tab)
    const interval = setInterval(checkSession, 500);
    return () => {
      window.removeEventListener("storage", checkSession);
      clearInterval(interval);
    };
  }, [pathname]);

  const isHiddenPage =
    pathname === "/kuis" ||
    pathname === "/survei" ||
    (pathname === "/hasil" && hasilLoggedIn);

  const primaryLinks = [
    { href: "/", label: "Beranda" },
    { href: "/peta", label: "Peta", icon: Map },
    { href: "/hasil", label: "Hasil", icon: BarChart3 },
    { href: "/artikel", label: "Artikel", icon: Newspaper },
  ];

  const aboutLinks = [
    { href: "/tentang", label: "Tentang Kami" },
    { href: "/visi-misi", label: "Visi & Misi" },
    { href: "/tim", label: "Tim Pengembang" },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileAboutOpen(false);
  };

  if (isHiddenPage) return null;

  return (
    <>
      <nav
        className={cn(
          "fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          !scrolled
            ? "w-full top-0 bg-transparent rounded-none border-transparent shadow-none"
            : "w-[92%] sm:w-[85%] max-w-5xl top-4 md:top-6 rounded-3xl border border-primary-light/20 backdrop-blur-xl shadow-2xl",
          !isVisible && scrolled && "-translate-y-[250%] opacity-0 scale-95",
        )}
        style={scrolled ? { backgroundColor: "rgba(255, 255, 255, 0.92)" } : {}}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              scrolled ? "h-14 sm:h-16" : "h-16 md:h-20",
            )}
          >
            {/* Logo */}
            <Link
              href="/"
              onClick={closeMobile}
              className={cn(
                "font-extrabold text-xl sm:text-2xl tracking-tight text-text-dark transition-opacity duration-300",
                mobileOpen
                  ? "opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto"
                  : "opacity-100",
              )}
            >
              GESA<span className="text-primary">MEGA</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {primaryLinks.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-200",
                      active
                        ? "text-primary bg-primary/10 border border-primary/20"
                        : "text-text-dark/70 hover:text-text-dark hover:bg-primary/5",
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                );
              })}

              {/* About Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all duration-200",
                    aboutOpen
                      ? "text-text-dark bg-primary-light/15"
                      : "text-text-dark/70 hover:text-text-dark hover:bg-primary-light/10",
                  )}
                >
                  Tentang
                  <motion.span
                    animate={{ rotate: aboutOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 w-52 rounded-2xl p-2 border border-primary-light/20 backdrop-blur-xl"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
                    >
                      {aboutLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-3 py-2.5 rounded-xl text-sm text-text-dark/70 hover:text-text-dark hover:bg-primary-light/10 transition-all duration-150"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Desktop */}
            <div className="hidden lg:flex items-center">
              <Link href="/peta">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-info hover:from-primary hover:to-info/90 text-white font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  Peta Partisipasi
                </motion.button>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-full border border-primary-light/20 bg-primary-light/5 hover:bg-primary-light/15 transition-colors"
              aria-label="Buka menu"
            >
              <Menu className="w-5 h-5 text-text-dark" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={closeMobile}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 z-50 h-full w-4/5 max-w-xs flex flex-col border-l border-primary-light/20"
              style={{
                backgroundColor: "rgba(245, 247, 250, 0.97)",
                backdropFilter: "blur(24px)",
              }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-primary-light/15">
                <Link
                  href="/"
                  className="font-extrabold text-xl text-text-dark tracking-tight"
                  onClick={closeMobile}
                >
                  GESA<span className="text-primary">MEGA</span>
                </Link>
                <button
                  onClick={closeMobile}
                  className="p-2 rounded-full border border-primary-light/20 bg-primary-light/5 hover:bg-primary-light/15 transition-colors"
                  aria-label="Tutup menu"
                >
                  <X className="w-4 h-4 text-text-dark/70" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                {primaryLinks.map((link) => {
                  const active = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobile}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150",
                        active
                          ? "text-primary bg-primary/10 border border-primary/20"
                          : "text-text-dark/70 hover:text-text-dark hover:bg-primary/5",
                      )}
                    >
                      {Icon && <Icon className="w-4 h-4 shrink-0" />}
                      {link.label}
                    </Link>
                  );
                })}

                {/* About Accordion */}
                <div>
                  <button
                    onClick={() => setMobileAboutOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-text-dark/70 hover:text-text-dark hover:bg-primary-light/10 transition-all duration-150"
                  >
                    <span className="flex items-center gap-3">
                      <Lightbulb className="w-4 h-4 shrink-0 text-info/70" />
                      Tentang
                    </span>
                    <motion.span
                      animate={{ rotate: mobileAboutOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {mobileAboutOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 mt-1 space-y-1">
                          {aboutLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={closeMobile}
                              className="block px-4 py-2.5 rounded-xl text-sm text-text-dark/60 hover:text-info hover:bg-info/8 transition-all duration-150"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>

              {/* Drawer Footer */}
              <div className="px-5 py-5 border-t border-primary-light/15">
                <Link
                  href="/peta"
                  onClick={closeMobile}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-primary to-info text-white font-bold text-sm transition-all duration-300 shadow-md shadow-primary/20"
                >
                  Lihat Peta
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
