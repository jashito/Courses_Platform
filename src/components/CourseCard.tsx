import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
  progress?: number;
  imageUrl?: string;
}

const defaultImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%230b4f4e' width='400' height='200'/%3E%3Ctext fill='%23e2b23b' font-family='sans-serif' font-size='24' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ECourse%3C/text%3E%3C/svg%3E";

export default function CourseCard({ id, title, description, status, progress, imageUrl }: CourseCardProps) {
  return (
    <div className="card">
      <div style={{ position: 'relative', width: '100%', height: 160, marginBottom: 12, borderRadius: 8, overflow: 'hidden' }}>
        <Image
          src={imageUrl || defaultImage}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {status && <span className="badge">{status}</span>}
      <h3>{title}</h3>
      {description && <p className="meta">{description}</p>}
      {typeof progress === "number" && <p className="meta">Progreso: {progress}%</p>}
      <div className="nav-actions">
        <Link className="button link" href={`/courses/${id}`}>
          Ver programa
        </Link>
      </div>
    </div>
  );
}