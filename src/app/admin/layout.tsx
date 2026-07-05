"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  QrCode,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type NavItem = {
  name: string;
  path: string;
  icon: any;
  badge?: number;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Navigasi",
    items: [{ name: "Dashboard", path: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Kuis Siswa",
    items: [
      { name: "Data Kuis", path: "/admin/data-kuis", icon: Database },
      { name: "Generator QR", path: "/admin/qr-generator", icon: QrCode },
    ],
  },
  {
    title: "Survei Instansi",
    items: [
      { name: "Data Survei", path: "/admin/data-survei", icon: Database },
      { name: "QR Survei", path: "/admin/qr-survei", icon: QrCode },
    ],
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  // Login page gets no sidebar — just render children directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 shadow-sm">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              S
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base">SOSIO</h1>
              <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-gradient-to-r from-orange-50 to-orange-50 text-orange-700 font-semibold shadow-sm"
                          : "text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-5 h-5 transition-transform ${
                            isActive
                              ? "text-orange-600"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="inline-block min-w-[24px] h-6 px-2 bg-orange-500 text-white text-xs font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-medium group"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm text-gray-500">
                {pathname === "/admin"
                  ? "Beranda"
                  : pathname.includes("data-kuis")
                  ? "Manajemen Kuis"
                  : pathname.includes("data-survei")
                  ? "Manajemen Survei"
                  : pathname.includes("qr-generator")
                  ? "Generator QR Kuis"
                  : pathname.includes("qr-survei")
                  ? "Generator QR Survei"
                  : "Admin"}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-lg transition-shadow" title="Profile">
                A
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
