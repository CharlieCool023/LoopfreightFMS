import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { verifyEmail, resendVerification, isLoading, pendingUserEmail } = useAuthStore();
  
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(pendingUserEmail || '');

  useEffect(() => {
    if (token) {
      handleVerify(token);
    }
  }, [token]);

  const handleVerify = async (verificationToken: string) => {
    setStatus('verifying');
    
    const success = await verifyEmail(verificationToken);
    
    if (success) {
      setStatus('success');
      setMessage('Your email has been verified successfully!');
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setStatus('error');
      setMessage('Invalid or expired verification link. Please request a new one.');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    
    setStatus('verifying');
    const success = await resendVerification(email);
    
    if (success) {
      setStatus('idle');
      setMessage('Verification email sent! Please check your inbox.');
    } else {
      setStatus('error');
      setMessage('Failed to send verification email. Please try again.');
    }
  };

  // Verification in progress (from URL token)
  if (token && status === 'verifying') {
    return (
      <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C8FF2E] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-[#F2F4F8] mb-2">Verifying your email...</h1>
          <p className="text-[#A6AEB8]">Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="glass-panel p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[#C8FF2E]" />
            </div>
            <h1 className="text-2xl font-bold text-[#F2F4F8] mb-2">Email Verified!</h1>
            <p className="text-[#A6AEB8] mb-6">{message}</p>
            <p className="text-sm text-[#A6AEB8] mb-6">
              Redirecting you to login in a few seconds...
            </p>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              Go to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error state with resend option
  if (status === 'error' && token) {
    return (
      <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="glass-panel p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-[#F2F4F8] mb-2">Verification Failed</h1>
            <p className="text-[#A6AEB8] mb-6">{message}</p>
            
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-dark w-full"
              />
              <button
                onClick={handleResend}
                disabled={isLoading || !email}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Resend Verification Email
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default state (no token, waiting for user)
  return (
    <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-panel p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-[#C8FF2E]" />
          </div>
          <h1 className="text-2xl font-bold text-[#F2F4F8] mb-2">Verify Your Email</h1>
          <p className="text-[#A6AEB8] mb-6">
            We've sent a verification email to{' '}
            <span className="text-[#F2F4F8]">{pendingUserEmail || 'your email address'}</span>.
            Please check your inbox and click the verification link.
          </p>
          
          {message && (
            <div className="mb-4 p-3 bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 rounded-lg">
              <p className="text-sm text-[#C8FF2E]">{message}</p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-[#A6AEB8]">
              Didn't receive the email?
            </p>
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Resend Email
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-[#C8FF2E]/10">
            <Link to="/login" className="text-sm text-[#A6AEB8] hover:text-[#F2F4F8]">
              Already verified? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
