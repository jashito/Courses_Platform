"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18n";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <section className="hero-modern">
        <span className="pill">Professional Learning Platform</span>
        <h1>{t.home.heroTitle}</h1>
        <p>{t.home.heroSubtitle}</p>
        
        <div className="hero-cta">
          <Link className="button primary" href="/courses">
            {t.home.ctaPrimary}
          </Link>
          <Link className="button secondary" href="/courses">
            {t.home.ctaSecondary}
          </Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <strong>10K+</strong>
            <span>{t.home.statsUsers}</span>
          </div>
          <div className="hero-stat">
            <strong>50+</strong>
            <span>{t.home.statsCourses}</span>
          </div>
          <div className="hero-stat">
            <strong>4.9</strong>
            <span>{t.home.statsRating}</span>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>{t.home.feature1Title}</h3>
          <p>{t.home.feature1Desc}</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>{t.home.feature2Title}</h3>
          <p>{t.home.feature2Desc}</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>{t.home.feature3Title}</h3>
          <p>{t.home.feature3Desc}</p>
        </div>
      </section>
    </>
  );
}
