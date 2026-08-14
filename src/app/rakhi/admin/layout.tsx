"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Palette,
  Music,
  BarChart3,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  PlusCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/rakhi/admin/dashboard", icon: LayoutDashboard },
  { label: "Sisters", href: "/rakhi/admin/sisters", icon: Users },
  { label: "Themes", href: "/rakhi/admin/themes", icon: Palette },
  { label: "Songs", href: "/rakhi/admin/songs", icon: Music },
  { label: "Analytics", href: "/rakhi/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/rakhi/admin/settings", icon: Settings },
  { label: "Profile", href: "/rakhi/admin/profile", icon: User },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // If on login page, don't show admin sidebar/header layout
  if (pathname === "/rakhi/admin") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/rakhi/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900 flex flex-col md:flex-row font-sans">
      {/* DESKTOP LIGHT SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-rose-200/80 bg-white/95 shrink-0 p-5 justify-between shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[#E07A5F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-gray-900 tracking-wide">RAKHI 2026</h2>
              <p className="text-[10px] text-[#E07A5F] font-bold uppercase tracking-widest">Admin Suite</p>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-rose-50 text-[#E07A5F] border border-rose-200 shadow-xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-rose-50/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#E07A5F]" : "opacity-70"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-rose-200">
          <Link
            href="/rakhi/admin/sisters/new"
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-extrabold text-xs shadow-md hover:scale-[1.02] active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>CREATE SISTER</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP LIGHT HEADER */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-rose-200 bg-white/95 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 text-[#E07A5F] hover:bg-rose-50 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-gray-900 tracking-wide">RAKHI 2026 ADMIN</span>
        </div>

        <Link
          href="/rakhi/admin/sisters/new"
          className="p-2 rounded-lg bg-rose-100 text-[#E07A5F] text-xs font-bold"
        >
          + SISTER
        </Link>
      </header>

      {/* MOBILE DRAWER */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white border-r border-rose-200 h-full p-5 flex flex-col justify-between z-10 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-gray-900">Navigation</span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-rose-50 text-[#E07A5F] border border-rose-200"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-rose-600 bg-rose-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto pb-20 md:pb-8">
        {children}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-rose-200 flex items-center justify-around py-2 px-1 backdrop-blur-md shadow-lg">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
                isActive ? "text-[#E07A5F]" : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
