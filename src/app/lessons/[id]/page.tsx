"use client";

import { useEffect, useState } from "react";
import { EmptyState, ErrorState } from "@/components/States";
import { Skeleton } from "@/components/Skeleton";
import { useFetch } from "@/lib/useFetch";
import { useToast } from "@/components/Toast";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { detectResourceType, getResourceIcon, getResourceTypeLabel } from "@/lib/resourceUtils";

interface Resource {
  id: string;
  title: string;
  url: string;
  resource_type: string;
}

interface Quiz {
  id: string;
  title: string;
}

interface LessonDetail {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  resources: Resource[];
  quizzes: Quiz[];
}

interface Progress {
  id: string;
  lesson_id: string;
  status: string;
  percent: number;
  completed_at: string | null;
}

function LessonSkeleton() {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 1fr" }}>
      <section className="section">
        <Skeleton height="20px" width="150px" />
        <Skeleton height="40px" width="60%" style={{ marginTop: 8 }} />
        <Skeleton height="24px" width="100px" style={{ marginTop: 12 }} />
        <Skeleton height="200px" width="100%" style={{ marginTop: 16 }} />
      </section>
      <aside className="section">
        <Skeleton height="28px" width="100px" />
        <Skeleton height="44px" width="100%" style={{ marginTop: 8 }} />
      </aside>
    </div>
  );
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const { showToast } = useToast();
  const { data: lesson, isLoading, error } = useFetch<LessonDetail>(`/api/lessons/${params.id}`);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, [params.id]);

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) return;

      const res = await fetch(`/api/progress?lesson_id=${params.id}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setProgress(data[0]);
      }
    } catch {
      // Ignore progress fetch errors
    }
  };

  const handleMarkComplete = async () => {
    setCompleting(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: params.id,
          status: "completed",
          percent: 100,
        }),
      });

      if (!res.ok) throw new Error();
      showToast("Lección marcada como completada", "success");
      fetchProgress();
    } catch {
      showToast("Error al guardar progreso", "error");
    } finally {
      setCompleting(false);
    }
  };

  const isCompleted = progress?.status === "completed";

  return (
    <>
      {isLoading && <LessonSkeleton />}
      {error && <ErrorState message={error.message} />}
      {!isLoading && !error && !lesson && (
        <EmptyState title="Lección no encontrada" description="Revisa el enlace o vuelve al curso." />
      )}

      {lesson && (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 1fr" }}>
          <section className="section">
            <div className="meta">Curso · Módulo · Lección</div>
            <h1 className="page-title">{lesson.title}</h1>
            <span className={`badge ${isCompleted ? "" : ""}`}>
              {isCompleted ? "Completada" : "En progreso"}
            </span>

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
              {lesson.resources && lesson.resources.length > 0 ? (
                <ul className="meta">
                  {lesson.resources.map((resource) => {
                    const detectedType = (resource.resource_type as string) || detectResourceType(resource.url);
                    return (
                      <li key={resource.id}>
                        <a href={resource.url} target="_blank" rel="noreferrer">
                          {getResourceIcon(detectedType as any)} {resource.title} ({getResourceTypeLabel(detectedType as any)})
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="meta">No hay recursos asociados.</p>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <h3>Evaluación</h3>
              {lesson.quizzes && lesson.quizzes.length > 0 ? (
                <div className="card">
                  <h4>{lesson.quizzes[0]?.title}</h4>
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
            <p className="meta">
              Estado: {isCompleted ? "Completada" : "En progreso"}
              {progress?.percent && ` (${progress.percent}%)`}
            </p>
            <button 
              className="button" 
              onClick={handleMarkComplete}
              disabled={completing || isCompleted}
            >
              {completing 
                ? "Guardando..." 
                : isCompleted 
                  ? "Completada" 
                  : "Marcar como completada"}
            </button>
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
