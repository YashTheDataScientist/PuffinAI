/* eslint-env jest */
import { render, screen, fireEvent, } from '@testing-library/react';
import SubscribeForm from './SubscribeForm';
import { vi } from 'vitest';

// mock fetch
beforeAll(() => {
    global.fetch = vi.fn();
  });
  
  beforeEach(() => {
    fetch.mockClear();
  });
  

describe('SubscribeForm component', () => {
  test('renders input and button', () => {
    render(<SubscribeForm />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  test('shows invalid email message', async () => {
    render(<SubscribeForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  test('shows success popup on valid email', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'success' })
    });

    render(<SubscribeForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));

    expect(await screen.findByText(/you're subscribed/i)).toBeInTheDocument();
  });

  test('shows error message on failed request', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'fail' })
    });

    render(<SubscribeForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });
});
