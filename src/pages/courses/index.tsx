import type { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import CourseCard from "@/components/CourseCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { fetchJSON } from "@/lib/api";
import { requireRole } from "@/lib/requireRole";

interface Course {
  id: string;
  title: string;
  description?: string | null;
  is_published: boolean;
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  requireRole(ctx, ["admin", "student"]);

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJSON<Course[]>("/api/courses")
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((course) =>
    course.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Layout>
      <section className="section">
        <h1 className="page-title">Cursos disponibles</h1>
        <input
          placeholder="Buscar curso por nombre"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ padding: 10, width: "100%", borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
      </section>

      {loading && <LoadingState label="Cargando cursos..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title="No hay cursos disponibles"
          description="Vuelve más tarde o contacta al administrador para nuevas publicaciones."
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <section className="grid">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              status={course.is_published ? "Publicado" : "Borrador"}
            />
          ))}
        </section>
      )}
    </Layout>
  );
}