import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { fetchJSON } from "@/lib/api";
import Link from "next/link";
import { requireRole } from "@/lib/requireRole";

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

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  requireRole(ctx, ["admin", "student"]);

export default function CourseDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchJSON<CourseDetail>(`/api/courses/${id}`)
      .then(setCourse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Layout>
      <button className="button secondary" onClick={() => router.push("/courses")}>Volver a cursos</button>

      {loading && <LoadingState label="Cargando curso..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && !course && (
        <EmptyState title="Curso no encontrado" description="Verifica la URL o vuelve al listado." />
      )}

      {course && (
        <>
          <section className="section">
            <h1 className="page-title">{course.title}</h1>
            <p className="meta">{course.description}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button className="button">Comenzar curso</button>
              <button className="button secondary">Continuar donde lo dejaste</button>
            </div>
          </section>

          <section className="section">
            <h2 className="page-title">Módulos y lecciones</h2>
            {course.modules?.length ? (
              course.modules.map((module) => (
                <div key={module.id} className="card" style={{ marginBottom: 12 }}>
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
          </section>

          <aside className="section">
            <h3>Progreso del curso</h3>
            <p className="meta">0% completado · 0/0 lecciones</p>
            <button className="button secondary">Ir a la siguiente lección</button>
          </aside>
        </>
      )}
    </Layout>
  );
}