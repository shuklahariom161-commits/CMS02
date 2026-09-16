import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  User,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

interface LoginProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccessRedirect?: (role: string) => void;
}

export const Login: React.FC<LoginProps> = ({ isOpen = true, onClose, onSuccessRedirect }) => {
  const { login, quickLogin, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your college email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (onClose) onClose();
      if (onSuccessRedirect && user) {
        onSuccessRedirect(user.role);
      }
    } else {
      setError(res.message || 'Invalid credentials.');
    }
  };

  const handleQuickLogin = async (demoEmail: string, roleName: string) => {
    setLoading(true);
    setError(null);
    const success = await quickLogin(demoEmail);
    setLoading(false);
    if (success) {
      if (onClose) onClose();
      if (onSuccessRedirect) onSuccessRedirect(roleName);
    } else {
      setError(`Quick login for ${roleName} failed.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="bg-white px-3 py-1 rounded-xl shadow-xs">
            <img
              src="/campusone-mits-logo.svg"
              alt="CampusOne · MITS Gwalior"
              className="h-8.5 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email-input"
                  type="email"
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standard domain: <code className="text-indigo-600">@college.edu</code>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  required
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In with JWT'}</span>
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Quick Role-Based Demo Login
              </span>
              <span className="text-[10px] text-indigo-600 font-medium">One-Click</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@college.edu', 'ADMIN')}
                className="p-2 text-left rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">Dean Arthur Vance</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('faculty.sharma@college.edu', 'FACULTY')}
                className="p-2 text-left rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Faculty</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">Prof. R. Sharma</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('rahul.verma@college.edu', 'STUDENT')}
                className="p-2 text-left rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Club Leader</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">Rahul (Coding Club)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('hariom@college.edu', 'STUDENT')}
                className="p-2 text-left rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Student</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">Hariom (Tech Member)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
