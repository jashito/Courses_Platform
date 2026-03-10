import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const videoUrl =
  "https://daxgprrxtmufcexrosmt.supabase.co/storage/v1/object/public/resources/6913005_Motion_Graphics_Motion_Graphic_3840x2160.mp4";

export default function LoginPage() {
  const router = useRouter();
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
      const returnTo = typeof router.query.returnTo === "string" ? router.query.returnTo : "";
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
  }, [router]);

  const handleGoogleLogin = async () => {
    setError(null);
    const { error: signInError } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined
      }
    });

    if (signInError) {
      setError(signInError.message);
    }
  };

  return (
    <Layout>
      <section className="login-hero">
        <video className="login-video" autoPlay muted loop playsInline preload="metadata">
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="login-overlay" />

        <div className="split login-content">
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
        </div>
      </section>
    </Layout>
  );
}
