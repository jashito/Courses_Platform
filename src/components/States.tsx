import type { ReactNode } from "react";

export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="surface">
      <p className="meta">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <div className="surface">
      <h3>{title}</h3>
      <p className="meta">{description}</p>
      {children}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="surface">
      <h3>Ups, hubo un problema</h3>
      <p className="meta">{message}</p>
    </div>
  );
}