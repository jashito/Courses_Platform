import Link from "next/link";
import Layout from "@/components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <section className="section">
        <h1 className="page-title">Capacitación empresarial basada en resultados</h1>
        <p className="meta">
          Forma a tu equipo en OKRs, liderazgo y estrategia con cursos prácticos y seguimiento de progreso.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Link className="button" href="/courses">
            Ver cursos
          </Link>
          <Link className="button secondary" href="/login">
            Iniciar sesión
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="page-title">Curso destacado</h2>
        <div className="card">
          <h3>Introducción a los OKRs</h3>
          <p className="meta">
            Aprende a definir objetivos claros y medir resultados con un enfoque práctico.
          </p>
          <Link className="button link" href="/courses">
            Ver detalles
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="page-title">¿Cómo funciona?</h2>
        <ol className="meta">
          <li>Regístrate o inicia sesión.</li>
          <li>Elige un curso y comienza el primer módulo.</li>
          <li>Completa lecciones y responde evaluaciones.</li>
          <li>Monitorea tu progreso en tiempo real.</li>
        </ol>
      </section>
    </Layout>
  );
}