import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
  progress?: number;
}

export default function CourseCard({ id, title, description, status, progress }: CourseCardProps) {
  return (
    <div className="card">
      {status && <span className="badge">{status}</span>}
      <h3>{title}</h3>
      {description && <p className="meta">{description}</p>}
      {typeof progress === "number" && <p className="meta">Progreso: {progress}%</p>}
      <div className="nav-actions">
        <Link className="button link" href={`/courses/${id}`}>\n          Ver programa
        </Link>
      </div>
    </div>
  );
}