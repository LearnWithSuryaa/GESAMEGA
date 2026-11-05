"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Search, MapPin, CheckCircle2, Clock, Circle } from "lucide-react";

interface School {
  id: string;
  nama_sekolah: string;
  status: string;
}

interface Props {
  value: string;
  onChange: (value: string, school?: School) => void;
  placeholder?: string;
  hasError?: boolean;
}

const statusConfig: Record<string, { label: string; dotColor: string; badgeBg: string; badgeText: string; badgeBorder: string; icon: typeof CheckCircle2 }> = {
  komitmen: {
    label: "Komitmen ✓",
    dotColor: "#34d399",
    badgeBg: "rgba(16,185,129,0.15)",
    badgeText: "#34d399",
    badgeBorder: "rgba(16,185,129,0.30)",
    icon: CheckCircle2,
  },
  survei: {
    label: "Sudah Survei",
    dotColor: "#fbbf24",
    badgeBg: "rgba(245,158,11,0.15)",
    badgeText: "#fbbf24",
    badgeBorder: "rgba(245,158,11,0.30)",
    icon: Clock,
  },
  belum: {
    label: "Belum Ikut",
    dotColor: "#CFD8DC",
    badgeBg: "var(--color-surface-alt)",
    badgeText: "#607D8B",
    badgeBorder: "#ECEFF1",
    icon: Circle,
  },
};

export function SchoolAutocomplete({
  value,
  onChange,
  placeholder = "Cari nama sekolah terdaftar...",
  hasError = false,
}: Props) {
  const [schools, setSchools] = useState<School[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchSchools = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) { setSchools([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const { data } = await supabase
        .from("schools")
        .select("id, nama_sekolah, status")
        .ilike("nama_sekolah", `%${query}%`)
        .order("nama_sekolah")
        .limit(8);
      if (data) setSchools(data);
      setSearching(false);
    }, 300);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = schools.slice(0, 8);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Input */}
      <div className="relative">
        <MapPin
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: focused ? "var(--color-primary)" : "#90A4AE" }}
        />
        <input
          required
          type="text"
          value={value}
          onChange={e => {
            onChange(e.target.value, undefined);
            setIsOpen(true);
            searchSchools(e.target.value);
          }}
          onFocus={() => { setFocused(true); setIsOpen(true); if (value.length >= 2) searchSchools(value); }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: "100%",
            paddingLeft: "2.5rem",
            paddingRight: "1rem",
            paddingTop: "0.75rem",
            paddingBottom: "0.75rem",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--color-text-dark)",
            background: hasError
              ? "#fef2f2"
              : focused
              ? "#ffffff"
              : "var(--color-surface)",
            border: hasError
              ? "1px solid rgba(239,68,68,0.40)"
              : focused
              ? "1px solid var(--color-primary)"
              : "1px solid #CFD8DC",
            boxShadow: focused ? "0 0 0 4px rgba(46, 125, 50, 0.15)" : "none",
            outline: "none",
            transition: "all 0.2s ease",
          }}
        />
        {/* Searching spinner */}
        {searching && (
          <div
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 animate-spin"
            style={{ borderColor: "#CFD8DC", borderTopColor: "var(--color-primary)" }}
          />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && value.length > 0 && (
        <div
          className="absolute z-50 w-full mt-2 overflow-y-auto overflow-x-hidden"
          style={{
            background: "#ffffff",
            border: "1px solid #ECEFF1",
            borderRadius: "1rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px #ECEFF1",
            maxHeight: "260px",
          }}
        >
          {filtered.length > 0 ? (
            <ul className="relative">
              {/* Header */}
              <li
                className="flex items-center gap-2 px-4 py-2.5 sticky top-0 z-10"
                style={{
                  background: "var(--color-surface)",
                  borderBottom: "1px solid #ECEFF1",
                }}
              >
                <Search className="w-3 h-3" style={{ color: "#90A4AE" }} />
                <span
                  className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: "#90A4AE" }}
                >
                  {searching ? "Mencari..." : `Sekolah Terdaftar (${filtered.length})`}
                </span>
              </li>

              {/* Items */}
              {filtered.map((school) => {
                const cfg = statusConfig[school.status] || statusConfig["belum"];
                return (
                  <li
                    key={school.id}
                    onClick={() => { onChange(school.nama_sekolah, school); setIsOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150"
                    style={{ borderBottom: "1px solid var(--color-surface-alt)" }}
                    onMouseEnter={e => {
                      Object.assign((e.currentTarget as HTMLLIElement).style, {
                        background: "var(--color-surface-alt)",
                      });
                    }}
                    onMouseLeave={e => {
                      Object.assign((e.currentTarget as HTMLLIElement).style, {
                        background: "transparent",
                      });
                    }}
                  >
                    {/* Status dot */}
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        background: cfg.dotColor,
                        boxShadow: school.status !== "belum" ? `0 0 6px ${cfg.dotColor}` : "none",
                      }}
                    />

                    {/* Name */}
                    <span
                      className="text-sm font-semibold flex-1 leading-tight"
                      style={{ color: "var(--color-text-dark)" }}
                    >
                      {school.nama_sekolah}
                    </span>

                    {/* Badge */}
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                      style={{
                        background: cfg.badgeBg,
                        color: cfg.badgeText,
                        border: `1px solid ${cfg.badgeBorder}`,
                      }}
                    >
                      {cfg.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-5 py-6 text-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: "var(--color-surface-alt)" }}
              >
                <Search className="w-5 h-5" style={{ color: "#CFD8DC" }} />
              </div>
              <p className="text-sm font-bold mb-1" style={{ color: "#607D8B" }}>
                Sekolah tidak ditemukan
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#90A4AE" }}>
                Pastikan nama sesuai nama resmi yang terdaftar di database nasional.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
