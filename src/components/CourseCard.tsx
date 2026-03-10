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
      <h3>{title}</h3>
      {description && <p className="meta">{description}</p>}
      {status && <span className="badge">{status}</span>}
      {typeof progress === "number" && <p className="meta">Progreso: {progress}%</p>}
      <Link className="button link" href={`/courses/${id}`}>Ver curso</Link>
    </div>
  );
}