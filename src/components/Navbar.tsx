import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, Settings, ArrowRight, RotateCcw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, runDemoSearch } = useApp();

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeView !== 'landing') {
      setActiveView('landing');
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-700 text-white flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            W
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-rose-700 transition-colors whitespace-nowrap shrink-0">
              WedSmart
            </span>
          </div>
        </button>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveView('landing')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              activeView === 'landing' ? 'text-rose-700 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <a
            href="#how-it-works"
            onClick={handleHowItWorksClick}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-slate-900"
          >
            How It Works
          </a>
          <button
            onClick={() => setActiveView('wizard')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              activeView === 'wizard' ? 'text-rose-700 font-semibold' : ''
            }`}
          >
            Plan Wedding
          </button>
          <button
            onClick={runDemoSearch}
            className="whitespace-nowrap shrink-0 text-amber-700 hover:text-amber-800 flex items-center gap-1.5 font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            See Live Demo
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className={`whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors hover:text-slate-900 ${
              activeView === 'admin' ? 'text-rose-700 font-semibold' : ''
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Admin
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {activeView === 'admin' ? (
            <button
              onClick={() => setActiveView('landing')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              ← Back to Couple View
            </button>
          ) : activeView === 'results' ? (
            <button
              onClick={() => setActiveView('wizard')}
              className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Search
            </button>
          ) : (
            <button
              onClick={() => setActiveView('wizard')}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 rounded-lg hover:bg-rose-800 shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>Plan Your Wedding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
