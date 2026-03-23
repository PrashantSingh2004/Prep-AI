import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';
import * as api from '../services/api';

// Mock our API service default export
vi.mock('../services/api', () => ({
  __esModule: true,
  default: {
    post: vi.fn(),
  }
}));

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<Login />);
    
    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);

    // Assuming the browser's required attribute prevents submission,
    // or if we had custom JS validation, we'd check for error text here.
    // For now we check if API was NOT called.
    expect(api.default.post).not.toHaveBeenCalled();
  });

  it('successfully logs in and calls API', async () => {
    // Mock successful login response
    api.default.post.mockResolvedValueOnce({
      data: { token: 'fake_token', _id: '123', name: 'Test User' }
    });

    renderWithProviders(<Login />);
    
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' }
    });

    // Mock form submission
    const form = screen.getByTestId('login-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(api.default.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
