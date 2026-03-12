"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/Toast";
import { Skeleton } from "@/components/Skeleton";

interface Course {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

interface User {
  id: string;
  user_id: string;
  full_name: string | null;
  role: string;
  email: string;
  updated_at: string;
}

interface CourseFormData {
  title: string;
  description: string;
  is_published: boolean;
}

type TabType = "courses" | "users";

export default function AdminPage() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("courses");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    is_published: false,
  });

  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data || []);
    } catch {
      showToast("Error al cargar cursos", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUsers(data || []);
    } catch {
      showToast("Error al cargar usuarios", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : "/api/courses";
      const method = editingCourse ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar");

      showToast(editingCourse ? "Curso actualizado" : "Curso creado", "success");
      setShowModal(false);
      setEditingCourse(null);
      setFormData({ title: "", description: "", is_published: false });
      fetchCourses();
    } catch {
      showToast("Error al guardar curso", "error");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este curso?")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Curso eliminado", "success");
      fetchCourses();
    } catch {
      showToast("Error al eliminar curso", "error");
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      await fetch(`/api/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !course.is_published }),
      });
      showToast(course.is_published ? "Curso despublicado" : "Curso publicado", "success");
      fetchCourses();
    } catch {
      showToast("Error al cambiar estado", "error");
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, role: newRole }),
      });

      if (!res.ok) throw new Error();
      showToast("Rol actualizado", "success");
      fetchUsers();
    } catch {
      showToast("Error al actualizar rol", "error");
    }
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || "",
      is_published: course.is_published,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({ title: "", description: "", is_published: false });
    setShowModal(true);
  };

  return (
    <section className="section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 className="page-title">Panel de administración</h1>
        {activeTab === "courses" && (
          <button className="button" onClick={openCreateModal}>
            Crear curso
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
        <button
          className={`button ${activeTab === "courses" ? "" : "secondary"}`}
          onClick={() => setActiveTab("courses")}
        >
          Cursos
        </button>
        <button
          className={`button ${activeTab === "users" ? "" : "secondary"}`}
          onClick={() => setActiveTab("users")}
        >
          Usuarios
        </button>
      </div>

      {activeTab === "courses" && (
        <>
          <section className="section">
            <h2 className="section-title">Cursos</h2>
            {loading ? (
              <div className="grid">
                <Skeleton height="120px" />
                <Skeleton height="120px" />
              </div>
            ) : courses.length === 0 ? (
              <p className="meta">No hay cursos. Crea el primero.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {courses.map((course) => (
                  <div key={course.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{course.title}</h3>
                      <span className="badge" style={{ marginTop: 4 }}>{course.is_published ? "Publicado" : "Borrador"}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="button secondary" onClick={() => handleTogglePublish(course)}>
                        {course.is_published ? "Despublicar" : "Publicar"}
                      </button>
                      <button className="button secondary" onClick={() => openEditModal(course)}>Editar</button>
                      <button className="button secondary" style={{ color: "#ef4444" }} onClick={() => handleDeleteCourse(course.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="section">
            <h2 className="section-title">Métricas rápidas</h2>
            <div className="grid">
              <div className="card">
                <h3>Total de cursos</h3>
                <p className="meta" style={{ fontSize: 24 }}>{courses.length}</p>
              </div>
              <div className="card">
                <h3>Cursos publicados</h3>
                <p className="meta" style={{ fontSize: 24 }}>{courses.filter(c => c.is_published).length}</p>
              </div>
              <div className="card">
                <h3>Cursos en borrador</h3>
                <p className="meta" style={{ fontSize: 24 }}>{courses.filter(c => !c.is_published).length}</p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "users" && (
        <section className="section">
          <h2 className="section-title">Usuarios</h2>
          {loading ? (
            <div className="grid">
              <Skeleton height="80px" />
              <Skeleton height="80px" />
            </div>
          ) : users.length === 0 ? (
            <p className="meta">No hay usuarios registrados.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {users.map((user) => (
                <div key={user.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{user.full_name || "Sin nombre"}</h3>
                    <p className="meta" style={{ fontSize: 13 }}>{user.email}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <label className="meta">Rol:</label>
                    <select
                      className="input"
                      style={{ width: "auto", padding: "8px 12px" }}
                      value={user.role || "student"}
                      onChange={(e) => handleUpdateUserRole(user.user_id, e.target.value)}
                    >
                      <option value="student">Estudiante</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {showModal && activeTab === "courses" && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 9999
        }} onClick={() => setShowModal(false)}>
          <div className="card" style={{ width: 400, maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
            <h2>{editingCourse ? "Editar curso" : "Nuevo curso"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label className="meta" style={{ display: "block", marginBottom: 4 }}>Título</label>
                <input
                  className="input"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="meta" style={{ display: "block", marginBottom: 4 }}>Descripción</label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                  />
                  <span className="meta">Publicado</span>
                </label>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" className="button secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="button">{editingCourse ? "Actualizar" : "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
