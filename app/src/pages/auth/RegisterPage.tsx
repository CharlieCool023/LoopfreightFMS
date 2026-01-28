import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, Users, Truck, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

 type UserType = 'partner' | 'end_user';

export function RegisterPage() {
  const navigate = useNavigate();
  const { registerPartner, registerEndUser, isLoading, error, clearError } = useAuthStore();
  
  const [userType, setUserType] = useState<UserType | null>(null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  
  // Common fields
  const [commonData, setCommonData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  // Partner specific
  const [partnerData, setPartnerData] = useState({
    company_name: '',
    business_type: '',
    fleet_size: 1,
  });
  
  // End user specific
  const [endUserData, setEndUserData] = useState({
    tracker_id: '',
  });

  const handleCommonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (commonData.password !== commonData.confirmPassword) {
      // Show error
      return;
    }
    
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    let success = false;
    
    if (userType === 'partner') {
      success = await registerPartner({
        ...commonData,
        ...partnerData,
      });
    } else {
      success = await registerEndUser({
        ...commonData,
        ...endUserData,
      });
    }
    
    if (success) {
      navigate('/verify-email');
    }
  };

  // Step 1: Select user type
  if (!userType) {
    return (
      <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
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

          <div className="glass-panel p-8">
            <h1 className="text-2xl font-bold text-[#F2F4F8] mb-2 text-center">
              Create your account
            </h1>
            <p className="text-sm text-[#A6AEB8] mb-8 text-center">
              Select the account type that best describes you
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setUserType('partner')}
                className="p-6 border border-[#C8FF2E]/20 rounded-xl hover:border-[#C8FF2E]/50 hover:bg-[#C8FF2E]/5 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-[#C8FF2E]/10 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-[#C8FF2E]" />
                </div>
                <h3 className="text-lg font-semibold text-[#F2F4F8] mb-2">
                  Business / Partner
                </h3>
                <p className="text-sm text-[#A6AEB8]">
                  For fleet managers, logistics companies, and businesses with multiple assets
                </p>
              </button>

              <button
                onClick={() => setUserType('end_user')}
                className="p-6 border border-[#C8FF2E]/20 rounded-xl hover:border-[#C8FF2E]/50 hover:bg-[#C8FF2E]/5 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-[#C8FF2E]/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#C8FF2E]" />
                </div>
                <h3 className="text-lg font-semibold text-[#F2F4F8] mb-2">
                  Individual
                </h3>
                <p className="text-sm text-[#A6AEB8]">
                  For personal vehicle owners with a single tracking device
                </p>
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-[#A6AEB8]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#C8FF2E] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Common information
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-1 bg-[#C8FF2E] rounded-full" />
            <div className="flex-1 h-1 bg-[#C8FF2E]/20 rounded-full" />
          </div>

          <div className="glass-panel p-8">
            <button
              onClick={() => setUserType(null)}
              className="text-sm text-[#A6AEB8] hover:text-[#F2F4F8] mb-4"
            >
              ← Back
            </button>

            <h1 className="text-2xl font-bold text-[#F2F4F8] mb-2">
              {userType === 'partner' ? 'Business Account' : 'Personal Account'}
            </h1>
            <p className="text-sm text-[#A6AEB8] mb-6">
              Enter your details to get started
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleCommonSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6AEB8]" />
                  <input
                    type="text"
                    value={commonData.full_name}
                    onChange={(e) => setCommonData({ ...commonData, full_name: e.target.value })}
                    className="input-dark w-full pl-10"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6AEB8]" />
                  <input
                    type="email"
                    value={commonData.email}
                    onChange={(e) => setCommonData({ ...commonData, email: e.target.value })}
                    className="input-dark w-full pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6AEB8]" />
                  <input
                    type="tel"
                    value={commonData.phone}
                    onChange={(e) => setCommonData({ ...commonData, phone: e.target.value })}
                    className="input-dark w-full pl-10"
                    placeholder="+234 801 234 5678"
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
                    value={commonData.password}
                    onChange={(e) => setCommonData({ ...commonData, password: e.target.value })}
                    className="input-dark w-full pl-10 pr-10"
                    placeholder="••••••••"
                    required
                    minLength={8}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6AEB8]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={commonData.confirmPassword}
                    onChange={(e) => setCommonData({ ...commonData, confirmPassword: e.target.value })}
                    className="input-dark w-full pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Specific information
  return (
    <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1 bg-[#C8FF2E] rounded-full" />
          <div className="flex-1 h-1 bg-[#C8FF2E] rounded-full" />
        </div>

        <div className="glass-panel p-8">
          <button
            onClick={() => setStep(1)}
            className="text-sm text-[#A6AEB8] hover:text-[#F2F4F8] mb-4"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-[#F2F4F8] mb-2">
            {userType === 'partner' ? 'Business Details' : 'Tracker Information'}
          </h1>
          <p className="text-sm text-[#A6AEB8] mb-6">
            {userType === 'partner'
              ? 'Tell us about your business'
              : 'Enter your tracker device ID'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleFinalSubmit} className="space-y-4">
            {userType === 'partner' ? (
              <>
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                    Company name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6AEB8]" />
                    <input
                      type="text"
                      value={partnerData.company_name}
                      onChange={(e) => setPartnerData({ ...partnerData, company_name: e.target.value })}
                      className="input-dark w-full pl-10"
                      placeholder="Your Company Ltd"
                      required
                    />
                  </div>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                    Business type
                  </label>
                  <select
                    value={partnerData.business_type}
                    onChange={(e) => setPartnerData({ ...partnerData, business_type: e.target.value })}
                    className="input-dark w-full"
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="Logistics & Transportation">Logistics & Transportation</option>
                    <option value="Construction">Construction</option>
                    <option value="Aviation">Aviation</option>
                    <option value="Maritime">Maritime</option>
                    <option value="Rental & Leasing">Rental & Leasing</option>
                    <option value="Security">Security</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Fleet Size */}
                <div>
                  <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                    Fleet size
                  </label>
                  <input
                    type="number"
                    value={partnerData.fleet_size}
                    onChange={(e) => setPartnerData({ ...partnerData, fleet_size: parseInt(e.target.value) })}
                    className="input-dark w-full"
                    min={1}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {/* Tracker ID */}
                <div>
                  <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                    Tracker Device ID
                  </label>
                  <div className="relative">
                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6AEB8]" />
                    <input
                      type="text"
                      value={endUserData.tracker_id}
                      onChange={(e) => setEndUserData({ ...endUserData, tracker_id: e.target.value })}
                      className="input-dark w-full pl-10"
                      placeholder="e.g., DEV-001-ABC"
                      required
                    />
                  </div>
                  <p className="text-xs text-[#A6AEB8] mt-2">
                    You can find this on your tracking device or in the documentation
                  </p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0B0C0F] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
