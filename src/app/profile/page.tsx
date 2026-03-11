"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { Skeleton } from "@/components/Skeleton";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  updated_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabaseBrowser
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData({ full_name: data.full_name || "" });
    } catch {
      showToast("Error al cargar perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user || !profile) throw new Error("No user");

      const { error } = await supabaseBrowser
        .from("profiles")
        .update({ 
          full_name: formData.full_name,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);

      if (error) throw error;
      showToast("Perfil actualizado", "success");
    } catch {
      showToast("Error al actualizar perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <section className="surface page-hero">
        <Skeleton height="40px" width="200px" />
        <Skeleton height="200px" width="100%" style={{ marginTop: 20 }} />
      </section>
    );
  }

  return (
    <section className="surface page-hero">
      <h1 className="page-title">Perfil de usuario</h1>
      
      <div style={{ maxWidth: 500, marginTop: 20 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="meta" style={{ display: "block", marginBottom: 8 }}>
              Nombre completo
            </label>
            <input
              className="input"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Tu nombre"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="meta" style={{ display: "block", marginBottom: 8 }}>
              Rol
            </label>
            <input
              className="input"
              type="text"
              value={profile?.role || "student"}
              disabled
              style={{ opacity: 0.7 }}
            />
            <p className="meta" style={{ marginTop: 4, fontSize: 12 }}>
              El rol solo puede ser cambiado por un administrador
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" className="button" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <button type="button" className="button secondary" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
