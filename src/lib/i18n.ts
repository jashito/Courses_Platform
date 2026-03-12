export type Language = "es" | "en";

export interface Translations {
  nav: {
    home: string;
    programs: string;
    blog: string;
    contact: string;
    pricing: string;
    login: string;
    logout: string;
    profile: string;
    admin: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    statsUsers: string;
    statsCourses: string;
    statsRating: string;
    footer: string;
  };
}

const es: Translations = {
  nav: {
    home: "Inicio",
    programs: "Programas",
    blog: "Blog",
    contact: "Contacto",
    pricing: "Precios",
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    profile: "Perfil",
    admin: "Admin",
  },
  home: {
    heroTitle: "Transforma tu carrera profesional",
    heroSubtitle: "Domina las habilidades más demandadas del mercado con programas diseñados por líderes de la industria tecnológica.",
    ctaPrimary: "Comenzar ahora",
    ctaSecondary: "Ver programas",
    feature1Title: "Aprende de expertos",
    feature1Desc: "Instructores con experiencia en las mejores empresas de tecnología.",
    feature2Title: "Aprende a tu ritmo",
    feature2Desc: "Contenido disponible 24/7. Avanza cuando y donde quieras.",
    feature3Title: "Certificados reconocidos",
    feature3Desc: "Obtén credenciales que impulsan tu perfil profesional.",
    statsUsers: "Estudiantes",
    statsCourses: "Programas",
    statsRating: "Rating",
    footer: "© 2026 Effort-U. Todos los derechos reservados.",
  },
};

const en: Translations = {
  nav: {
    home: "Home",
    programs: "Programs",
    blog: "Blog",
    contact: "Contact",
    pricing: "Pricing",
    login: "Sign in",
    logout: "Sign out",
    profile: "Profile",
    admin: "Admin",
  },
  home: {
    heroTitle: "Transform Your Professional Career",
    heroSubtitle: "Master the most in-demand skills in the market with programs designed by industry leaders.",
    ctaPrimary: "Get Started",
    ctaSecondary: "View Programs",
    feature1Title: "Learn from Experts",
    feature1Desc: "Instructors with experience at top tech companies.",
    feature2Title: "Learn at Your Pace",
    feature2Desc: "Available 24/7. Advance whenever and wherever you want.",
    feature3Title: "Recognized Certificates",
    feature3Desc: "Earn credentials that boost your professional profile.",
    statsUsers: "Students",
    statsCourses: "Programs",
    statsRating: "Rating",
    footer: "© 2026 Effort-U. All rights reserved.",
  },
};

export const translations: Record<Language, Translations> = { es, en };

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
