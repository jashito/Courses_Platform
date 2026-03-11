"use client";

import { useState, useMemo } from "react";
import CourseCard from "@/components/CourseCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { useFetch } from "@/lib/useFetch";

interface Course {
  id: string;
  title: string;
  description?: string | null;
  is_published: boolean;
}

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const { data: courses, isLoading, error } = useFetch<Course[]>("/api/courses");

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [courses, query]);

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

      {isLoading && <LoadingState label="Cargando cursos..." />}
      {error && <ErrorState message={error.message} />}

      {!isLoading && !error && filtered.length === 0 && (
        <EmptyState
          title="No hay cursos disponibles"
          description="Vuelve más tarde o contacta al administrador para nuevas publicaciones."
        />
      )}

      {!isLoading && !error && filtered.length > 0 && (
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
