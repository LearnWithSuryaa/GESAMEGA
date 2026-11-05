"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ArrowLeft, School, User, TrendingUp, BookOpen, Lock, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface CaseStudyDetailData {
  id: string | number;
  judul: string;
  isi: string;
  penulis: string;
  category: string;
  impact: string;
  badge: string;
  created_at: string;
  schools: { nama_sekolah: string } | { nama_sekolah: string }[] | null;
}

export default function StudiKasusDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [data, setData] = useState<CaseStudyDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCase() {
      const { data: cData, error } = await supabase
        .from("case_studies")
        .select("id, judul, isi, penulis, category, impact, badge, created_at, schools(nama_sekolah)")
        .eq("id", id)
        .single();
      
      if (!error && cData) {
        setData(cData);
      }
      setLoading(false);
    }
    fetchCase();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
           <BookOpen className="w-12 h-12 text-info mb-4" />
           <p className="text-gray-500 font-medium">Memuat Studi Kasus...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4">
         <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
         <h2 className="text-2xl font-bold text-gray-800 mb-2">Studi Kasus Tidak Ditemukan</h2>
         <p className="text-gray-500 mb-6">Mungkin data telah dihapus atau tautan tidak valid.</p>
         <Link href="/studi-kasus" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary transition-colors">
           Kembali ke Daftar
         </Link>
      </div>
    );
  }

  const getIconAndColor = (category: string) => {
    switch (category) {
      case "regulasi": return { icon: Lock, color: "bg-surface-alt text-primary border-primary-soft" };
      case "pembelajaran": return { icon: Zap, color: "bg-blue-50 text-blue-600 border-blue-200" };
      case "literasi": return { icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600 border-emerald-200" };
      case "inovasi": 
      default: return { icon: TrendingUp, color: "bg-rose-50 text-rose-600 border-rose-200" };
    }
  };

  const { icon: Icon, color } = getIconAndColor(data.category);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-surface-alt rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/studi-kasus" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-semibold mb-8 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Studi Kasus
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-8 sm:p-12 border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-wrap items-center gap-3 mb-6">
               <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border ${color}`}>
                 <Icon className="w-4 h-4" /> {data.category || "Inovasi"}
               </span>
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                 {data.badge || "Praktik Baik"}
               </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              {data.judul}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
               <div className="flex items-center gap-2 font-bold bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                 <School className="w-4 h-4 text-primary" />
                 {(Array.isArray(data.schools)
                   ? data.schools[0]?.nama_sekolah
                   : data.schools?.nama_sekolah) || "Sekolah Tidak Diketahui"}
               </div>
               <div className="flex items-center gap-2 font-semibold">
                 <User className="w-4 h-4 text-gray-400" />
                 Ditulis oleh: {data.penulis}
               </div>
               <div className="flex items-center gap-2 font-black text-emerald-600">
                 <TrendingUp className="w-4 h-4" />
                 Dampak: {data.impact || "Terverifikasi"}
               </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8 sm:p-12">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-[17px] sm:text-[19px]">
              {data.isi}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
