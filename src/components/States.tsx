export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="section">
      <p className="meta">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="section">
      <h3>{title}</h3>
      <p className="meta">{description}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="section">
      <h3>Ups, hubo un problema</h3>
      <p className="meta">{message}</p>
    </div>
  );
}