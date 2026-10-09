import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Supplier,
  PricingRules,
  SearchCriteria,
  SearchOptimizationResult,
  SearchHistoryEntry
} from '../types/wedding';
import {
  INITIAL_SUPPLIERS,
  INITIAL_PRICING_RULES,
  generateInitialAvailability
} from '../data/mockData';
import {
  runOptimizationSearch
} from '../services/pricingEngine';

export type ActiveView = 'landing' | 'wizard' | 'results' | 'admin';
export type AdminTab = 'suppliers' | 'availability' | 'pricing' | 'searches';

interface AppContextType {
  // Navigation & View State
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Data & Rules
  suppliers: Supplier[];
  availabilityMap: Record<string, Record<string, boolean>>;
  pricingRules: PricingRules;
  searchCriteria: SearchCriteria;
  optimizationResult: SearchOptimizationResult | null;
  isCalculating: boolean;
  loadingProgress: number;
  loadingStepText: string;
  searchHistory: SearchHistoryEntry[];

  // Actions
  updateCriteria: (updates: Partial<SearchCriteria>) => void;
  runDemoSearch: () => void;
  executeSearch: (criteriaOverride?: SearchCriteria) => void;
  recalculateResults: () => void;

  // Admin Actions
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (supplierId: string) => void;
  toggleDateAvailability: (supplierId: string, dateStr: string) => void;
  setAllSupplierDatesAvailable: (supplierId: string) => void;
  setSupplierWeekendsUnavailable: (supplierId: string) => void;
  resetAvailability: () => void;
  updateDayAdjustment: (day: keyof PricingRules['dayOfWeek'], value: number) => void;
  updateSeasonAdjustment: (season: keyof PricingRules['season'], value: number) => void;
  resetPricingRules: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Special calendar calibration overrides for the August 2027 demo pitch
// Ensures 15 Aug = €18,500 and 22 Aug = €17,200 as specified in client pitch specs
const DEMO_DATE_OVERRIDES: Record<string, Record<string, number>> = {
  'venue-1': {
    '2027-08-15': -0.283, // Results in €9,000
    '2027-08-22': -0.450  // Results in €8,000 (min price)
  },
  'catering-1': {
    '2027-08-15': -0.021, // Results in €6,000
    '2027-08-22': -0.107  // Results in €5,700
  },
  'dj-1': {
    '2027-08-15': 0.165,  // Results in €2,000
    '2027-08-22': 0.165   // Results in €2,000
  },
  'photo-1': {
    '2027-08-15': -0.450, // Results in €1,500
    '2027-08-22': -0.450  // Results in €1,500
  }
};

const DEFAULT_CRITERIA: SearchCriteria = {
  guestCount: 150,
  hasSpecificDate: true,
  preferredDate: '2027-08-15',
  rangeStart: '2027-08-01',
  rangeEnd: '2027-08-31',
  budget: 18000,
  selectedSupplierIds: {
    venue: 'venue-1',
    catering: 'catering-1',
    dj: 'dj-1',
    photographer: 'photo-1'
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [adminTab, setAdminTab] = useState<AdminTab>('suppliers');

  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, Record<string, boolean>>>(() => generateInitialAvailability());
  const [pricingRules, setPricingRules] = useState<PricingRules>(INITIAL_PRICING_RULES);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(DEFAULT_CRITERIA);
  const [optimizationResult, setOptimizationResult] = useState<SearchOptimizationResult | null>(null);

  // Calculation state for realistic animation
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStepText, setLoadingStepText] = useState<string>('Checking availability for suppliers across 31 dates...');

  // Search History
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);

  // Initial calculation on mount so demo results are ready immediately
  useEffect(() => {
    const initialRes = runOptimizationSearch(
      DEFAULT_CRITERIA,
      INITIAL_SUPPLIERS,
      availabilityMap,
      INITIAL_PRICING_RULES,
      DEMO_DATE_OVERRIDES
    );
    setOptimizationResult(initialRes);

    // Initial search entry
    const initialEntry: SearchHistoryEntry = {
      id: 'search-demo-1',
      timestamp: 'Just now',
      guestCount: 150,
      preferredDate: '15 Aug 2027',
      budget: 18000,
      selectedSuppliersSummary: ['Het Witte Kasteel', 'LOOF Catering', 'DJ Valentino', 'Studio Lenssen'],
      recommendedDate: '22 Aug 2027',
      recommendedPrice: 17200,
      savings: 1300,
      validDatesCount: initialRes.availableDates.length,
      totalDatesEvaluated: initialRes.totalDatesEvaluated,
      eliminatedDates: initialRes.allEvaluatedDates
        .filter(d => !d.allSuppliersAvailable)
        .map(d => ({
          date: d.formattedDate,
          reason: `${d.unavailableSupplierNames.join(', ')} unavailable`
        }))
    };
    setSearchHistory([initialEntry]);
  }, []);

  const updateCriteria = (updates: Partial<SearchCriteria>) => {
    setSearchCriteria(prev => ({
      ...prev,
      ...updates
    }));
  };

  const triggerSearchSequence = (criteriaToRun: SearchCriteria) => {
    setIsCalculating(true);
    setLoadingProgress(10);
    setLoadingStepText('Scanning supplier availability for August 2027...');

    const step1 = setTimeout(() => {
      setLoadingProgress(45);
      setLoadingStepText('Applying day-of-week & high-season dynamic pricing engine...');
    }, 450);

    const step2 = setTimeout(() => {
      setLoadingProgress(80);
      setLoadingStepText('Comparing total package costs against preferred date (15 Aug)...');
    }, 1050);

    const step3 = setTimeout(() => {
      setLoadingProgress(100);
      setLoadingStepText('Optimizing savings & budget allocation...');

      const result = runOptimizationSearch(
        criteriaToRun,
        suppliers,
        availabilityMap,
        pricingRules,
        DEMO_DATE_OVERRIDES
      );

      setOptimizationResult(result);

      // Record in search history
      const selectedNames = Object.values(criteriaToRun.selectedSupplierIds)
        .map(id => suppliers.find(s => s.id === id)?.name)
        .filter(Boolean) as string[];

      const historyEntry: SearchHistoryEntry = {
        id: `search-${Date.now()}`,
        timestamp: 'Just now',
        guestCount: criteriaToRun.guestCount,
        preferredDate: criteriaToRun.preferredDate,
        budget: criteriaToRun.budget,
        selectedSuppliersSummary: selectedNames,
        recommendedDate: result.recommendedDateResult?.formattedDate || 'N/A',
        recommendedPrice: result.recommendedDateResult?.totalPrice || 0,
        savings: result.recommendedDateResult?.savingsVsPreferred || 0,
        validDatesCount: result.availableDates.length,
        totalDatesEvaluated: result.totalDatesEvaluated,
        eliminatedDates: result.allEvaluatedDates
          .filter(d => !d.allSuppliersAvailable)
          .map(d => ({
            date: d.formattedDate,
            reason: `${d.unavailableSupplierNames.join(', ')} unavailable`
          }))
      };

      setSearchHistory(prev => [historyEntry, ...prev.slice(0, 19)]);
      setIsCalculating(false);
      setActiveView('results');
    }, 1600);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const executeSearch = (criteriaOverride?: SearchCriteria) => {
    const toRun = criteriaOverride || searchCriteria;
    triggerSearchSequence(toRun);
  };

  const recalculateResults = () => {
    executeSearch(searchCriteria);
  };

  const runDemoSearch = () => {
    const demoCriteria: SearchCriteria = {
      guestCount: 150,
      hasSpecificDate: true,
      preferredDate: '2027-08-15',
      rangeStart: '2027-08-01',
      rangeEnd: '2027-08-31',
      budget: 18000,
      selectedSupplierIds: {
        venue: 'venue-1',
        catering: 'catering-1',
        dj: 'dj-1',
        photographer: 'photo-1'
      }
    };
    setSearchCriteria(demoCriteria);
    executeSearch(demoCriteria);
  };

  // Supplier CRUD
  const addSupplier = (newSupplier: Omit<Supplier, 'id'>) => {
    const id = `${newSupplier.category}-${Date.now()}`;
    const fullSupplier: Supplier = { ...newSupplier, id };
    setSuppliers(prev => [...prev, fullSupplier]);

    // Initialize availability for August 2027
    setAvailabilityMap(prev => {
      const dates: Record<string, boolean> = {};
      for (let day = 1; day <= 31; day++) {
        const dateStr = `2027-08-${String(day).padStart(2, '0')}`;
        dates[dateStr] = day % 7 !== 0; // default Saturdays/Sundays mostly free except 1
      }
      return { ...prev, [id]: dates };
    });
  };

  const updateSupplier = (updated: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const deleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    setSearchCriteria(prev => {
      const updated = { ...prev.selectedSupplierIds };
      (Object.keys(updated) as Array<keyof typeof updated>).forEach(cat => {
        if (updated[cat] === supplierId) {
          updated[cat] = null;
        }
      });
      return { ...prev, selectedSupplierIds: updated };
    });
  };

  // Availability Management
  const toggleDateAvailability = (supplierId: string, dateStr: string) => {
    setAvailabilityMap(prev => {
      const supplierDates = { ...(prev[supplierId] || {}) };
      const current = supplierDates[dateStr] ?? true;
      supplierDates[dateStr] = !current;
      return {
        ...prev,
        [supplierId]: supplierDates
      };
    });
  };

  const setAllSupplierDatesAvailable = (supplierId: string) => {
    setAvailabilityMap(prev => {
      const supplierDates = { ...(prev[supplierId] || {}) };
      for (let day = 1; day <= 31; day++) {
        const dateStr = `2027-08-${String(day).padStart(2, '0')}`;
        supplierDates[dateStr] = true;
      }
      return {
        ...prev,
        [supplierId]: supplierDates
      };
    });
  };

  const setSupplierWeekendsUnavailable = (supplierId: string) => {
    setAvailabilityMap(prev => {
      const supplierDates = { ...(prev[supplierId] || {}) };
      for (let day = 1; day <= 31; day++) {
        const dateStr = `2027-08-${String(day).padStart(2, '0')}`;
        const date = new Date(`${dateStr}T12:00:00`);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 6 || dayOfWeek === 0) {
          supplierDates[dateStr] = false;
        }
      }
      return {
        ...prev,
        [supplierId]: supplierDates
      };
    });
  };

  const resetAvailability = () => {
    setAvailabilityMap(generateInitialAvailability());
  };

  // Pricing Rules Management
  const updateDayAdjustment = (day: keyof PricingRules['dayOfWeek'], value: number) => {
    setPricingRules(prev => ({
      ...prev,
      dayOfWeek: {
        ...prev.dayOfWeek,
        [day]: value
      }
    }));
  };

  const updateSeasonAdjustment = (season: keyof PricingRules['season'], value: number) => {
    setPricingRules(prev => ({
      ...prev,
      season: {
        ...prev.season,
        [season]: value
      }
    }));
  };

  const resetPricingRules = () => {
    setPricingRules(INITIAL_PRICING_RULES);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        adminTab,
        setAdminTab,
        suppliers,
        availabilityMap,
        pricingRules,
        searchCriteria,
        optimizationResult,
        isCalculating,
        loadingProgress,
        loadingStepText,
        searchHistory,
        updateCriteria,
        runDemoSearch,
        executeSearch,
        recalculateResults,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
