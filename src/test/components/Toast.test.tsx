import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '@/components/Toast';

function TestComponent() {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast('Test message', 'success')}>Show Toast</button>
  );
}

describe('Toast', () => {
  it('renders toast message when showToast is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText('Show Toast');
    fireEvent.click(button);
    
    expect(screen.getByText('Test message')).toBeDefined();
  });

  it('has correct class for success type', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByText('Show Toast'));
    
    const toast = screen.getByText('Test message');
    expect(toast.className).toBe('toast toast-success');
  });
});
