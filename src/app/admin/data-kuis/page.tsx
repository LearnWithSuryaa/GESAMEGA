"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table as TableIcon,
  Download,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface QuizResult {
  id: string;
  user_name: string;
  result_category: string;
  source: string | null;
  created_at: string;
}

const PAGE_SIZE = 50;

export default function DataKuisPage() {
  const [data, setData] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination & Server State
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  // Global Stats State
  const [stats, setStats] = useState({ total: 0, byCategory: [] as {name: string, count: number}[] });
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Global Stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/quiz-data?type=stats");
        const json = await res.json();
        setStats(json);
      } catch (e) {
        console.error(e);
      }
    }
    fetchStats();
  }, []);

  // Fetch Paginated Data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PAGE_SIZE.toString(),
        search: debouncedSearch,
        category: selectedCategory,
        sort: sortBy,
      });
      const response = await fetch(`/api/admin/quiz-data?${params.toString()}`);
      const result = await response.json();
      setData(result.data || []);
      setTotalRecords(result.total || 0);
    } catch (error) {
      console.error("Failed to fetch quiz data", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, selectedCategory, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sortBy]);

  const categories = stats.byCategory.map(c => c.name);
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams({
        export: "true",
        search: debouncedSearch,
        category: selectedCategory,
        sort: sortBy,
      });
      const response = await fetch(`/api/admin/quiz-data?${params.toString()}`);
      const result = await response.json();
      const exportData: QuizResult[] = result.data || [];

      const headers = ["Nama", "Kategori Hasil", "Source (QR)", "Waktu"];
      const rows = exportData.map((row) => [
        row.user_name,
        row.result_category,
        row.source || "-",
        new Date(row.created_at).toLocaleString("id-ID"),
      ]);

      const csv = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quiz-data-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
      alert("Gagal mengekspor data.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="bg-surface-alt rounded-lg p-3">
              <TableIcon className="w-6 h-6 text-primary" />
            </div>
            Data Kuis
          </h1>
          <p className="text-gray-500 mt-2">
            Kelola dan analisis hasil kuis dari {stats.total} responden
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV (Semua Hal.)
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-xs font-semibold mb-1">
            Total Responden
          </p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        {stats.byCategory.slice(0, 3).map((cat) => (
          <div
            key={cat.name}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
          >
            <p className="text-gray-600 text-xs font-semibold mb-1 truncate">
              {cat.name}
            </p>
            <p className="text-2xl font-bold text-gray-900">{cat.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama partisipan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "name")}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
          >
            <option value="date">Terbaru</option>
            <option value="name">Nama (A-Z)</option>
          </select>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
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
      {isLoading && data.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-500 mt-4">Memuat data kuis...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
          <TableIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {searchTerm || selectedCategory
              ? "Tidak ada data yang sesuai dengan filter"
              : "Belum ada data kuis"}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Kategori Hasil
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
                {data.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {row.user_name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-3 py-1 bg-surface-alt text-text-dark text-xs font-bold rounded-lg border border-surface-alt">
                        {row.result_category}
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
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Menampilkan <span className="font-bold text-gray-900">{(page - 1) * PAGE_SIZE + 1}</span> hingga <span className="font-bold text-gray-900">{Math.min(page * PAGE_SIZE, totalRecords)}</span> dari <span className="font-bold text-gray-900">{totalRecords}</span> entri
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="px-4 py-2 text-sm font-medium text-gray-700">
                Halaman {page} dari {Math.max(1, totalPages)}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
