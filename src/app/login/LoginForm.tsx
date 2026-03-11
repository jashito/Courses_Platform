"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const handleRedirect = async () => {
      const { data: authData } = await supabaseBrowser.auth.getUser();
      if (!active) return;

      if (!authData.user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabaseBrowser
        .from("profiles")
        .select("role")
        .eq("user_id", authData.user.id)
        .single();

      const role = profile?.role ?? "student";
      const returnTo = searchParams.get("returnTo") || "";
      const destination = returnTo || (role === "admin" ? "/admin" : "/courses");
      router.replace(destination);
    };

    handleRedirect();

    const { data: subscription } = supabaseBrowser.auth.onAuthStateChange(() => {
      handleRedirect();
    });

    return () => {
      active = false;
      subscription?.subscription.unsubscribe();
    };
  }, [router, searchParams]);

  const handleGoogleLogin = async () => {
    setError(null);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const { error: signInError } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${baseUrl}/login`
      }
    });

    if (signInError) {
      setError(signInError.message);
    }
  };

  return (
    <section className="split">
      <div className="surface">
        <span className="pill">Acceso seguro</span>
        <h1 className="page-title">Bienvenido a tu campus corporativo</h1>
        <p className="meta">
          Gestiona rutas de capacitación, módulos y evaluaciones con un diseño hecho para equipos ejecutivos.
        </p>
        <div className="list">
          <div className="card soft">Acceso centralizado para líderes y estudiantes.</div>
          <div className="card soft">Paneles inteligentes con métricas clave.</div>
          <div className="card soft">Aprendizaje guiado con foco en resultados.</div>
        </div>
      </div>

      <div className="login-card">
        <h2 className="section-title">Inicia sesión</h2>
        <p className="meta">Accede con tu cuenta de Google para continuar.</p>
        <div style={{ marginTop: 20 }}>
          <button className="button" onClick={handleGoogleLogin} disabled={loading}>
            Iniciar con Google
          </button>
        </div>
        {loading && <p className="meta" style={{ marginTop: 12 }}>Comprobando sesión...</p>}
        {error && <p className="meta" style={{ marginTop: 12, color: "#dc2626" }}>{error}</p>}
      </div>
    </section>
  );
}
