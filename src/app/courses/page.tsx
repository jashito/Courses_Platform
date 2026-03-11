"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { fetchJSON } from "@/lib/api";

interface Course {
  id: string;
  title: string;
  description?: string | null;
  is_published: boolean;
}

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
    <section className="surface page-hero">
      <h1 className="page-title">Catálogo ejecutivo</h1>
      <p className="meta">Programas premium listos para impulsar el desempeño.</p>
      <input
        className="input"
        placeholder="Buscar curso por nombre"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

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
    </section>
  );
}
