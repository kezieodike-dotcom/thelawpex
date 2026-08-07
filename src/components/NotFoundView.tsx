import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, Search } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { APP_ROUTES } from '../routes';

interface NotFoundViewProps {
  onOpenSearch: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onOpenSearch }) => {
  const suggestions = APP_ROUTES.filter((route) =>
    ['ai-assistant', 'case-law', 'court-rules', 'laws', 'drafts', 'pricing'].includes(route.id),
  );

  return (
    <div className="bg-white text-neutral-900 min-h-[70vh] py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <LogoMark className="w-14 h-14 mx-auto rounded-xl shadow-lg shadow-yellow-500/25" />

        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-yellow-700">Error 404</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-black font-serif text-neutral-900">Page Not Found</h1>
        <p className="mt-3 text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
          The page you requested does not exist on LAWPEX. It may have been moved, or the link may be
          incorrect. Use the search library or head back to one of the core modules below.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow-md shadow-yellow-500/25 transition"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-neutral-800 border border-neutral-300 hover:border-yellow-500/80 font-medium text-xs px-5 py-2.5 rounded-lg transition"
          >
            <Search className="w-4 h-4 text-yellow-700" />
            Search the Library
          </button>
        </div>

        <div className="mt-12 text-left">
          <h2 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3 text-center">
            Popular Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((route) => (
              <Link
                key={route.id}
                to={route.path}
                className="group bg-yellow-100 border border-neutral-200 hover:border-yellow-500/80 rounded-xl p-4 transition flex items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold font-serif text-neutral-900">{route.label}</h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{route.path}</p>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 text-neutral-600 group-hover:text-yellow-700 transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
