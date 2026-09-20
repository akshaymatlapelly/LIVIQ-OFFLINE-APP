import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('demo@liviq.ai');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF8] flex flex-col items-center justify-center p-6 text-slate-900 font-sans selection:bg-[#A3E635] selection:text-black">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-base relative shadow-md">
              <span className="w-3 h-3 rounded-full bg-[#A3E635] absolute -top-0.5 -right-0.5" />
              LQ
            </div>
            <span className="font-extrabold font-sans text-3xl tracking-tight text-black">
              LIVIQ<span className="text-[#84CC16]">.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In</h1>
          <p className="text-xs font-sans text-slate-500 max-w-xs mx-auto">
            Access your LIVIQ Health & Emergency Intelligence Platform
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-slate-200/90 shadow-xl rounded-3xl p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-sans">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#84CC16] focus:ring-2 focus:ring-[#A3E635]/30 rounded-2xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition"
                placeholder="demo@liviq.ai"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-500" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#84CC16] focus:ring-2 focus:ring-[#A3E635]/30 rounded-2xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition pr-11"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-black transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-black focus:ring-0" />
                <span>Remember session</span>
              </label>
              <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                <Sparkles className="w-3 h-3 text-[#84CC16]" /> Demo pre-filled
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-sans text-sm font-extrabold text-white bg-black hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to LIVIQ</span>
                  <ArrowRight className="w-4 h-4 text-[#A3E635]" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-black font-extrabold hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
