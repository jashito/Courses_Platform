import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState, ErrorState, EmptyState } from '@/components/States';

describe('States', () => {
  describe('LoadingState', () => {
    it('renders loading label', () => {
      render(<LoadingState label="Cargando..." />);
      expect(screen.getByText('Cargando...')).toBeDefined();
    });
  });

  describe('ErrorState', () => {
    it('renders error message', () => {
      render(<ErrorState message="Error de prueba" />);
      expect(screen.getByText('Error de prueba')).toBeDefined();
    });
  });

  describe('EmptyState', () => {
    it('renders title and description', () => {
      render(<EmptyState title="Sin datos" description="No hay información disponible" />);
      expect(screen.getByText('Sin datos')).toBeDefined();
      expect(screen.getByText('No hay información disponible')).toBeDefined();
    });
  });
});
