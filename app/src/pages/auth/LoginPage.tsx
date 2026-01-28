import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Truck, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login(formData.email, formData.password);
    
    if (success) {
      // Redirect based on role will happen in the router
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 flex items-center justify-center">
              <Truck className="w-6 h-6 text-[#C8FF2E]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#F2F4F8]">LoopFreight</span>
              <span className="text-sm text-[#C8FF2E] font-mono">FMS</span>
            </div>
          </Link>
        </div>

        {/* Form Card */}
        <div className="glass-panel p-8">
          <h1 className="text-2xl font-bold text-[#F2F4F8] mb-2 text-center">
            Welcome back
          </h1>
          <p className="text-sm text-[#A6AEB8] mb-6 text-center">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6AEB8]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-dark w-full pl-10"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6AEB8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-dark w-full pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6AEB8] hover:text-[#F2F4F8]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-[#C8FF2E]/30 bg-transparent" />
                <span className="text-sm text-[#A6AEB8]">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#C8FF2E] hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0B0C0F] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#C8FF2E]/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#12151C] text-sm text-[#A6AEB8]">Or</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-[#A6AEB8]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#C8FF2E] hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-[#A6AEB8] hover:text-[#F2F4F8]">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
