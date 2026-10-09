import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Wizard } from './components/Wizard';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Sparkles, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, runDemoSearch } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'wizard' && <Wizard />}
        {activeView === 'results' && <ResultsDashboard />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer (Visible when not in full admin console) */}
      {activeView !== 'admin' && (
        <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-rose-700 text-white flex items-center justify-center font-bold text-xs">
                W
              </div>
              <span className="font-bold text-slate-800 text-sm">WedSmart</span>
              <span className="text-slate-300">·</span>
              <span>Netherlands Wedding Date Optimization MVP</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveView('landing')}
                className="hover:text-slate-900 transition-colors"
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView('wizard')}
                className="hover:text-slate-900 transition-colors"
              >
                Search Wizard
              </button>
              <button
                onClick={runDemoSearch}
                className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
              >
                Run Demo Pitch
              </button>
              <button
                onClick={() => setActiveView('admin')}
                className="hover:text-slate-900 transition-colors"
              >
                Admin Console
              </button>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <span>Crafted for modern couples</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
