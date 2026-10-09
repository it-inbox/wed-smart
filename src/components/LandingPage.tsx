import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, Calendar, CheckCircle2, TrendingDown, Users, ShieldCheck, Heart } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, runDemoSearch } = useApp();

  return (
    <div className="w-full pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 md:py-20 bg-gradient-to-b from-rose-50/50 via-white to-slate-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-800 bg-rose-100/80 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>Wedding Date Optimization Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] text-balance">
                Find Your Perfect Wedding Date. <span className="text-rose-700">Save Thousands.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
                We cross-reference real supplier availability and dynamic pricing across venues, caterers, DJs, and photographers to pinpoint the cheapest date for your dream wedding.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveView('wizard')}
                  className="px-6 py-3.5 text-base font-semibold text-white bg-rose-700 hover:bg-rose-800 active:bg-rose-900 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Plan Your Wedding</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={runDemoSearch}
                  className="px-6 py-3.5 text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm hover:border-slate-400 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>See a Demo</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>20 vetted Dutch suppliers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real-time availability cross-check</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero supplier markups</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Mockup of Calendar & Price Tags */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-rose-200/40 to-amber-200/40 rounded-2xl blur-xl opacity-70" />

                {/* Calendar Showcase Card */}
                <div className="relative bg-white rounded-xl border border-slate-200 shadow-lg p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">August 2027</h2>
                        <p className="text-xs text-slate-500">Dynamic Pricing Heatmap</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Save up to €2,800</span>
                    </div>
                  </div>

                  {/* Mini Calendar Preview Grid */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400 pb-1">
                      <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                      {/* August 2027 starts Sunday 1 */}
                      <span className="text-slate-300 py-1.5 rounded"></span>
                      <span className="text-slate-300 py-1.5 rounded"></span>
                      <span className="text-slate-300 py-1.5 rounded"></span>
                      <span className="text-slate-300 py-1.5 rounded"></span>
                      <span className="text-slate-300 py-1.5 rounded"></span>
                      <span className="text-slate-300 py-1.5 rounded"></span>
                      <span className="py-1.5 rounded bg-slate-100 text-slate-400">1</span>

                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">2</span>
                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">3</span>
                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">4</span>
                      <span className="py-1.5 rounded bg-emerald-50 text-emerald-700">5</span>
                      <span className="py-1.5 rounded bg-amber-50 text-amber-800">6</span>
                      <span className="py-1.5 rounded bg-rose-50 text-rose-400 line-through">7</span>
                      <span className="py-1.5 rounded bg-emerald-50 text-emerald-700">8</span>

                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">9</span>
                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">10</span>
                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">11</span>
                      <span className="py-1.5 rounded bg-emerald-50 text-emerald-700">12</span>
                      <span className="py-1.5 rounded bg-amber-50 text-amber-800">13</span>
                      <span className="py-1.5 rounded bg-rose-50 text-rose-400 line-through">14</span>
                      <span className="relative py-1.5 rounded bg-amber-100 text-amber-900 ring-2 ring-amber-400 font-bold" title="Preferred Date">
                        15
                        <span className="absolute -top-1 -right-1 text-[9px]">⭐</span>
                      </span>

                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">16</span>
                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">17</span>
                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">18</span>
                      <span className="py-1.5 rounded bg-emerald-50 text-emerald-700">19</span>
                      <span className="py-1.5 rounded bg-amber-50 text-amber-800">20</span>
                      <span className="py-1.5 rounded bg-rose-50 text-rose-400 line-through">21</span>
                      <span className="relative py-1.5 rounded bg-emerald-600 text-white font-bold shadow-sm" title="Recommended Date">
                        22
                        <span className="absolute -top-1 -right-1 text-[9px]">✨</span>
                      </span>

                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">23</span>
                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">24</span>
                      <span className="py-1.5 rounded bg-emerald-100 text-emerald-800">25</span>
                      <span className="py-1.5 rounded bg-emerald-50 text-emerald-700">26</span>
                      <span className="py-1.5 rounded bg-amber-50 text-amber-800">27</span>
                      <span className="py-1.5 rounded bg-rose-50 text-rose-400 line-through">28</span>
                      <span className="py-1.5 rounded bg-emerald-50 text-emerald-700">29</span>
                    </div>
                  </div>

                  {/* Comparison preview snippet */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Preferred Date (15 Aug):</span>
                      <span className="font-semibold text-slate-700 tabular-nums">€18,500</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <span>✨ Recommended (22 Aug):</span>
                      </span>
                      <span className="font-bold text-emerald-700 text-sm tabular-nums">€17,200</span>
                    </div>
                    <div className="text-right text-[11px] font-bold text-emerald-600">
                      You save €1,300 with identical dream suppliers!
                    </div>
                  </div>

                  {/* Dream team mini icons */}
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span>🏛️ Venue</span>
                      <span className="text-slate-300">·</span>
                      <span>🍽️ Catering</span>
                      <span className="text-slate-300">·</span>
                      <span>🎵 DJ</span>
                      <span className="text-slate-300">·</span>
                      <span>📸 Photo</span>
                    </span>
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white border-y border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs font-bold text-rose-700 uppercase tracking-wider">Simple 3-Step Process</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              How WedSmart Optimizes Your Big Day
            </h3>
            <p className="text-slate-600 text-base">
              No endless emails or spreadsheets. We crunch hundreds of date and supplier permutations in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h4 className="text-lg font-bold text-slate-900">Select your dream suppliers</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose your venue, catering, DJ, and photographer from our verified Dutch supplier catalog based on your guest count and style.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs text-slate-500 font-medium">
                🏛️ Het Witte Kasteel, LOOF & more
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h4 className="text-lg font-bold text-slate-900">We compare dates & prices</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our algorithm cross-references real calendar availability and supplier day-of-week rate discounts across your flexible window.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs text-slate-500 font-medium">
                ⚡ 31 dates scanned in milliseconds
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h4 className="text-lg font-bold text-slate-900">Save money on your big day</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  See the exact date that saves you the most, view a calendar heatmap, and explore full cost breakdowns per supplier.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs text-emerald-700 font-semibold">
                💰 Average savings: €1,200 – €2,500
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO SAVINGS BANNER */}
      <section className="pt-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 rounded-2xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-200 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-700/50">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Interactive Client Proof-of-Concept</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Couples save an average of €1,200 by choosing a smarter date.
              </h3>
              <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
                Experience the live calculation engine with pre-loaded Dutch venues, caterers, and artists.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <button
                onClick={runDemoSearch}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>See a Demo →</span>
              </button>
              <button
                onClick={() => setActiveView('wizard')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all flex items-center justify-center"
              >
                Custom Wizard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
