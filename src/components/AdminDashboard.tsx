import React, { useState } from 'react';
import { useApp, AdminTab } from '../context/AppContext';
import { Supplier, SupplierCategory, PricingRules } from '../types/wedding';
import { formatCurrency, calculateSupplierPriceForDate } from '../services/pricingEngine';
import {
  Users,
  Calendar,
  DollarSign,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Sliders,
  Eye,
  Check,
  MapPin,
  TrendingDown
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    setActiveView,
    suppliers,
    availabilityMap,
    pricingRules,
    searchHistory,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    toggleDateAvailability,
    setAllSupplierDatesAvailable,
    setSupplierWeekendsUnavailable,
    resetAvailability,
    updateDayAdjustment,
    updateSeasonAdjustment,
    resetPricingRules
  } = useApp();

  // Suppliers Tab state
  const [supplierFilterCat, setSupplierFilterCat] = useState<string>('all');
  const [supplierSearchQuery, setSupplierSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form state for Add/Edit
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<SupplierCategory>('venue');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formCapacity, setFormCapacity] = useState<number>(150);
  const [formMinPrice, setFormMinPrice] = useState<number>(5000);
  const [formMaxPrice, setFormMaxPrice] = useState<number>(10000);

  // Availability Tab state
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || 'venue-1');

  // Searches Tab state
  const [expandedSearchId, setExpandedSearchId] = useState<string | null>(null);

  // Open modal for add
  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormName('');
    setFormCategory('venue');
    setFormLocation('Amsterdam');
    setFormCapacity(150);
    setFormMinPrice(5000);
    setFormMaxPrice(10000);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setFormName(sup.name);
    setFormCategory(sup.category);
    setFormLocation(sup.location);
    setFormCapacity(sup.capacity);
    setFormMinPrice(sup.minPrice);
    setFormMaxPrice(sup.maxPrice);
    setIsModalOpen(true);
  };

  // Save supplier
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    if (editingSupplier) {
      updateSupplier({
        ...editingSupplier,
        name: formName,
        category: formCategory,
        location: formLocation,
        capacity: Number(formCapacity),
        minPrice: Number(formMinPrice),
        maxPrice: Number(formMaxPrice)
      });
    } else {
      addSupplier({
        name: formName,
        category: formCategory,
        location: formLocation,
        capacity: Number(formCapacity),
        minPrice: Number(formMinPrice),
        maxPrice: Number(formMaxPrice),
        rating: 4.8,
        reviewCount: 50,
        tagline: 'Premier wedding specialist in the Netherlands'
      });
    }
    setIsModalOpen(false);
  };

  // Filtered suppliers
  const filteredSuppliers = suppliers.filter(s => {
    const matchesCat = supplierFilterCat === 'all' || s.category === supplierFilterCat;
    const matchesQuery = s.name.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(supplierSearchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Calculate live preview for sample supplier: Venue with €6,000 - €10,000
  const sampleSupplier: Supplier = {
    id: 'sample',
    name: 'Sample Estate',
    category: 'venue',
    location: 'Utrecht',
    capacity: 150,
    minPrice: 6000,
    maxPrice: 10000
  };

  // Live preview test scenarios
  // Saturday in Aug (high)
  const satAug = calculateSupplierPriceForDate(sampleSupplier, new Date('2027-08-07T12:00:00'), pricingRules);
  // Friday in Aug (high)
  const friAug = calculateSupplierPriceForDate(sampleSupplier, new Date('2027-08-06T12:00:00'), pricingRules);
  // Tuesday in Aug (high)
  const tueAug = calculateSupplierPriceForDate(sampleSupplier, new Date('2027-08-03T12:00:00'), pricingRules);
  // Saturday in Nov (low)
  const satNov = calculateSupplierPriceForDate(sampleSupplier, new Date('2027-11-06T12:00:00'), pricingRules);
  // Tuesday in Nov (low)
  const tueNov = calculateSupplierPriceForDate(sampleSupplier, new Date('2027-11-02T12:00:00'), pricingRules);

  const activeSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 flex flex-col justify-between">
        <div className="p-5 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
              W
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">WedSmart Admin</span>
              <span className="text-[11px] text-slate-400">Supplier & Pricing Control</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setAdminTab('suppliers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                adminTab === 'suppliers'
                  ? 'bg-rose-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Suppliers ({suppliers.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('availability')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                adminTab === 'availability'
                  ? 'bg-rose-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Availability Calendar</span>
            </button>

            <button
              onClick={() => setAdminTab('pricing')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                adminTab === 'pricing'
                  ? 'bg-rose-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Pricing Rules Engine</span>
            </button>

            <button
              onClick={() => setAdminTab('searches')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                adminTab === 'searches'
                  ? 'bg-rose-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Calculation Debug Log</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setActiveView('landing')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to WedSmart View</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-8 max-w-6xl overflow-y-auto">
        {/* TAB 1: SUPPLIERS */}
        {adminTab === 'suppliers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Supplier Management</h1>
                <p className="text-xs text-slate-500">
                  Manage Dutch partner venues, caterers, DJs, and photographers with capacity & base ranges.
                </p>
              </div>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Supplier</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search supplier by name or city..."
                  value={supplierSearchQuery}
                  onChange={e => setSupplierSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <select
                value={supplierFilterCat}
                onChange={e => setSupplierFilterCat(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="all">All Categories ({suppliers.length})</option>
                <option value="venue">🏛️ Venue (5)</option>
                <option value="catering">🍽️ Catering (5)</option>
                <option value="dj">🎵 DJ / Band (5)</option>
                <option value="photographer">📸 Photographer (5)</option>
              </select>
            </div>

            {/* Suppliers Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Supplier Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4 text-center">Max Guests</th>
                      <th className="py-3 px-4 text-right">Price Range</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSuppliers.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div>{s.name}</div>
                          {s.tagline && <div className="text-[10px] text-slate-400 font-normal truncate max-w-xs">{s.tagline}</div>}
                        </td>
                        <td className="py-3 px-4 text-slate-600 capitalize">
                          {s.category === 'venue' ? '🏛️ Venue' :
                           s.category === 'catering' ? '🍽️ Catering' :
                           s.category === 'dj' ? '🎵 DJ / Band' : '📸 Photographer'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{s.location}</span>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-700 font-mono">
                          {s.capacity >= 900 ? 'Any' : `${s.capacity}`}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-900 tabular-nums">
                          {formatCurrency(s.minPrice)} – {formatCurrency(s.maxPrice)}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors"
                            title="Edit Supplier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${s.name}?`)) {
                                deleteSupplier(s.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 rounded text-rose-600 hover:text-rose-800 transition-colors"
                            title="Delete Supplier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AVAILABILITY */}
        {adminTab === 'availability' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Availability Calendar Editor</h1>
                <p className="text-xs text-slate-500">
                  Click any calendar date to toggle between Available (✅) and Booked (❌).
                </p>
              </div>

              {/* Supplier Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700">Supplier:</label>
                <select
                  value={selectedSupplierId}
                  onChange={e => setSelectedSupplierId(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calendar Controls & Month */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-slate-900">
                    August 2027 Calendar · <span className="text-rose-700">{activeSupplier?.name}</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAllSupplierDatesAvailable(selectedSupplierId)}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                  >
                    Mark All Available
                  </button>
                  <button
                    onClick={() => setSupplierWeekendsUnavailable(selectedSupplierId)}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                  >
                    Mark Weekends Booked
                  </button>
                  <button
                    onClick={resetAvailability}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Interactive Calendar Grid */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                <div className="grid grid-cols-7 text-center py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>

                <div className="grid grid-cols-7 gap-1 p-2 bg-slate-50">
                  {/* Empty offset slots for 1 Aug 2027 (Sunday) */}
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={`cal-empty-${idx}`} className="h-14 bg-slate-100/40 rounded-md" />
                  ))}

                  {/* 31 Days */}
                  {Array.from({ length: 31 }, (_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `2027-08-${String(dayNum).padStart(2, '0')}`;
                    const isAvailable = availabilityMap[selectedSupplierId]?.[dateStr] ?? true;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => toggleDateAvailability(selectedSupplierId, dateStr)}
                        className={`h-14 rounded-md p-1.5 flex flex-col justify-between text-left transition-all border ${
                          isAvailable
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                            : 'bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100'
                        }`}
                        title="Click to toggle availability"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold">{dayNum}</span>
                          <span className="text-xs">
                            {isAvailable ? '✅' : '❌'}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold">
                          {isAvailable ? 'Available' : 'Booked'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRICING RULES */}
        {adminTab === 'pricing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pricing Rules Engine</h1>
                <p className="text-xs text-slate-500">
                  Adjust day-of-week and seasonal price modifiers. Observe the Live Preview update instantly.
                </p>
              </div>

              <button
                onClick={resetPricingRules}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default Rules</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Sliders for Day of Week & Season */}
              <div className="lg:col-span-7 space-y-6">
                {/* Day of Week */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Day of Week Adjustments
                  </h3>

                  <div className="space-y-3">
                    {[
                      { key: 'monday', label: 'Monday', note: 'Off-peak' },
                      { key: 'tuesday', label: 'Tuesday', note: 'Off-peak' },
                      { key: 'wednesday', label: 'Wednesday', note: 'Mid-week' },
                      { key: 'thursday', label: 'Thursday', note: 'Pre-weekend' },
                      { key: 'friday', label: 'Friday', note: 'High demand' },
                      { key: 'saturday', label: 'Saturday', note: 'Base rate (0%)' },
                      { key: 'sunday', label: 'Sunday', note: 'Weekend discount' }
                    ].map(day => {
                      const dayKey = day.key as keyof PricingRules['dayOfWeek'];
                      const val = pricingRules.dayOfWeek[dayKey];
                      const percentVal = Math.round(val * 100);

                      return (
                        <div key={day.key} className="flex items-center justify-between gap-4 text-xs">
                          <div className="w-28">
                            <span className="font-semibold text-slate-800 block">{day.label}</span>
                            <span className="text-[10px] text-slate-400">{day.note}</span>
                          </div>

                          <input
                            type="range"
                            min="-50"
                            max="50"
                            step="5"
                            value={percentVal}
                            onChange={e => updateDayAdjustment(dayKey, Number(e.target.value) / 100)}
                            className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-700"
                          />

                          <div className="w-16 text-right font-mono font-bold text-slate-900">
                            {percentVal > 0 ? `+${percentVal}%` : `${percentVal}%`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Season Adjustments */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Seasonal Adjustments
                  </h3>

                  <div className="space-y-3">
                    {[
                      { key: 'low', label: 'Low Season', months: 'Nov, Dec, Jan, Feb' },
                      { key: 'normal', label: 'Normal Season', months: 'Mar, Apr, Oct' },
                      { key: 'high', label: 'High Season', months: 'May, Jun, Jul, Aug, Sep' }
                    ].map(season => {
                      const seasonKey = season.key as keyof PricingRules['season'];
                      const val = pricingRules.season[seasonKey];
                      const percentVal = Math.round(val * 100);

                      return (
                        <div key={season.key} className="flex items-center justify-between gap-4 text-xs">
                          <div className="w-36">
                            <span className="font-semibold text-slate-800 block">{season.label}</span>
                            <span className="text-[10px] text-slate-400">{season.months}</span>
                          </div>

                          <input
                            type="range"
                            min="-40"
                            max="40"
                            step="5"
                            value={percentVal}
                            onChange={e => updateSeasonAdjustment(seasonKey, Number(e.target.value) / 100)}
                            className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-700"
                          />

                          <div className="w-16 text-right font-mono font-bold text-slate-900">
                            {percentVal > 0 ? `+${percentVal}%` : `${percentVal}%`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: LIVE PREVIEW MATRIX */}
              <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-rose-700" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Real-time Live Preview
                  </h3>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                  <strong>Benchmark Supplier:</strong> Venue with {formatCurrency(sampleSupplier.minPrice)} – {formatCurrency(sampleSupplier.maxPrice)} range
                </div>

                {/* Live Preview List */}
                <div className="space-y-2.5 divide-y divide-slate-100 text-xs">
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-600">Saturday in Aug (High):</span>
                    <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(satAug.price)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-600">Friday in Aug (High):</span>
                    <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(friAug.price)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-600">Tuesday in Aug (High):</span>
                    <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(tueAug.price)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-600">Saturday in Nov (Low):</span>
                    <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(satNov.price)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-600">Tuesday in Nov (Low):</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(tueNov.price)}</span>
                      {tueNov.price <= sampleSupplier.minPrice && (
                        <span className="text-[10px] text-amber-600 block">⚠️ Clamped to minimum</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-[11px] text-emerald-800">
                  ✅ The formula guarantees that prices remain bounded between the supplier's minimum and maximum constraints while accurately incentivizing couples to book off-peak dates.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SEARCHES / DEBUG LOG */}
        {adminTab === 'searches' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Calculation Debug History</h1>
              <p className="text-xs text-slate-500">
                Inspect how recent couple searches were evaluated by the algorithm.
              </p>
            </div>

            <div className="space-y-4">
              {searchHistory.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                  No searches run yet. Go to couple view and execute an optimization search.
                </div>
              ) : (
                searchHistory.map((entry, index) => {
                  const isExpanded = expandedSearchId === entry.id;

                  return (
                    <div key={entry.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div
                        onClick={() => setExpandedSearchId(isExpanded ? null : entry.id)}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              Search #{searchHistory.length - index}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs text-slate-500">{entry.timestamp}</span>
                          </div>
                          <div className="text-xs text-slate-600">
                            {entry.guestCount} guests · Preferred {entry.preferredDate} · Budget {formatCurrency(entry.budget)}
                          </div>
                          <div className="text-xs text-slate-500">
                            Suppliers: {entry.selectedSuppliersSummary.join(', ')}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-rose-700">
                            Recommended: {entry.recommendedDate} ({formatCurrency(entry.recommendedPrice)})
                          </div>
                          {entry.savings > 0 && (
                            <div className="text-xs font-semibold text-emerald-600">
                              Save +{formatCurrency(entry.savings)}
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400">
                            {entry.validDatesCount} matching dates found
                          </div>
                        </div>
                      </div>

                      {/* Expanded calculation details */}
                      {isExpanded && (
                        <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4 text-xs">
                          <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                            Algorithm Elimination Breakdown
                          </h4>

                          <div className="space-y-2">
                            <p className="text-slate-600">
                              Total days scanned: <strong>{entry.totalDatesEvaluated}</strong>. Valid days: <strong>{entry.validDatesCount}</strong>.
                            </p>

                            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg bg-white p-3 space-y-1 font-mono text-[11px]">
                              {entry.eliminatedDates.length === 0 ? (
                                <span className="text-emerald-700">All dates were available!</span>
                              ) : (
                                entry.eliminatedDates.map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-slate-600">
                                    <span className="font-semibold">{item.date}</span>
                                    <span className="text-rose-600">{item.reason}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* ADD / EDIT SUPPLIER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Supplier Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="e.g. Het Witte Kasteel"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as SupplierCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="venue">Venue</option>
                    <option value="catering">Catering</option>
                    <option value="dj">DJ / Band</option>
                    <option value="photographer">Photographer</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Location City</label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="e.g. Amsterdam"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Maximum Capacity (Guests)</label>
                <input
                  type="number"
                  required
                  min="10"
                  max="1000"
                  value={formCapacity}
                  onChange={e => setFormCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Min Base Price (€)</label>
                  <input
                    type="number"
                    required
                    step="100"
                    value={formMinPrice}
                    onChange={e => setFormMinPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Base Price (€)</label>
                  <input
                    type="number"
                    required
                    step="100"
                    value={formMaxPrice}
                    onChange={e => setFormMaxPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
