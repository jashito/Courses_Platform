import type { GetServerSideProps } from "next";
import Layout from "@/components/Layout";
import { requireRole } from "@/lib/requireRole";

const courses = [
  { id: "1", title: "Introducción a OKRs", status: "Publicado" },
  { id: "2", title: "Liderazgo estratégico", status: "Borrador" }
];

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  requireRole(ctx, ["admin"]);

export default function AdminPage() {
  return (
    <Layout>
      <section className="surface page-hero">
        <span className="pill">Panel ejecutivo</span>
        <h1 className="page-title">Panel de administración</h1>
        <p className="meta">Gestiona cursos, módulos, cohortes y métricas en un solo lugar.</p>
      </section>

      <section className="split">
        <div className="surface">
          <h2 className="section-title">Acciones rápidas</h2>
          <div className="grid">
            <div className="card soft">
              <h3>Crear nuevo curso</h3>
              <p className="meta">Diseña rutas premium y asigna instructores.</p>
              <button className="button">Crear</button>
            </div>
            <div className="card soft">
              <h3>Gestionar cohortes</h3>
              <p className="meta">Coordina equipos y calendarios de aprendizaje.</p>
              <button className="button secondary">Ver cohortes</button>
            </div>
          </div>
        </div>

        <div className="surface">
          <h2 className="section-title">Métricas rápidas</h2>
          <div className="grid tight">
            <div className="card">
              <h3>Estudiantes activos</h3>
              <p className="meta">--</p>
            </div>
            <div className="card">
              <h3>Tasa de finalización</h3>
              <p className="meta">--</p>
            </div>
            <div className="card">
              <h3>Promedio de quizzes</h3>
              <p className="meta">--</p>
            </div>
          </div>
        </div>
      </section>

      <section className="surface">
        <h2 className="section-title">Cursos</h2>
        <div className="list">
          {courses.map((course) => (
            <div key={course.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3>{course.title}</h3>
                  <span className="badge">{course.status}</span>
                </div>
                <div className="nav-actions">
                  <button className="button secondary">Editar</button>
                  <button className="button secondary">Ver módulos</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}