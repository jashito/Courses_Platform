const courses = [
  { id: "1", title: "Introducción a OKRs", status: "Publicado" },
  { id: "2", title: "Liderazgo estratégico", status: "Borrador" }
];

export default function AdminPage() {
  return (
    <section className="section">
      <h1 className="page-title">Panel de administración</h1>
      <div className="meta">Gestiona cursos, módulos y lecciones.</div>
    </section>
  );
}
