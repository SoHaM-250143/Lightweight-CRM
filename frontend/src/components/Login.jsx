import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = ({ onSwitchToRegister }) => {
  const { login, error: authError, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setError(null);

    // Validate fields
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      // Errors are handled by the context but we can catch to reset submission state
      console.error('Login submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-4">
            <LogIn size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-2">Log in to manage your sales opportunities</p>
        </div>

        {/* Alerts */}
        {displayError && (
          <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-lg text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-600/20 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              Sign up free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
