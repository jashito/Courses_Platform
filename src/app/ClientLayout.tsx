"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { ToastProvider } from "@/components/Toast";
import { useI18n } from "@/components/I18n";

type UserRole = "admin" | "instructor" | "student" | null;
type ThemeMode = "light" | "dark";

const isDev = process.env.NEXT_PUBLIC_IS_DEV === "true";

interface NavItem {
  href: string;
  label: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "nav.home", icon: "home" },
  { href: "/courses", label: "nav.programs", icon: "courses" },
  { href: "/blog", label: "nav.blog" },
  { href: "/contact", label: "nav.contact" },
  { href: "/pricing", label: "nav.pricing" },
];

function SidebarIcon({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <Image
      src={`/assets/icons/sidebar/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      style={{ filter: "invert(1) brightness(0.9)" }}
    />
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t, lang, setLang } = useI18n();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || stored === "light" ? stored : prefersDark ? "dark" : "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    let active = true;

    const checkUser = async () => {
      const { data: authData } = await supabaseBrowser.auth.getUser();
      if (!active) return;

      if (!authData.user) {
        setIsLoggedIn(false);
        setRole(null);
        return;
      }

      setIsLoggedIn(true);

      const { data: profile } = await supabaseBrowser
        .from("profiles")
        .select("role")
        .eq("user_id", authData.user.id)
        .single();

      if (!active) return;
      setRole((profile?.role ?? "student") as UserRole);
    };

    checkUser();

    const { data: subscription } = supabaseBrowser.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      active = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    router.push("/login");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleLang = () => {
    setLang(lang === "es" ? "en" : "es");
  };

  const getNavLabel = (item: NavItem) => {
    const keys = item.label.split(".");
    // @ts-expect-error translations
    return t[keys[0]]?.[keys[1]] || item.label;
  };

  return (
    <ToastProvider>
      <div className="app-layout">
        {isDev && <div className="dev-banner">Modo desarrollo</div>}
        
        <aside className="sidebar">
          <div className="sidebar-brand">
            <span className="brand-dot" />
            <strong>CP</strong>
          </div>
          
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="sidebar-link" title={getNavLabel(item)}>
                {item.icon ? <SidebarIcon name={item.icon} /> : getNavLabel(item).charAt(0)}
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button onClick={toggleLang} className="lang-toggle">
              {lang === "es" ? "EN" : "ES"}
            </button>
            <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </aside>

        <main className="main-content">
          <header className="top-bar">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </button>
            <div className="top-bar-spacer" />
            <div className="top-bar-actions">
              {isLoggedIn ? (
                <>
                  <Link href="/my-courses" className="top-bar-link">{t.nav.profile}</Link>
                  {role === "admin" && <Link href="/admin" className="top-bar-link">{t.nav.admin}</Link>}
                  <button onClick={handleLogout} className="button secondary small">{t.nav.logout}</button>
                </>
              ) : (
                <Link href="/login" className="button primary small">{t.nav.login}</Link>
              )}
            </div>
          </header>
          
          <div className="content">
            {children}
          </div>

          <footer className="footer-simple">
            {t.home.footer}
          </footer>
        </main>

        {mobileMenuOpen && (
          <div className="mobile-menu" onClick={() => setMobileMenuOpen(false)}>
            <nav className="mobile-nav">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="mobile-link">
                  {getNavLabel(item)}
                </Link>
              ))}
              <hr className="mobile-divider" />
              {isLoggedIn ? (
                <>
                  <Link href="/my-courses" className="mobile-link">{t.nav.profile}</Link>
                  <button onClick={handleLogout} className="mobile-link">{t.nav.logout}</button>
                </>
              ) : (
                <Link href="/login" className="mobile-link">{t.nav.login}</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </ToastProvider>
  );
}
