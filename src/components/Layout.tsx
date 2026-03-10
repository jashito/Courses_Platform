import Link from "next/link";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <header className="nav">
        <div>
          <strong>Courses Platform</strong>
        </div>
        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/courses">Cursos</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>
      {children}
      <footer className="footer">
        <div>© 2026 Courses Platform — Formación empresarial</div>
      </footer>
    </div>
  );
}