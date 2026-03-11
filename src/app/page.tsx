import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div>
          <span className="pill">Plataforma premium de aprendizaje</span>
          <h1>Capacitación empresarial que transforma equipos</h1>
          <p>
            Diseña itinerarios con foco en OKRs, liderazgo y estrategia. Mide el avance y acelera resultados con una
            experiencia elegante y simple.
          </p>
          <div className="nav-actions">
            <Link className="button" href="/courses">
              Explorar programas
            </Link>
            <Link className="button ghost" href="/login">
              Acceder
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="grid tight">
            <div className="stat">
              <strong>+40%</strong>
              <span className="meta">Mejora en foco estratégico</span>
            </div>
            <div className="stat">
              <strong>12 semanas</strong>
              <span className="meta">Roadmaps ejecutivos</span>
            </div>
            <div className="stat">
              <strong>Seguimiento</strong>
              <span className="meta">Paneles y métricas en tiempo real</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-hero">
          <h2 className="section-title">Rutas de alto impacto</h2>
          <p className="meta">Programas diseñados para líderes y equipos que quieren ejecutar con claridad.</p>
        </div>
        <div className="grid">
          <div className="card soft">
            <span className="badge">Estrategia</span>
            <h3>OKRs para organizaciones modernas</h3>
            <p className="meta">Frameworks accionables, seguimiento continuo y alineación total.</p>
            <Link className="button link" href="/courses">
              Conocer ruta
            </Link>
          </div>
          <div className="card soft">
            <span className="badge">Liderazgo</span>
            <h3>Liderazgo consciente y toma de decisiones</h3>
            <p className="meta">Potencia a los líderes con herramientas de comunicación y coaching.</p>
            <Link className="button link" href="/courses">
              Conocer ruta
            </Link>
          </div>
          <div className="card soft">
            <span className="badge">Gestión</span>
            <h3>Escalamiento de equipos de alto desempeño</h3>
            <p className="meta">Cultura, métricas y execution playbooks para crecer sin fricción.</p>
            <Link className="button link" href="/courses">
              Conocer ruta
            </Link>
          </div>
        </div>
      </section>

      <section className="split">
        <div className="surface">
          <h2 className="section-title">¿Cómo funciona?</h2>
          <p className="meta">Todo listo para que tu equipo aprenda, mida y evolucione.</p>
          <div className="list">
            <div className="card soft">Activa cohortes y crea rutas personalizadas.</div>
            <div className="card soft">Comparte insights con tus líderes en segundos.</div>
            <div className="card soft">Monitoriza progreso y certificaciones sin esfuerzo.</div>
          </div>
        </div>
        <div className="surface">
          <h2 className="section-title">Experiencia premium</h2>
          <p className="meta">Todo el contenido visual y los espacios están optimizados para claridad y velocidad.</p>
          <div className="list">
            <div className="card soft">UI elegante con modo oscuro opcional.</div>
            <div className="card soft">Cards dinámicas, métricas y tableros ejecutivos.</div>
            <div className="card soft">Onboarding guiado para equipos distribuidos.</div>
          </div>
        </div>
      </section>
    </>
  );
}
