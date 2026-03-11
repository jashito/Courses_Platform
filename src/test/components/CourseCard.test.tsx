import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CourseCard from '@/components/CourseCard';

vi.mock('next/image', () => ({
  default: (props: { src: string; alt: string; fill?: boolean; style?: React.CSSProperties; sizes?: string }) => 
    <img src={props.src} alt={props.alt} />,
}));

describe('CourseCard', () => {
  const mockProps = {
    id: '1',
    title: 'Test Course',
    description: 'Test description',
    status: 'Publicado',
  };

  it('renders course title', () => {
    render(<CourseCard {...mockProps} />);
    expect(screen.getByText('Test Course')).toBeDefined();
  });

  it('renders description when provided', () => {
    render(<CourseCard {...mockProps} />);
    expect(screen.getByText('Test description')).toBeDefined();
  });

  it('renders status badge when provided', () => {
    render(<CourseCard {...mockProps} />);
    expect(screen.getByText('Publicado')).toBeDefined();
  });

  it('renders progress when provided', () => {
    render(<CourseCard {...mockProps} progress={50} />);
    expect(screen.getByText('Progreso: 50%')).toBeDefined();
  });

  it('renders link to course detail', () => {
    render(<CourseCard {...mockProps} />);
    const link = screen.getByRole('link', { name: /ver programa/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/courses/1');
  });
});
