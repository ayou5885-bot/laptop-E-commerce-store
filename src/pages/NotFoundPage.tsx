import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-7xl font-bold tracking-tighter text-gray-200 sm:text-9xl">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-gray-600">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-charcoal-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:border-charcoal-900"
        >
          <Search className="h-4 w-4" />
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
