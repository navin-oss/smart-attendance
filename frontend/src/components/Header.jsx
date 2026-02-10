import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, User, ChevronDown, Menu, X } from "lucide-react";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/attendance", label: "Attendance" },
  { to: "/students", label: "Students" },
  { to: "/analytics", label: "Analytics" },
  { to: "/reports", label: "Reports" },
  { to: "/manage-schedule", label: "Schedule" },
];

export default function Header({ theme, setTheme}) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("user");
      if (!storedData) { setUser(null); return; }
      setUser(JSON.parse(storedData));
    } catch (e) {
      console.error("Failed to parse user from local storage", e);
      setUser(null);
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const displayName = user?.name || user?.email || "Guest";

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--bg-card)] border-b border-[var(--border-color)] shadow-sm">
      {/* Main bar */}
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Logo + toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile toggle button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg text-[var(--text-body)] hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-3">
            <img className="w-10 h-10 rounded-full" src="/logo.png" alt="Logo" />
            <h1 className="text-xl font-bold text-[var(--text-main)] hidden sm:block">Smart Attendance</h1>
          </Link>
        </div>

        {/* Center: Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive(link.to)
                  ? "text-[var(--primary)] bg-[var(--primary-hover)]/20"
                  : "text-[var(--text-body)] hover:text-[var(--primary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Profile section */}
        <div className="flex items-center gap-3">
          <div className="bg-[var(--primary)] p-1.5 rounded-full cursor-pointer">
            <Bell size={16} className="text-[var(--text-on-primary)]" />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <User size={20} className="text-[var(--text-body)]" />
            <span className="text-sm font-medium text-[var(--text-main)]">{displayName}</span>
            <Link to="/settings">
              <ChevronDown size={16} className="text-[var(--text-body)] cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-[var(--border-color)] bg-[var(--bg-card)] px-4 pb-4 pt-2 space-y-1 animate-in slide-in-from-top">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive(link.to)
                  ? "text-[var(--primary)] bg-[var(--primary-hover)]/20"
                  : "text-[var(--text-body)] hover:text-[var(--primary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {/* Mobile-only profile link */}
          <div className="sm:hidden flex items-center gap-2 px-4 py-2.5 border-t border-[var(--border-color)] mt-2 pt-3">
            <User size={18} className="text-[var(--text-body)]" />
            <span className="text-sm font-medium text-[var(--text-main)]">{displayName}</span>
          </div>
        </nav>
      )}
    </header>
  );
}
