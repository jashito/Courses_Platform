import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

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
      <section className="section">
        <h1 className="page-title">Inicia sesión</h1>
        <p className="meta">Accede con tu cuenta de Google para continuar.</p>

        <div style={{ marginTop: 20 }}>
          <button className="button" onClick={handleGoogleLogin} disabled={loading}>
            Iniciar con Google
          </button>
        </div>

        {loading && <p className="meta" style={{ marginTop: 12 }}>Comprobando sesión...</p>}
        {error && <p className="meta" style={{ marginTop: 12, color: "#dc2626" }}>{error}</p>}
      </section>
    </Layout>
  );
}