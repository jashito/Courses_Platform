"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { fetchJSON } from "@/lib/api";

interface LessonDetail {
  id: string;
  title: string;
  content?: string | null;
  video_url?: string | null;
  resources: { id: string; title: string; url: string; resource_type: string }[];
  quizzes: { id: string; title: string }[];
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    fetchJSON<LessonDetail>(`/api/lessons/${params.id}`)
      .then(setLesson)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <>
      {loading && <LoadingState label="Cargando lección..." />}
      {error && <ErrorState message={error} />}
      {!loading && !error && !lesson && (
        <EmptyState title="Lección no encontrada" description="Revisa el enlace o vuelve al curso." />
      )}

      {lesson && (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 1fr" }}>
          <section className="section">
            <div className="meta">Curso · Módulo · Lección</div>
            <h1 className="page-title">{lesson.title}</h1>
            <span className="badge">En progreso</span>

            <div style={{ marginTop: 16 }}>
              <h3>Contenido</h3>
              <div className="meta">
                {lesson.content || "Contenido de la lección (HTML/Markdown)"}
              </div>
            </div>

            {lesson.video_url && (
              <div style={{ marginTop: 16 }}>
                <h3>Video</h3>
                <div className="meta">Video embebido desde {lesson.video_url}</div>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <h3>Recursos</h3>
              {lesson.resources?.length ? (
                <ul className="meta">
                  {lesson.resources.map((resource) => (
                    <li key={resource.id}>
                      <a href={resource.url} target="_blank" rel="noreferrer">
                        {resource.title} ({resource.resource_type})
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="meta">No hay recursos asociados.</p>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <h3>Evaluación</h3>
              {lesson.quizzes?.length ? (
                <div className="card">
                  <h4>{lesson.quizzes[0].title}</h4>
                  <p className="meta">Completa el quiz para cerrar la lección.</p>
                  <button className="button">Responder evaluación</button>
                </div>
              ) : (
                <p className="meta">No hay quiz para esta lección.</p>
              )}
            </div>
          </section>

          <aside className="section">
            <h3>Progreso</h3>
            <p className="meta">Estado: En progreso</p>
            <button className="button">Marcar como completada</button>
            <div style={{ marginTop: 20 }}>
              <button className="button secondary">Lección anterior</button>
              <button className="button secondary" style={{ marginLeft: 8 }}>
                Siguiente lección
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
