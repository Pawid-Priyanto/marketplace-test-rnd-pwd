import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Box, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { validatePassword, validateEmail } from '../utils/helper';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();

  const registeredEmail = (location.state as { registeredEmail?: string })?.registeredEmail || '';

  const [email, setEmail] = useState(registeredEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (validateEmail(email)) {
      setEmailError(validateEmail(email));
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (validatePassword(password)) {
        setPasswordError(validatePassword(password));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) clearError();

    if (!validateForm()) return;

    const success = await login({ email, password });
    
    if (success) {
      toast.success('Login successful! Welcome back.');
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-1/2 xl:px-24 py-12">
        <div className="mx-auto w-full max-w-sm">
          
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
              <Box className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">VocaMarket</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back 👋
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Login to your account and continue shopping.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                className={`w-full ${emailError ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={isLoading}
              />
              {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
              
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  className={`w-full pr-10 ${passwordError ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-600 mt-1">{passwordError}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-200 transition-all"
              isLoading={isLoading}
            >
              Login
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-medium">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toast.error('Google login simulated (not implemented)')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => toast.error('Apple login simulated (not implemented)')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all"
            >
             <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.31c.64-.78 1.08-1.86.96-2.94-1.01.04-2.23.68-2.93 1.46-.6.67-1.13 1.77-.98 2.84 1.13.09 2.3-.57 2.95-1.36z"/>
              </svg>
              Apple
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>

        </div>
      </div>

      <div className="hidden w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 lg:flex lg:flex-col lg:justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            VocaMarket Secure Gateway
          </span>
        </div>

        <div className="z-10 my-auto flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md aspect-video flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1000&auto=format&fit=crop"
              alt="Digital Marketplace Gaming Controller"
              className="rounded-2xl shadow-2xl object-cover w-full h-64 border border-blue-500/20 opacity-90 transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className="z-10 space-y-2">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Fast. Secure. Reliable.
          </h3>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Top up your favorite games and digital products in seconds with ultimate security.
          </p>
        </div>
      </div>
    </div>
  );
}