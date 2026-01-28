import { Link } from 'react-router-dom';
import { MapPin, Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-12 h-12 text-[#C8FF2E]" />
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-[#F2F4F8] mb-2">404</h1>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold text-[#F2F4F8] mb-4">
          Page Not Found
        </h2>
        <p className="text-[#A6AEB8] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
