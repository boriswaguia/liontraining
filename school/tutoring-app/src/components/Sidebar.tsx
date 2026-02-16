"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  FileText,
  Lightbulb,
  CalendarDays,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Settings,
  School,
  Building2,
  Users,
  UserCog,
  Activity,
  BarChart3,
  Coins,
} from "lucide-react";
import { useState } from "react";
import { Language, t } from "@/lib/i18n";

const navIcons = [LayoutDashboard, BookOpen, TrendingUp, FileText, Lightbulb, GraduationCap, MessageCircle, CalendarDays, Coins];
const navHrefs = ["/dashboard", "/courses", "/progress", "/study-guides", "/exercises", "/flashcards", "/chat", "/planner", "/credits"];
const navKeys = ["nav.dashboard", "nav.courses", "nav.progress", "nav.studyGuides", "nav.exercises", "nav.flashcards", "nav.chat", "nav.planner", "nav.credits"] as const;

const adminIcons = [School, Building2, Users, BookOpen, UserCog, Activity, BarChart3, Coins, Settings];
const adminHrefs = ["/admin/schools", "/admin/departments", "/admin/classes", "/admin/courses", "/admin/users", "/admin/activity", "/admin/analytics", "/admin/credit-packs", "/admin/settings"];
const adminKeys = ["nav.admin.schools", "nav.admin.departments", "nav.admin.classes", "nav.admin.courses", "nav.admin.users", "nav.admin.activity", "nav.admin.analytics", "nav.admin.creditPacks", "nav.admin.settings"] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const userExt = session?.user as Record<string, unknown> | undefined;
  const schoolName = (userExt?.schoolName as string) || "LionLearn";
  const deptCode = (userExt?.departmentCode as string) || "";
  const className = (userExt?.className as string) || "";
  const userRole = (userExt?.role as string) || "student";
  const lang = ((userExt?.language as string) || "fr") as Language;
  const isAdmin = userRole === "admin";
  const subtitle = [deptCode, className].filter(Boolean).join(" · ") || t("nav.subtitle.default", lang);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/signout", { method: "POST" });
    if (res.ok) {
      window.location.href = "/login";
    }
  };

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-blue-700">
        <Link href={isAdmin ? "/admin/analytics" : "/dashboard"} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-bold text-lg truncate">{schoolName}</h1>
            <p className="text-blue-200 text-xs truncate">{subtitle}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {!isAdmin && navKeys.map((key, i) => {
          const href = navHrefs[i];
          const Icon = navIcons[i];
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={key}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-blue-100 hover:bg-blue-700 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {t(key, lang)}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="flex items-center gap-2 px-4 pt-4 pb-1">
              <Settings className="w-4 h-4 text-blue-300" />
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                {t("nav.admin", lang)}
              </span>
            </div>
            {adminKeys.map((key, i) => {
              const href = adminHrefs[i];
              const Icon = adminIcons[i];
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {t(key, lang)}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          {t("nav.logout", lang)}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-blue-600 flex flex-col transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent />
      </aside>
    </>
  );
}
