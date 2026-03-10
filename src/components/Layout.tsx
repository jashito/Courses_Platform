import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type UserRole = "admin" | "student" | null;

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);

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

  return (
    <div className="container">
      <header className="nav">
        <div>
          <strong>Courses Platform</strong>
        </div>
        <nav className="nav-links">
          <Link href="/">Home</Link>
          {isLoggedIn && <Link href="/courses">Cursos</Link>}
          {role === "admin" && <Link href="/admin">Admin</Link>}
          {isLoggedIn && (
            <button className="button secondary" onClick={handleLogout} type="button">
              Cerrar sesión
            </button>
          )}
          {!isLoggedIn && <Link href="/login">Iniciar sesión</Link>}
        </nav>
      </header>
      {children}
      <footer className="footer">
        <div>© 2026 Courses Platform — Formación empresarial</div>
      </footer>
    </div>
  );
}