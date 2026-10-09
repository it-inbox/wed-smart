export type SupplierCategory = 'venue' | 'catering' | 'dj' | 'photographer';

export interface Supplier {
  id: string;
  name: string;
  category: SupplierCategory;
  location: string;
  capacity: number;
  minPrice: number;
  maxPrice: number;
  rating?: number;
  reviewCount?: number;
  tagline?: string;
  includedFeatures?: string[];
}

export interface DayOfWeekAdjustments {
  monday: number;     // e.g. -0.25
  tuesday: number;    // -0.25
  wednesday: number;  // -0.20
  thursday: number;   // -0.20
  friday: number;     // -0.10
  saturday: number;   // 0.00
  sunday: number;     // -0.15
}

export interface SeasonAdjustments {
  low: number;     // Nov, Dec, Jan, Feb (-0.20)
  normal: number;  // Mar, Apr, Oct (-0.05)
  high: number;    // May, Jun, Jul, Aug, Sep (+0.10)
}

export interface PricingRules {
  dayOfWeek: DayOfWeekAdjustments;
  season: SeasonAdjustments;
}

export interface SearchCriteria {
  guestCount: number;
  hasSpecificDate: boolean;
  preferredDate: string; // '2027-08-15'
  rangeStart: string;    // '2027-08-01'
  rangeEnd: string;      // '2027-08-31'
  budget: number;        // e.g. 18000
  selectedSupplierIds: Record<SupplierCategory, string | null>;
}

export interface SupplierDatePriceBreakdown {
  supplierId: string;
  supplierName: string;
  category: SupplierCategory;
  minPrice: number;
  maxPrice: number;
  dayAdjustment: number;
  seasonAdjustment: number;
  score: number;
  clampedScore: number;
  price: number;
  isAvailable: boolean;
}

export interface DateResult {
  dateString: string; // YYYY-MM-DD
  dayOfWeekName: string; // 'Monday', 'Friday', etc.
  dayOfWeekShort: string; // 'Mon', 'Fri'
  formattedDate: string; // '22 Aug 2027'
  dayNumber: number; // 22
  totalPrice: number;
  allSuppliersAvailable: boolean;
  isPreferredDate: boolean;
  isCheapest: boolean;
  isRecommended: boolean;
  isWithinBudget: boolean;
  savingsVsPreferred: number; // positive if cheaper than preferred date
  supplierBreakdowns: SupplierDatePriceBreakdown[];
  unavailableSupplierNames: string[];
}

export interface SearchOptimizationResult {
  criteria: SearchCriteria;
  preferredDateResult: DateResult | null;
  recommendedDateResult: DateResult | null;
  cheapestDateResult: DateResult | null;
  allEvaluatedDates: DateResult[];
  availableDates: DateResult[];
  bottleneckSupplier: { name: string; category: SupplierCategory; unavailableCount: number } | null;
  totalDatesEvaluated: number;
  datesWithinBudgetCount: number;
  averageSavings: number;
  maxSavings: number;
}

export interface SearchHistoryEntry {
  id: string;
  timestamp: string;
  guestCount: number;
  preferredDate: string;
  budget: number;
  selectedSuppliersSummary: string[];
  recommendedDate: string;
  recommendedPrice: number;
  savings: number;
  validDatesCount: number;
  totalDatesEvaluated: number;
  eliminatedDates: { date: string; reason: string }[];
}
