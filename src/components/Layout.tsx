import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type UserRole = "admin" | "student" | null;
type ThemeMode = "light" | "dark";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [theme, setTheme] = useState<ThemeMode>("light");

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

  return (
    <div className="container">
      <header className="nav">
        <div className="brand">
          <span className="brand-dot" />
          <strong>Courses Platform</strong>
        </div>
        <nav className="nav-links">
          <Link href="/">Inicio</Link>
          {isLoggedIn && <Link href="/courses">Cursos</Link>}
          {role === "admin" && <Link href="/admin">Admin</Link>}
        </nav>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} type="button" aria-label="Cambiar tema">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          {isLoggedIn ? (
            <button className="button secondary" onClick={handleLogout} type="button">
              Cerrar sesión
            </button>
          ) : (
            <Link className="button" href="/login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </header>
      {children}
      <footer className="footer">
        <div>© 2026 Courses Platform — Formación empresarial</div>
      </footer>
    </div>
  );
}