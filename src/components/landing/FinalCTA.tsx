"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Handshake } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="py-32 px-4 relative overflow-hidden bg-surface-alt">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 60%, rgba(46,125,50,0.06) 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Badge — ikon relevan: Handshake (kolaborasi/komitmen) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary-soft bg-white text-primary text-sm font-bold tracking-wide mb-8 shadow-sm"
        >
          <Handshake className="w-4 h-4" />
          Bergabung Sekarang
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl font-extrabold text-text-dark mb-6 leading-tight tracking-tight"
        >
          Mari Berpartisipasi Membangun{" "}
          <span
            style={{
              backgroundImage:
                "linear-gradient(135deg, #2E7D32 0%, #1E88E5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ekosistem Pendidikan Digital
          </span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="text-text-dark font-medium text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Setiap sekolah yang berpartisipasi membawa Indonesia selangkah lebih
          dekat menuju pendidikan digital yang aman, terukur, dan berkualitas.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/komitmen" className="w-full sm:w-auto relative group">
            <Button
              variant="primary"
              className="w-full sm:w-auto px-10 py-4 shadow-primary/20 text-base relative z-10 transition-transform active:scale-95 hover:shadow-primary/40"
            >
              <span className="flex items-center gap-2">
                Buat Komitmen Sekarang{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
