import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Supplier, SupplierCategory } from '../types/wedding';
import { formatCurrency } from '../services/pricingEngine';
import {
  Users,
  Calendar,
  Euro,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  MapPin,
  Star,
  AlertCircle
} from 'lucide-react';

export const Wizard: React.FC = () => {
  const {
    suppliers,
    searchCriteria,
    updateCriteria,
    executeSearch,
    setActiveView
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Category definitions with icons
  const categories: { key: SupplierCategory; title: string; icon: string }[] = [
    { key: 'venue', title: 'Venue', icon: '🏛️' },
    { key: 'catering', title: 'Catering', icon: '🍽️' },
    { key: 'dj', title: 'DJ / Band', icon: '🎵' },
    { key: 'photographer', title: 'Photographer', icon: '📸' }
  ];

  // Helper to get selected suppliers objects
  const selectedSuppliers = Object.entries(searchCriteria.selectedSupplierIds)
    .map(([cat, id]) => suppliers.find(s => s.id === id))
    .filter(Boolean) as Supplier[];

  const minTotal = selectedSuppliers.reduce((sum, s) => sum + s.minPrice, 0);
  const maxTotal = selectedSuppliers.reduce((sum, s) => sum + s.maxPrice, 0);
  const selectedCount = selectedSuppliers.length;

  const handleSupplierSelect = (category: SupplierCategory, supplierId: string) => {
    updateCriteria({
      selectedSupplierIds: {
        ...searchCriteria.selectedSupplierIds,
        [category]: searchCriteria.selectedSupplierIds[category] === supplierId ? null : supplierId
      }
    });
  };

  const handleFinish = () => {
    executeSearch();
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Top Header & Breadcrumb */}
      <div className="mb-8 text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Plan Your Dream Wedding
        </h1>
        <p className="text-sm text-slate-500">
          Follow the 4 simple steps to let WedSmart locate your optimal date with maximum savings.
        </p>
      </div>

      {/* Progress Steps Indicator */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="grid grid-cols-4 relative">
          {/* Background progress bar line */}
          <div className="absolute top-4 left-[12%] right-[12%] h-0.5 bg-slate-200 -z-0" />
          <div
            className="absolute top-4 left-[12%] h-0.5 bg-rose-700 transition-all duration-300 -z-0"
            style={{ width: `${((step - 1) / 3) * 76}%` }}
          />

          {/* Steps */}
          {[
            { num: 1, label: 'Guest Info', icon: Users },
            { num: 2, label: 'Your Date', icon: Calendar },
            { num: 3, label: 'Your Budget', icon: Euro },
            { num: 4, label: 'Pick Suppliers', icon: Sparkles }
          ].map(s => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            const Icon = s.icon;

            return (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className="flex flex-col items-center group focus:outline-none z-10"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-rose-700 text-white'
                      : isCurrent
                      ? 'bg-rose-700 text-white ring-4 ring-rose-100'
                      : 'bg-white border-2 border-slate-300 text-slate-500 group-hover:border-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span
                  className={`mt-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                    isCurrent ? 'text-rose-800' : isCompleted ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* WIZARD CONTENT BOX */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-20 transition-all">
        {/* STEP 1: GUEST INFO */}
        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Step 1 of 4</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">How many guests are you expecting?</h2>
              <p className="text-sm text-slate-500 mt-1">
                This helps us automatically filter suppliers that can comfortably accommodate your celebration.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <label htmlFor="guest-input" className="text-sm font-semibold text-slate-700">
                  Estimated Guest Count
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="guest-input"
                    type="number"
                    min="20"
                    max="500"
                    step="5"
                    value={searchCriteria.guestCount}
                    onChange={e => updateCriteria({ guestCount: Number(e.target.value) || 20 })}
                    className="w-24 text-center text-xl font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <span className="text-sm font-medium text-slate-500">guests</span>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="5"
                  value={searchCriteria.guestCount}
                  onChange={e => updateCriteria({ guestCount: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-700"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>20 guests (Intimate)</span>
                  <span>150 (Average Dutch wedding)</span>
                  <span>500 (Grand Gala)</span>
                </div>
              </div>
            </div>

            {/* Hint Box */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <p>
                <strong>Pro-tip:</strong> Dutch wedding venues typically range from 80 to 250 guests. Selecting 150 guests lets you choose from all 5 premier venues in our catalog.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: YOUR DATE */}
        {step === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Step 2 of 4</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Do you have a preferred date?</h2>
              <p className="text-sm text-slate-500 mt-1">
                Tell us if you have an initial target date in mind, or if you are completely open within August 2027.
              </p>
            </div>

            <div className="space-y-4">
              {/* Radio Option 1: Yes, specific date */}
              <label
                className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  searchCriteria.hasSpecificDate
                    ? 'border-rose-700 bg-rose-50/40 ring-1 ring-rose-700'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="datePreference"
                  checked={searchCriteria.hasSpecificDate}
                  onChange={() => updateCriteria({ hasSpecificDate: true })}
                  className="mt-1 text-rose-700 focus:ring-rose-500"
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Yes, I have a specific date</span>
                    <span className="text-xs text-slate-500">
                      We will benchmark all other available dates against this anchor to show exact savings.
                    </span>
                  </div>

                  {searchCriteria.hasSpecificDate && (
                    <div className="pt-2 flex items-center gap-3">
                      <label htmlFor="pref-date" className="text-xs font-medium text-slate-700">
                        Preferred Date:
                      </label>
                      <input
                        id="pref-date"
                        type="date"
                        min="2027-08-01"
                        max="2027-08-31"
                        value={searchCriteria.preferredDate}
                        onChange={e => updateCriteria({ preferredDate: e.target.value })}
                        className="text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                      <span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        Sunday, 15 Aug 2027 (Demo standard)
                      </span>
                    </div>
                  )}
                </div>
              </label>

              {/* Radio Option 2: No, flexible */}
              <label
                className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  !searchCriteria.hasSpecificDate
                    ? 'border-rose-700 bg-rose-50/40 ring-1 ring-rose-700'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="datePreference"
                  checked={!searchCriteria.hasSpecificDate}
                  onChange={() => updateCriteria({ hasSpecificDate: false })}
                  className="mt-1 text-rose-700 focus:ring-rose-500"
                />
                <div>
                  <span className="text-sm font-bold text-slate-900 block">No, I'm fully flexible</span>
                  <span className="text-xs text-slate-500">
                    Search the entire month to show the absolute lowest prices available.
                  </span>
                </div>
              </label>
            </div>

            {/* Flexible Date Range Box */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Target Search Window (August 2027)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="range-start" className="text-xs text-slate-500 block mb-1">
                    Earliest acceptable date:
                  </label>
                  <input
                    id="range-start"
                    type="date"
                    min="2027-08-01"
                    max="2027-08-31"
                    value={searchCriteria.rangeStart}
                    onChange={e => updateCriteria({ rangeStart: e.target.value })}
                    className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="range-end" className="text-xs text-slate-500 block mb-1">
                    Latest acceptable date:
                  </label>
                  <input
                    id="range-end"
                    type="date"
                    min="2027-08-01"
                    max="2027-08-31"
                    value={searchCriteria.rangeEnd}
                    onChange={e => updateCriteria({ rangeEnd: e.target.value })}
                    className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: YOUR BUDGET */}
        {step === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Step 3 of 4</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">What's your total budget for these suppliers?</h2>
              <p className="text-sm text-slate-500 mt-1">
                Enter your total allocated budget for venue, catering, music, and photography combined.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-5">
              <label htmlFor="budget-input" className="text-sm font-semibold text-slate-700 block">
                Total Combined Budget
              </label>

              <div className="relative max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-lg">
                  €
                </div>
                <input
                  id="budget-input"
                  type="number"
                  min="5000"
                  max="60000"
                  step="500"
                  value={searchCriteria.budget}
                  onChange={e => updateCriteria({ budget: Number(e.target.value) || 10000 })}
                  className="w-full pl-9 pr-4 py-3 text-2xl font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none tabular-nums"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-500">Popular budgets:</span>
                {[15000, 18000, 22000, 25000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => updateCriteria({ budget: val })}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
                      searchCriteria.budget === val
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {formatCurrency(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Context callout */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              <span className="text-base">💡</span>
              <p>
                <strong>Dutch Wedding Benchmark:</strong> The average wedding in the Netherlands costs €15,000 – €25,000 for high-end venue rental, full seated catering, live music, and full-day photography.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PICK SUPPLIERS */}
        {step === 4 && (
          <div className="space-y-10 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Step 4 of 4</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Choose your dream team</h2>
              <p className="text-sm text-slate-500 mt-1">
                Select one supplier per category. We will cross-reference their availability calendars to find the optimal date with minimum costs.
              </p>
            </div>

            {/* Supplier Category Lists */}
            <div className="space-y-8">
              {categories.map(cat => {
                const categorySuppliers = suppliers.filter(s => s.category === cat.key);
                const currentSelectedId = searchCriteria.selectedSupplierIds[cat.key];

                return (
                  <div key={cat.key} className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cat.icon}</span>
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                          {cat.title}
                        </h3>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          currentSelectedId ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {currentSelectedId ? '✓ 1 selected' : 'Choose 1'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {categorySuppliers.map(supplier => {
                        const isSelected = currentSelectedId === supplier.id;
                        const isOverCapacity = supplier.capacity < searchCriteria.guestCount;

                        return (
                          <div
                            key={supplier.id}
                            onClick={() => {
                              if (!isOverCapacity) {
                                handleSupplierSelect(cat.key, supplier.id);
                              }
                            }}
                            className={`p-4 rounded-xl border transition-all text-left ${
                              isOverCapacity
                                ? 'bg-slate-50 border-slate-200 opacity-55 cursor-not-allowed'
                                : isSelected
                                ? 'bg-rose-50/50 border-rose-700 ring-2 ring-rose-700 shadow-sm cursor-pointer'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className="pt-0.5">
                                  <input
                                    type="radio"
                                    name={`category-${cat.key}`}
                                    checked={isSelected}
                                    disabled={isOverCapacity}
                                    onChange={() => handleSupplierSelect(cat.key, supplier.id)}
                                    className="text-rose-700 focus:ring-rose-500 cursor-pointer"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900">
                                      {supplier.name}
                                    </h4>
                                    {supplier.rating && (
                                      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-700">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span>{supplier.rating}</span>
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>{supplier.location}</span>
                                    </span>
                                    <span>·</span>
                                    <span>
                                      {supplier.capacity >= 900
                                        ? 'Any group size'
                                        : `Up to ${supplier.capacity} guests`}
                                    </span>
                                    {isOverCapacity && (
                                      <>
                                        <span>·</span>
                                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                                          <AlertCircle className="w-3 h-3" />
                                          Max {supplier.capacity} (Need {searchCriteria.guestCount})
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  {supplier.tagline && (
                                    <p className="text-xs text-slate-600 line-clamp-1 italic pt-0.5">
                                      "{supplier.tagline}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <div className="text-xs font-bold text-slate-900 tabular-nums">
                                  {formatCurrency(supplier.minPrice)} – {formatCurrency(supplier.maxPrice)}
                                </div>
                                <span className="text-[10px] text-slate-400">estimated range</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions for Step 4 */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleFinish}
                disabled={selectedCount < 2}
                className={`px-6 py-3 text-sm font-bold text-white rounded-lg shadow-sm transition-all flex items-center gap-2 ${
                  selectedCount >= 2
                    ? 'bg-rose-700 hover:bg-rose-800'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Find My Best Date</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STICKY SUMMARY BOTTOM BAR (Present during Step 4 for instant feedback) */}
      {step === 4 && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl z-30 py-3.5 px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-sm">
                {selectedCount}/4
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  {selectedCount} {selectedCount === 1 ? 'supplier' : 'suppliers'} selected
                </p>
                <p className="text-xs text-slate-500">
                  Combined price range:{' '}
                  <span className="font-bold text-slate-800 tabular-nums">
                    {formatCurrency(minTotal)} – {formatCurrency(maxTotal)}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {selectedCount < 2 && (
                <span className="text-xs text-amber-700 font-medium hidden md:inline">
                  Select at least 2 suppliers to optimize
                </span>
              )}
              <button
                onClick={handleFinish}
                disabled={selectedCount < 2}
                className={`w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 ${
                  selectedCount >= 2
                    ? 'bg-rose-700 hover:bg-rose-800 active:bg-rose-900'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Find My Best Date →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
