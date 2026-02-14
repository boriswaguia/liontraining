"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Tableau de Bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mes Cours", href: "/courses", icon: BookOpen },
  { name: "Mon Progrès", href: "/progress", icon: TrendingUp },
  { name: "Guides d'Étude", href: "/study-guides", icon: FileText },
  { name: "Exercices", href: "/exercises", icon: Lightbulb },
  { name: "Flashcards", href: "/flashcards", icon: GraduationCap },
  { name: "Tuteur IA", href: "/chat", icon: MessageCircle },
  { name: "Plan d'Étude", href: "/planner", icon: CalendarDays },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/signout", { method: "POST" });
    if (res.ok) {
      window.location.href = "/login";
    }
  };

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-blue-700">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">UIT Tuteur</h1>
            <p className="text-blue-200 text-xs">IUT de Douala</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-blue-100 hover:bg-blue-700 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
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
