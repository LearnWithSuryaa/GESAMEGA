"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const { scrollY } = useScroll();

  // Parallax Scroll Effects
  const layer1Y = useTransform(scrollY, [0, 1000], [0, 150]); // Paling belakang, gerak paling lambat
  const layer2Y = useTransform(scrollY, [0, 1000], [0, 100]);
  const layer3Y = useTransform(scrollY, [0, 1000], [0, 50]);
  const layer4Y = useTransform(scrollY, [0, 1000], [0, 0]); // Paling depan, relatif statis terhadap viewport

  // Fade out and translate down as user scrolls away
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const yOffset = useTransform(scrollY, [0, 600], [0, 150]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center items-center pt-32 lg:pt-40 bg-linear-to-b from-[#abd8eb] via-[#abd8eb] to-white">
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 pointer-events-none flex items-end justify-center overflow-hidden">
        <div className="relative w-[150vw] md:w-[120vw] lg:w-screen min-w-300 max-w-500 aspect-1376/768">
          <motion.img
            style={{ y: layer1Y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="/images/hero/1.svg"
            className="absolute inset-0 w-full h-full object-contain object-bottom transform-gpu will-change-transform"
            alt="Background Layer 1"
          />
          <motion.img
            style={{ y: layer2Y }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            src="/images/hero/2.svg"
            className="absolute inset-0 w-full h-full object-contain object-bottom transform-gpu will-change-transform"
            alt="Sky Layer"
          />
          <motion.img
            style={{ y: layer3Y }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            src="/images/hero/3.svg"
            className="absolute inset-0 w-full h-full object-contain object-bottom transform-gpu will-change-transform"
            alt="Layer 3"
          />
          <motion.img
            style={{ y: layer4Y }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            src="/images/hero/4.svg"
            className="absolute inset-0 w-full h-full object-contain object-bottom transform-gpu will-change-transform"
            alt="Layer 4"
          />
        </div>
      </div>

      {/* ── Main Content ── */}
      <motion.div
        style={{ opacity, y: yOffset }}
        className="relative z-40 max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center pb-20 md:pb-40 transform-gpu will-change-transform"
      >
        {/* Floating Label */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs md:text-sm font-bold text-primary bg-surface-alt/80 px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 border border-primary-soft backdrop-blur-sm"
        >
          Gerakan Nasional Ekosistem Digital 2026
        </motion.p>

        {/* Headline */}
        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold py-1 leading-[1.2] md:leading-[1.1] tracking-tight text-white"
            style={{
              textShadow: `
                -2px -2px 0 var(--color-primary),
                 0   -2px 0 var(--color-primary),
                 2px -2px 0 var(--color-primary),
                 2px  0   0 var(--color-primary),
                 2px  2px 0 var(--color-primary),
                 0    2px 0 var(--color-primary),
                -2px  2px 0 var(--color-primary),
                -2px  0   0 var(--color-primary)
              `,
            }}
          >
            Membangun Pendidikan <br className="hidden md:block" /> Era Digital
          </motion.h1>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full max-w-[320px] sm:max-w-none mx-auto"
        >
          <Link
            href="/visi-misi"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-info hover:from-primary hover:to-info/90 text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-primary/25 hover:scale-[1.02]"
          >
            Lihat Visi & Misi
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/peta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-slate-200 text-text-dark font-medium text-base hover:bg-surface hover:border-slate-300 transition-all duration-300 hover:scale-[1.02] shadow-sm bg-white backdrop-blur-sm"
          >
            Lihat Peta
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
