import React, { useState } from 'react';
import {
  Trophy,
  Github,
  LogIn,
  User,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  FolderPlus,
  X,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { UserProfile } from '../types';
import { signInWithGoogle, signInWithGithub } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserProfile, isNewAccount: boolean) => void;
  currentUser?: UserProfile | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
}) => {
  const [customName, setCustomName] = useState('Sabankumar');
  const [customEmail, setCustomEmail] = useState('sabankumar@gmail.com');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setErrorMessage(null);
    try {
      const { user: fbUser, error } = await signInWithGoogle();
      if (error || !fbUser) {
        setErrorMessage(error || 'Google Sign-In failed');
        setLoadingGoogle(false);
        return;
      }

      const user: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || customName || 'Sabankumar',
        email: fbUser.email || customEmail || 'sabankumar@gmail.com',
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        provider: 'Google',
        createdAt: new Date().toISOString(),
        role: 'Team Leader',
      };

      const saved = localStorage.getItem(`hacktrack_workspace_${user.id}`);
      onLoginSuccess(user, !saved);
    } catch (e: any) {
      setErrorMessage(e?.message || 'Google Authentication Error');
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoadingGithub(true);
    setErrorMessage(null);
    try {
      const { user: fbUser, error } = await signInWithGithub();
      if (error || !fbUser) {
        setErrorMessage(error || 'GitHub Sign-In failed');
        setLoadingGithub(false);
        return;
      }

      const user: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || customName || 'Sabankumar (GitHub)',
        email: fbUser.email || customEmail || 'sabankumar@github.io',
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        provider: 'GitHub',
        createdAt: new Date().toISOString(),
        role: 'Team Leader',
      };

      const saved = localStorage.getItem(`hacktrack_workspace_${user.id}`);
      onLoginSuccess(user, !saved);
    } catch (e: any) {
      setErrorMessage(e?.message || 'GitHub Authentication Error');
    } finally {
      setLoadingGithub(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const userId = `usr_${customName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const user: UserProfile = {
      id: userId,
      name: customName.trim(),
      email: customEmail.trim() || `${userId}@hacktrack.io`,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      provider: 'Email',
      createdAt: new Date().toISOString(),
      role: 'Team Leader',
    };
    const saved = localStorage.getItem(`hacktrack_workspace_${user.id}`);
    onLoginSuccess(user, !saved);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
      onClick={() => {
        if (onClose) onClose();
      }}
    >
      <div
        className="bg-[#18181b] border border-[#27272a] rounded-xl w-full max-w-md p-6 shadow-2xl relative text-xs text-[#fafafa] font-sans cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && currentUser && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-[#71717a] hover:text-[#fafafa] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Trophy className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#fafafa] tracking-tight">
            HackTrack Authentication
          </h2>
          <p className="text-xs text-[#71717a] max-w-xs mx-auto">
            Sign in to access your personal persistent hackathon workspace database.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Social Authentication Buttons */}
        <div className="space-y-2.5 mb-5">
          <button
            onClick={handleGoogleLogin}
            disabled={loadingGoogle}
            className="w-full py-2.5 px-4 bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] hover:border-blue-500/40 rounded-lg text-xs font-semibold text-[#fafafa] flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm group disabled:opacity-50"
          >
            {loadingGoogle ? (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{loadingGoogle ? 'Signing in with Google...' : 'Continue with Google'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#52525b] group-hover:text-blue-400 ml-auto transition-colors" />
          </button>

          <button
            onClick={handleGithubLogin}
            disabled={loadingGithub}
            className="w-full py-2.5 px-4 bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] hover:border-purple-500/40 rounded-lg text-xs font-semibold text-[#fafafa] flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm group disabled:opacity-50"
          >
            {loadingGithub ? (
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            ) : (
              <Github className="w-4 h-4 text-purple-400" />
            )}
            <span>{loadingGithub ? 'Signing in with GitHub...' : 'Continue with GitHub'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#52525b] group-hover:text-purple-400 ml-auto transition-colors" />
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#27272a]" />
          </div>
          <span className="relative px-2 bg-[#18181b] text-[10px] uppercase font-mono text-[#71717a]">
            or sign in with custom user
          </span>
        </div>

        {/* Form for custom user */}
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div>
            <label className="block text-[#a1a1aa] mb-1 font-medium text-[11px]">User Name</label>
            <input
              type="text"
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Sabankumar"
              className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded-lg text-[#fafafa] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[#a1a1aa] mb-1 font-medium text-[11px]">Email Address</label>
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="sabankumar@gmail.com"
              className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded-lg text-[#fafafa] focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-[0_0_12px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Clean Workspace</span>
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-5 p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-[10px] text-[#71717a] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            First time login creates a clean <strong>empty workspace</strong> database. All your data will automatically save and restore on future visits.
          </span>
        </div>
      </div>
    </div>
  );
};
