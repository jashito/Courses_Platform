"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { fetchJSON } from "@/lib/api";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseDetail {
  id: string;
  title: string;
  description?: string | null;
  modules: Module[];
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    fetchJSON<CourseDetail>(`/api/courses/${params.id}`)
      .then(setCourse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <>
      <button className="button secondary" onClick={() => router.push("/courses")}>
        Volver a cursos
      </button>

      {loading && <LoadingState label="Cargando curso..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && !course && (
        <EmptyState title="Curso no encontrado" description="Verifica la URL o vuelve al listado." />
      )}

      {course && (
        <>
          <section className="surface page-hero">
            <span className="pill">Programa premium</span>
            <h1 className="page-title">{course.title}</h1>
            <p className="meta">{course.description}</p>
            <div className="nav-actions">
              <button className="button">Comenzar curso</button>
              <button className="button secondary">Continuar donde lo dejaste</button>
            </div>
          </section>

          <section className="split">
            <div className="surface">
              <h2 className="section-title">Módulos y lecciones</h2>
              {course.modules?.length ? (
                course.modules.map((module) => (
                  <div key={module.id} className="card soft" style={{ marginBottom: 12 }}>
                    <h3>{module.title}</h3>
                    <ul className="meta">
                      {module.lessons?.map((lesson) => (
                        <li key={lesson.id}>
                          <Link href={`/lessons/${lesson.id}`}>{lesson.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="meta">Aún no hay módulos cargados.</p>
              )}
            </div>

            <aside className="surface">
              <h3 className="section-title">Progreso del curso</h3>
              <p className="meta">0% completado · 0/0 lecciones</p>
              <div className="list">
                <div className="card soft">Siguiente lección en preparación.</div>
                <div className="card soft">Material descargable próximamente.</div>
              </div>
              <button className="button secondary" style={{ marginTop: 16 }}>
                Ir a la siguiente lección
              </button>
            </aside>
          </section>
        </>
      )}
    </>
  );
}
