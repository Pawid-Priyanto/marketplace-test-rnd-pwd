// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/Login';
import { AuthService } from '../lib/auth.service';
import { useAuthStore } from '../store/useAuthStore';

// Mock Router Navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock AuthService
vi.mock('../lib/auth.service', () => ({
  AuthService: {
    login: vi.fn(),
    getUser: vi.fn().mockReturnValue(null),
    isAuthenticated: vi.fn().mockReturnValue(false),
  },
}));

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@marketplace.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Password123@';

const renderLoginPage = () => {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('1. Renders login form components correctly', async () => {
    renderLoginPage();

    const emailInputs = await screen.findAllByPlaceholderText('your@email.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    const submitBtns = screen.getAllByRole('button', { name: /sign in|login/i });

    expect(emailInputs[0]).toBeInTheDocument();
    expect(passwordInputs[0]).toBeInTheDocument();
    expect(submitBtns[0]).toBeInTheDocument();
  });

  it('2. Displays "Invalid credentials" error message on failed login', async () => {
   vi.mocked(AuthService.login).mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
      message: 'Invalid credentials',
    });

    renderLoginPage();

    const emailInputs = await screen.findAllByPlaceholderText('your@email.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    const submitBtns = screen.getAllByRole('button', { name: /sign in|login/i });

    const emailInput = emailInputs[0];
    const passwordInput = passwordInputs[0];
    const submitBtn = submitBtns[0];

    fireEvent.change(emailInput, { target: { value: 'wrong@marketplace.com' } });
    fireEvent.change(passwordInput, { target: { value: 'WrongPass123!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(useAuthStore.getState().error).toBe('Invalid credentials');
    });

    const errorMessages = await screen.findAllByText(/invalid credentials/i);
    expect(errorMessages[0]).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('3. Successfully logs in with admin credentials and navigates to /dashboard', async () => {
    vi.mocked(AuthService.login).mockResolvedValue({
      success: true,
      data: {
        token: 'mock-jwt-token-12345',
        user: {
          id: '1',
          name: 'Admin',
          email: ADMIN_EMAIL,
          role: 'admin',
        },
      },
    });

    renderLoginPage();

    const emailInputs = await screen.findAllByPlaceholderText('your@email.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    const submitBtns = screen.getAllByRole('button', { name: /sign in|login/i });

    const emailInput = emailInputs[0];
    const passwordInput = passwordInputs[0];
    const submitBtn = submitBtns[0];

    fireEvent.change(emailInput, { target: { value: ADMIN_EMAIL } });
    fireEvent.change(passwordInput, { target: { value: ADMIN_PASSWORD } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });
});