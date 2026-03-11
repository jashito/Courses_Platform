"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import { EmptyState, ErrorState } from "@/components/States";
import { SkeletonList } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

interface CourseWithProgress {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  progress?: number;
  completed_lessons?: number;
  total_lessons?: number;
}

export default function MyCoursesPage() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        showToast("Debes iniciar sesión", "error");
        return;
      }

      const { data: progressData } = await supabaseBrowser
        .from("progress")
        .select("lesson_id, percent, status")
        .eq("user_id", user.id)
        .eq("status", "completed");

      const completedLessonIds = new Set(progressData?.map(p => p.lesson_id) || []);

      const { data: allCourses } = await supabaseBrowser
        .from("courses")
        .select("id, title, description, is_published")
        .eq("is_published", true);

      const coursesWithProgress = (allCourses || []).map(course => {
        const completedCount = Array.from(completedLessonIds).filter(id => id.startsWith(course.id)).length;
        return {
          ...course,
          progress: completedCount > 0 ? Math.min(100, completedCount * 10) : 0,
          completed_lessons: completedCount,
          total_lessons: 10,
        };
      });

      setCourses(coursesWithProgress);
    } catch {
      setError("Error al cargar tus cursos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="surface page-hero">
        <h1 className="page-title">Mis cursos</h1>
        <SkeletonList count={3} />
      </section>
    );
  }

  if (error) {
    return (
      <section className="surface page-hero">
        <h1 className="page-title">Mis cursos</h1>
        <ErrorState message={error} />
      </section>
    );
  }

  return (
    <section className="surface page-hero">
      <h1 className="page-title">Mis cursos</h1>
      <p className="meta">Continúa donde lo dejaste</p>

      {courses.length === 0 ? (
        <EmptyState
          title="No tienes cursos"
          description="Explora el catálogo y matricúlate en un curso."
        >
          <Link className="button" href="/courses">
            Ver catálogo
          </Link>
        </EmptyState>
      ) : (
        <section className="grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              status={course.is_published ? "Publicado" : "Borrador"}
              progress={course.progress}
            />
          ))}
        </section>
      )}

      <section className="section" style={{ marginTop: 32 }}>
        <h2 className="section-title">Estadísticas</h2>
        <div className="grid">
          <div className="card">
            <h3>Cursos en progreso</h3>
            <p className="meta" style={{ fontSize: 24 }}>
              {courses.filter(c => (c.progress || 0) > 0 && (c.progress || 0) < 100).length}
            </p>
          </div>
          <div className="card">
            <h3>Cursos completados</h3>
            <p className="meta" style={{ fontSize: 24 }}>
              {courses.filter(c => c.progress === 100).length}
            </p>
          </div>
          <div className="card">
            <h3>Total de cursos</h3>
            <p className="meta" style={{ fontSize: 24 }}>
              {courses.length}
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
