import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DateResult, SupplierDatePriceBreakdown } from '../types/wedding';
import { formatCurrency } from '../services/pricingEngine';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingDown,
  Sliders,
  DollarSign,
  HelpCircle,
  Clock,
  Info
} from 'lucide-react';

export const ResultsDashboard: React.FC = () => {
  const {
    optimizationResult,
    isCalculating,
    loadingProgress,
    loadingStepText,
    recalculateResults,
    setActiveView
  } = useApp();

  // Sorting state for table
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Accordion expanded date strings
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Selected date from calendar heatmap
  const [selectedHeatmapDate, setSelectedHeatmapDate] = useState<string | null>(null);

  // Count-up animation for savings
  const [animatedSavings, setAnimatedSavings] = useState<number>(0);
  const targetSavings = optimizationResult?.recommendedDateResult?.savingsVsPreferred || 0;

  useEffect(() => {
    if (isCalculating) {
      setAnimatedSavings(0);
      return;
    }

    if (targetSavings <= 0) {
      setAnimatedSavings(0);
      return;
    }

    let start = 0;
    const duration = 1200; // 1.2s count up
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + ease * targetSavings);
      setAnimatedSavings(current);

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [targetSavings, isCalculating]);

  // Loading State Screen
  if (isCalculating) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-28 text-center space-y-8 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-700 mx-auto flex items-center justify-center shadow-inner">
          <Sparkles className="w-8 h-8 animate-pulse text-rose-600" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Finding your best wedding date...
          </h2>
          <p className="text-sm text-slate-500 min-h-[20px]">
            {loadingStepText}
          </p>
        </div>

        {/* Progress bar */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Scanning 4 suppliers</span>
            <span>{loadingProgress}%</span>
            <span>31 August dates</span>
          </div>
        </div>
      </div>
    );
  }

  if (!optimizationResult) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-slate-600">No calculation data yet.</p>
        <button
          onClick={() => setActiveView('wizard')}
          className="px-5 py-2.5 bg-rose-700 text-white rounded-lg font-semibold text-sm"
        >
          Start Search Wizard
        </button>
      </div>
    );
  }

  const {
    criteria,
    preferredDateResult,
    recommendedDateResult,
    cheapestDateResult,
    availableDates,
    allEvaluatedDates,
    bottleneckSupplier,
    datesWithinBudgetCount,
    totalDatesEvaluated
  } = optimizationResult;

  // Handle Edge Case: No dates where all suppliers are available
  const hasNoAvailableDates = availableDates.length === 0;

  // Handle Edge Case: Preferred date is already the cheapest
  const isPreferredAlreadyCheapest =
    preferredDateResult &&
    cheapestDateResult &&
    preferredDateResult.dateString === cheapestDateResult.dateString &&
    preferredDateResult.allSuppliersAvailable;

  // Handle Edge Case: All available dates over budget
  const areAllOverBudget =
    availableDates.length > 0 && datesWithinBudgetCount === 0;

  // Sorted list of available dates
  const sortedDates = [...availableDates].sort((a, b) => {
    if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
    } else {
      return sortOrder === 'asc'
        ? a.dateString.localeCompare(b.dateString)
        : b.dateString.localeCompare(a.dateString);
    }
  });

  const toggleSort = (type: 'date' | 'price') => {
    if (sortBy === type) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
  };

  // Difference breakdown between preferred and recommended
  const bestDate = recommendedDateResult || cheapestDateResult || availableDates[0];
  const budgetBuffer = bestDate ? criteria.budget - bestDate.totalPrice : 0;
  const isBestWithinBudget = budgetBuffer >= 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Optimization Analysis
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">
              August 2027 · {criteria.guestCount} guests
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Wedding Date Comparison Results
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={recalculateResults}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            title="Re-run calculation algorithm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Recalculate</span>
          </button>
          <button
            onClick={() => setActiveView('wizard')}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Suppliers</span>
          </button>
        </div>
      </div>

      {/* EDGE CASE ALERTS */}
      {hasNoAvailableDates && (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
          <div className="flex items-center gap-2 font-bold text-lg text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>No common dates found where all your selected suppliers are available</span>
          </div>
          <p className="text-sm text-rose-700">
            During August 2027, there were 0 days where all {Object.values(criteria.selectedSupplierIds).filter(Boolean).length} chosen suppliers had matching availability.
          </p>
          {bottleneckSupplier && (
            <div className="p-3 bg-white/80 rounded-lg border border-rose-200 text-xs text-rose-800">
              <strong>Bottleneck Supplier:</strong> {bottleneckSupplier.name} ({bottleneckSupplier.category}) was booked on {bottleneckSupplier.unavailableCount} dates. Swapping this supplier or expanding your target month will unlock multiple dates.
            </div>
          )}
          <button
            onClick={() => setActiveView('wizard')}
            className="mt-2 px-4 py-2 bg-rose-700 text-white rounded-lg text-xs font-semibold hover:bg-rose-800"
          >
            Modify Supplier Selection →
          </button>
        </div>
      )}

      {areAllOverBudget && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm">All available dates exceed your €{criteria.budget.toLocaleString()} budget</p>
            <p>
              Your cheapest option is {formatCurrency(cheapestDateResult?.totalPrice || 0)}, which is {formatCurrency((cheapestDateResult?.totalPrice || 0) - criteria.budget)} over your allocated budget. Consider raising your budget or swapping suppliers.
            </p>
          </div>
        </div>
      )}

      {preferredDateResult && !preferredDateResult.allSuppliersAvailable && (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-bold">Preferred Date Notice</p>
            <p>
              Your initial preferred date ({preferredDateResult.formattedDate}) is not available because <strong>{preferredDateResult.unavailableSupplierNames.join(', ')}</strong> is already booked. Below is your optimized alternative!
            </p>
          </div>
        </div>
      )}

      {isPreferredAlreadyCheapest && (
        <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Perfect Timing! 🎯</h3>
            <p className="text-xs text-emerald-700">
              Great news! Your preferred date ({preferredDateResult.formattedDate}) is already the cheapest available option in the entire month. No compromise needed!
            </p>
          </div>
        </div>
      )}

      {/* 1. HERO RESULT CARD (FULL WIDTH CELEBRATION) */}
      {bestDate && (
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-900 via-rose-800 to-slate-900 rounded-2xl p-8 sm:p-12 text-white shadow-xl">
          {/* Subtle decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-rose-200 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Recommended Match</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-rose-200/90">
                🎉 Your Best Wedding Date
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                {bestDate.dayOfWeekName}, {bestDate.formattedDate}
              </h2>
            </div>

            {/* Price & Savings Pill */}
            <div className="flex flex-wrap items-baseline gap-4 sm:gap-6 pt-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
                {formatCurrency(bestDate.totalPrice)}
              </div>

              {targetSavings > 0 && (
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-4 py-2 rounded-xl backdrop-blur-md">
                  <TrendingDown className="w-5 h-5 text-emerald-300" />
                  <div className="text-left">
                    <span className="text-xs text-emerald-200/80 block leading-tight">Total Savings</span>
                    <span className="text-base sm:text-lg font-bold text-white tabular-nums">
                      Save {formatCurrency(animatedSavings)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Positive Indicators */}
            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-rose-100">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All {bestDate.supplierBreakdowns.length} suppliers available</span>
              </div>

              {isBestWithinBudget ? (
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {formatCurrency(budgetBuffer)} under your {formatCurrency(criteria.budget)} budget
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-400/30 text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  <span>{formatCurrency(Math.abs(budgetBuffer))} above budget</span>
                </div>
              )}

              {preferredDateResult && targetSavings > 0 && (
                <div className="text-xs text-rose-200/80 self-center">
                  (vs {preferredDateResult.formattedDate}: {formatCurrency(preferredDateResult.totalPrice)})
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. SAVINGS BREAKDOWN (2-COLUMN & VISUAL BARS) */}
      {preferredDateResult && bestDate && targetSavings > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Where your savings come from
            </h3>
            <p className="text-xs text-slate-500">
              Direct line-item comparison between your preferred date ({preferredDateResult.formattedDate}) and your recommended date ({bestDate.formattedDate}).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Table */}
            <div className="lg:col-span-7 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 font-semibold">Supplier</th>
                    <th className="py-2.5 font-semibold text-right tabular-nums">
                      {preferredDateResult.formattedDate}
                    </th>
                    <th className="py-2.5 font-semibold text-right tabular-nums">
                      {bestDate.formattedDate}
                    </th>
                    <th className="py-2.5 font-semibold text-right text-emerald-700">Saved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bestDate.supplierBreakdowns.map(recBreakdown => {
                    const prefBreakdown = preferredDateResult.supplierBreakdowns.find(
                      p => p.supplierId === recBreakdown.supplierId
                    );
                    const prefPrice = prefBreakdown ? prefBreakdown.price : 0;
                    const saved = prefPrice - recBreakdown.price;

                    const catIcons: Record<string, string> = {
                      venue: '🏛️',
                      catering: '🍽️',
                      dj: '🎵',
                      photographer: '📸'
                    };

                    return (
                      <tr key={recBreakdown.supplierId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-medium text-slate-900 flex items-center gap-2">
                          <span>{catIcons[recBreakdown.category] || '✨'}</span>
                          <span className="truncate max-w-[160px] sm:max-w-none">
                            {recBreakdown.supplierName}
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-600 tabular-nums">
                          {formatCurrency(prefPrice)}
                        </td>
                        <td className="py-3 text-right font-semibold text-slate-900 tabular-nums">
                          {formatCurrency(recBreakdown.price)}
                        </td>
                        <td className="py-3 text-right font-bold text-emerald-600 tabular-nums">
                          {saved > 0 ? `+${formatCurrency(saved)}` : '€0'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 font-bold">
                    <td className="py-3.5 text-slate-900">TOTAL</td>
                    <td className="py-3.5 text-right text-slate-600 tabular-nums">
                      {formatCurrency(preferredDateResult.totalPrice)}
                    </td>
                    <td className="py-3.5 text-right text-slate-900 tabular-nums">
                      {formatCurrency(bestDate.totalPrice)}
                    </td>
                    <td className="py-3.5 text-right text-emerald-600 text-base tabular-nums">
                      +{formatCurrency(targetSavings)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Right: Visual Savings Differential Bars */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Savings Distribution by Supplier
              </h4>

              <div className="space-y-3.5">
                {bestDate.supplierBreakdowns.map(rec => {
                  const pref = preferredDateResult.supplierBreakdowns.find(p => p.supplierId === rec.supplierId);
                  const saved = (pref?.price || 0) - rec.price;
                  const percentOfTotal = targetSavings > 0 ? Math.max(0, Math.round((saved / targetSavings) * 100)) : 0;

                  return (
                    <div key={rec.supplierId} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 truncate">{rec.supplierName}</span>
                        <span className="font-semibold text-emerald-700 tabular-nums">
                          {saved > 0 ? `+${formatCurrency(saved)} (${percentOfTotal}%)` : 'Base price'}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                          style={{ width: `${percentOfTotal}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                Venues and caterers offer the largest flexibility on off-peak weekdays or specific dates, unlocking significant cash savings without reducing menu quality or hours.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. BUDGET ANALYSIS */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Budget Analysis</h3>
            <p className="text-xs text-slate-500">
              Allocated wedding budget: <span className="font-semibold text-slate-800">{formatCurrency(criteria.budget)}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              {datesWithinBudgetCount} of {availableDates.length} available dates are within budget
            </span>
          </div>
        </div>

        {bestDate && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>{bestDate.formattedDate} Total: {formatCurrency(bestDate.totalPrice)}</span>
              <span>Budget Cap: {formatCurrency(criteria.budget)}</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isBestWithinBudget ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
                style={{ width: `${Math.min(100, Math.round((bestDate.totalPrice / criteria.budget) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-bold text-emerald-700">
                {isBestWithinBudget
                  ? `✅ ${formatCurrency(budgetBuffer)} remaining safety buffer`
                  : `⚠️ ${formatCurrency(Math.abs(budgetBuffer))} over target budget`}
              </span>
              <span className="text-slate-400 font-mono">
                {Math.round((bestDate.totalPrice / criteria.budget) * 100)}% of budget
              </span>
            </div>
          </div>
        )}
      </section>

      {/* 4. PRICE CALENDAR HEATMAP (WOW FACTOR) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              August 2027 Dynamic Price Heatmap
            </h3>
            <p className="text-xs text-slate-500">
              Hover over dates to see live quotes. Click any cell to inspect supplier breakdowns.
            </p>
          </div>

          {/* Heatmap Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
              <span>Great Deal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
              <span>Moderate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
              <span>Over Budget</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
              <span>Unavailable</span>
            </span>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="max-w-4xl mx-auto border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
          {/* Weekday headers (Mon - Sun) */}
          <div className="grid grid-cols-7 text-center py-2.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* 31 days grid */}
          <div className="grid grid-cols-7 gap-1 p-2 bg-slate-50">
            {/* August 2027 starts on Sunday 1 Aug.
                Monday to Saturday before Day 1 need 6 empty slots */}
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 sm:h-20 bg-slate-100/50 rounded-lg opacity-40" />
            ))}

            {/* Render days 1 to 31 */}
            {allEvaluatedDates.map(d => {
              const isSelected = selectedHeatmapDate === d.dateString;
              const isPreferred = d.isPreferredDate;
              const isRecommended = d.isRecommended;

              // Color calculation:
              // Unavailable = gray
              // Available & <= budget & cheap = emerald green
              // Available & <= budget = amber/light emerald
              // Available & > budget = rose/red
              let cellBg = 'bg-slate-200 text-slate-400';
              let badgeText = 'Booked';

              if (d.allSuppliersAvailable) {
                if (d.totalPrice > criteria.budget) {
                  cellBg = 'bg-rose-100 text-rose-900 border-rose-200 hover:bg-rose-200';
                  badgeText = 'Over';
                } else if (cheapestDateResult && d.totalPrice <= cheapestDateResult.totalPrice * 1.05) {
                  cellBg = 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm';
                  badgeText = 'Best';
                } else if (d.totalPrice <= criteria.budget * 0.95) {
                  cellBg = 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-200';
                  badgeText = 'Low';
                } else {
                  cellBg = 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-200';
                  badgeText = 'Mid';
                }
              }

              return (
                <button
                  key={d.dateString}
                  onClick={() => {
                    setSelectedHeatmapDate(d.dateString);
                    setExpandedDate(d.dateString);
                  }}
                  className={`group relative h-16 sm:h-20 p-1 sm:p-2 rounded-lg flex flex-col justify-between text-left transition-all ${cellBg} ${
                    isSelected ? 'ring-2 ring-slate-900 ring-offset-2 scale-[1.02] z-10' : ''
                  }`}
                  title={`${d.formattedDate}: ${
                    d.allSuppliersAvailable
                      ? `${formatCurrency(d.totalPrice)} (${d.dayOfWeekName})`
                      : `Unavailable (${d.unavailableSupplierNames.join(', ')})`
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs sm:text-sm font-bold">{d.dayNumber}</span>
                    <div className="flex items-center gap-0.5">
                      {isPreferred && <span title="Preferred Date" className="text-xs">⭐</span>}
                      {isRecommended && <span title="Recommended Deal" className="text-xs">✨</span>}
                    </div>
                  </div>

                  <div className="w-full">
                    {d.allSuppliersAvailable ? (
                      <div className="text-[10px] sm:text-xs font-bold truncate tabular-nums">
                        {formatCurrency(d.totalPrice)}
                      </div>
                    ) : (
                      <div className="text-[9px] sm:text-[10px] text-slate-500 truncate line-through">
                        Unavailable
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ALL AVAILABLE DATES TABLE (SORTABLE & EXPANDABLE) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              All Available Dates ({availableDates.length} found)
            </h3>
            <p className="text-xs text-slate-500">
              Sorted by your preference. Click any row to expand per-supplier line items.
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sort by:</span>
            <button
              onClick={() => toggleSort('date')}
              className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1 transition-colors ${
                sortBy === 'date'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Date</span>
              {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
            </button>
            <button
              onClick={() => toggleSort('price')}
              className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1 transition-colors ${
                sortBy === 'price'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Total Price</span>
              {sortBy === 'price' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
            </button>
          </div>
        </div>

        {/* Date Rows Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
          {sortedDates.map(dateItem => {
            const isExpanded = expandedDate === dateItem.dateString;
            const isRec = dateItem.isRecommended;
            const isPref = dateItem.isPreferredDate;
            const isCheap = dateItem.isCheapest;

            return (
              <div key={dateItem.dateString} className="group">
                <div
                  onClick={() => setExpandedDate(isExpanded ? null : dateItem.dateString)}
                  className={`p-4 sm:px-6 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                    isExpanded
                      ? 'bg-rose-50/40'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex flex-col items-center justify-center text-slate-700 shrink-0 font-mono">
                      <span className="text-[10px] uppercase font-bold leading-none">{dateItem.dayOfWeekShort}</span>
                      <span className="text-sm font-extrabold leading-none mt-0.5">{dateItem.dayNumber}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {dateItem.formattedDate}
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          ({dateItem.dayOfWeekName})
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {isRec && (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                            ✨ Recommended Deal
                          </span>
                        )}
                        {isCheap && !isRec && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            💰 Absolute Cheapest
                          </span>
                        )}
                        {isPref && (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            ⭐ Preferred Date
                          </span>
                        )}
                        {dateItem.savingsVsPreferred > 0 && (
                          <span className="text-[11px] font-semibold text-emerald-700">
                            Save {formatCurrency(dateItem.savingsVsPreferred)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
                        {formatCurrency(dateItem.totalPrice)}
                      </div>
                      <span
                        className={`text-[11px] font-medium block ${
                          dateItem.isWithinBudget ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {dateItem.isWithinBudget ? 'Within Budget' : 'Over Budget'}
                      </span>
                    </div>

                    <div className="text-slate-400 group-hover:text-slate-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Accordion Detail Content */}
                {isExpanded && (
                  <div className="bg-slate-50/90 px-4 py-4 sm:px-6 border-t border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Supplier Price Breakdown for {dateItem.formattedDate} ({dateItem.dayOfWeekName})
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {dateItem.supplierBreakdowns.map(item => (
                        <div
                          key={item.supplierId}
                          className="bg-white p-3 rounded-lg border border-slate-200 space-y-1"
                        >
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {item.supplierName}
                          </div>
                          <div className="text-[11px] text-slate-500 uppercase tracking-wide">
                            {item.category}
                          </div>
                          <div className="pt-1 flex items-baseline justify-between text-xs font-semibold">
                            <span className="text-slate-700">Rate for this day:</span>
                            <span className="text-slate-900 tabular-nums font-bold">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Base: {formatCurrency(item.minPrice)} – {formatCurrency(item.maxPrice)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Sticky Action Bar */}
      <div className="text-center pt-4">
        <p className="text-xs text-slate-400">
          Calculations generated dynamically client-side in real-time · Netherlands Wedding Market Mock Dataset
        </p>
      </div>
    </div>
  );
};
