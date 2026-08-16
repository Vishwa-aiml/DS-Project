import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHoveringGoogle, setIsHoveringGoogle] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = isRegister ? '/api/v1/auth/register' : '/api/v1/auth/login';
    const payload = isRegister ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Automatically format to match Google's generic user object structure
      // we attach a placeholder picture
      const user = {
        name: data.user.name,
        email: data.user.email,
        picture: "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.user.name) + "&background=184E32&color=fff"
      };

      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((res) => res.json());
        onLoginSuccess(userInfo);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    },
    onError: (error) => console.error('Login Failed:', error),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07130C]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#184E32] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <LogIn className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Join Thermalens</h2>
          <p className="text-[#A7C8B6] text-sm mt-1">Access advanced heat risk analytics and mitigation tools.</p>
        </div>

        {/* Body */}
        <div className="p-6">
          
          {/* Email Authentication Form */}
          <form className="space-y-4" onSubmit={handleEmailAuth}>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm mb-4 border border-red-100">
                {error}
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-[#4B5E53] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="h-4 w-4 text-[#8BA496] flex items-center justify-center font-bold">@</div>
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#D5E3DB] rounded-xl text-sm focus:ring-2 focus:ring-[#1E6B41] focus:border-[#1E6B41] bg-[#F7FBF9] text-[#14432A] transition-colors outline-none"
                    placeholder="Dr. Ananya Rao"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#4B5E53] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#8BA496]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#D5E3DB] rounded-xl text-sm focus:ring-2 focus:ring-[#1E6B41] focus:border-[#1E6B41] bg-[#F7FBF9] text-[#14432A] transition-colors outline-none"
                  placeholder="name@organization.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5E53] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#8BA496]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#D5E3DB] rounded-xl text-sm focus:ring-2 focus:ring-[#1E6B41] focus:border-[#1E6B41] bg-[#F7FBF9] text-[#14432A] transition-colors outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#184E32] hover:bg-[#14432A] text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-70"
            >
              {isLoading ? "Processing..." : (isRegister ? "Create Account" : "Sign In")} <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="text-center text-xs text-[#5D7769] mt-2">
              {isRegister ? "Already have an account?" : "Don't have an account?"} 
              <span 
                className="text-[#1E6B41] font-semibold hover:underline cursor-pointer ml-1"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
              >
                {isRegister ? "Sign In" : "Register here"}
              </span>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E1ECE5]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-[#8BA496] text-xs font-medium uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => googleLogin()}
            onMouseEnter={() => setIsHoveringGoogle(true)}
            onMouseLeave={() => setIsHoveringGoogle(false)}
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#D5E3DB] hover:bg-[#F7FBF9] hover:border-[#8BA496] text-[#2C4135] font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className={isHoveringGoogle ? 'text-[#184E32]' : ''}>
              Sign in with Google
            </span>
          </button>
          
        </div>
      </div>
    </div>
  );
};
