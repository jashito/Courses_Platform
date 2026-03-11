"use client";

import { useRouter } from "next/navigation";
import { EmptyState, ErrorState } from "@/components/States";
import { Skeleton } from "@/components/Skeleton";
import { useFetch } from "@/lib/useFetch";
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

function CourseDetailSkeleton() {
  return (
    <>
      <button className="button secondary" disabled>Volver a cursos</button>
      <section className="surface page-hero">
        <Skeleton height="24px" width="120px" />
        <Skeleton height="42px" width="80%" style={{ marginTop: 12 }} />
        <Skeleton height="20px" width="60%" style={{ marginTop: 8 }} />
        <div className="nav-actions" style={{ marginTop: 16 }}>
          <Skeleton height="44px" width="160px" />
          <Skeleton height="44px" width="180px" />
        </div>
      </section>
      <section className="split">
        <div className="surface">
          <Skeleton height="28px" width="200px" />
          <Skeleton height="80px" width="100%" style={{ marginTop: 12 }} />
          <Skeleton height="80px" width="100%" style={{ marginTop: 12 }} />
        </div>
        <aside className="surface">
          <Skeleton height="28px" width="180px" />
          <Skeleton height="20px" width="140px" style={{ marginTop: 8 }} />
        </aside>
      </section>
    </>
  );
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: course, isLoading, error } = useFetch<CourseDetail>(`/api/courses/${params.id}`);

  return (
    <>
      <button className="button secondary" onClick={() => router.push("/courses")}>
        Volver a cursos
      </button>

      {isLoading && <CourseDetailSkeleton />}
      {error && <ErrorState message={error.message} />}

      {!isLoading && !error && !course && (
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
              {course.modules && course.modules.length > 0 ? (
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
                <div className="card soft">Material descargable próximos.</div>
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
