import Layout from "@/components/Layout";

const courses = [
  { id: "1", title: "Introducción a OKRs", status: "Publicado" },
  { id: "2", title: "Liderazgo estratégico", status: "Borrador" }
];

export default function AdminPage() {
  return (
    <Layout>
      <section className="section">
        <h1 className="page-title">Panel de administración</h1>
        <div className="meta">Gestiona cursos, módulos y lecciones.</div>
      </section>

      <section className="section">
        <h2 className="page-title">Cursos</h2>
        <button className="button">Crear nuevo curso</button>
        <div style={{ marginTop: 16 }}>
          {courses.map((course) => (
            <div key={course.id} className="card" style={{ marginBottom: 12 }}>
              <h3>{course.title}</h3>
              <span className="badge">{course.status}</span>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button className="button secondary">Editar</button>
                <button className="button secondary">Ver módulos</button>
                <button className="button secondary">Publicar/Despublicar</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="page-title">Métricas rápidas</h2>
        <div className="grid">
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
      </section>
    </Layout>
  );
}