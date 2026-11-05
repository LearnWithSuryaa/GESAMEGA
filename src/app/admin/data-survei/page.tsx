"use client";

import { useState, useMemo, useEffect } from "react";
import {
  FileText,
  Download,
  Search,
  X,
  MapPin,
} from "lucide-react";

interface SurveyResult {
  id: string;
  nama: string;
  jawaban: Record<string, unknown>;
  source: string | null;
  created_at: string;
  schools?: {
    nama_sekolah: string;
  };
}

const PAGE_SIZE = 200;

export default function DataSurveiPage() {
  const [data, setData] = useState<SurveyResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  // Fetch data on mount
  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/survey-data");
      const result = await response.json();
      setData(result || []);
    } catch (error) {
      console.error("Failed to fetch survey data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSchool) {
      filtered = filtered.filter(
        (item) => (item.schools?.nama_sekolah || "-") === selectedSchool
      );
    }

    if (sortBy === "name") {
      filtered.sort((a, b) => a.nama.localeCompare(b.nama));
    } else {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return filtered;
  }, [data, searchTerm, selectedSchool, sortBy]);

  const schools = Array.from(
    new Set(data.map((item) => item.schools?.nama_sekolah || "-").filter(Boolean))
  ).sort() as string[];

  const stats = {
    total: data.length,
    schools: schools.length,
    avgAnswers: Math.round(
      data.reduce((sum, item) => sum + Object.keys(item.jawaban || {}).length, 0) /
        (data.length || 1)
    ),
  };

  const handleExportCSV = () => {
    const headers = [
      "Nama Pengisi",
      "Asal Sekolah",
      "Jumlah Jawaban",
      "Source (QR)",
      "Waktu",
    ];
    const rows = filteredData.map((row) => {
      const schoolName = row.schools?.nama_sekolah || "-";
      const jawabanCount = Object.keys(row.jawaban || {}).length;
      return [
        row.nama,
        schoolName,
        jawabanCount,
        row.source || "-",
        new Date(row.created_at).toLocaleString("id-ID"),
      ];
    });

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `survey-data-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="bg-emerald-50 rounded-lg p-3">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            Data Survei
          </h1>
          <p className="text-gray-500 mt-2">
            Kelola hasil survei dari {data.length} responden
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-xs font-semibold mb-1">
            Total Responden
          </p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-xs font-semibold mb-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Jumlah Sekolah
          </p>
          <p className="text-2xl font-bold text-gray-900">{stats.schools}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-xs font-semibold mb-1">
            Rata-rata Jawaban
          </p>
          <p className="text-2xl font-bold text-gray-900">{stats.avgAnswers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama responden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* School Filter */}
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
          >
            <option value="">Semua Sekolah</option>
            {schools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "name")}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
          >
            <option value="date">Terbaru</option>
            <option value="name">Nama (A-Z)</option>
          </select>

          {/* Clear Filters */}
          {(searchTerm || selectedSchool) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSchool("");
              }}
              className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium text-sm flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Bersihkan
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-gray-500 mt-4">Memuat data...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {searchTerm || selectedSchool
              ? "Tidak ada data yang sesuai dengan filter"
              : "Belum ada data survei"}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Nama Pengisi
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Asal Sekolah
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Jawaban
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Source (QR)
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Waktu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((row) => {
                  const schoolName = row.schools?.nama_sekolah || "-";
                  const jawabanCount = Object.keys(row.jawaban || {}).length;

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {row.nama}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {schoolName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                          {jawabanCount} Jawaban
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {row.source ? (
                          <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">
                            {row.source}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(row.created_at).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(row.created_at).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Info */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
          <span>
            Menampilkan <strong>{filteredData.length}</strong> dari{" "}
            <strong>{data.length}</strong> entri
          </span>
          <span className="text-xs text-gray-500">(Maksimal {PAGE_SIZE} entri)</span>
        </div>
      )}
    </div>
  );
}
