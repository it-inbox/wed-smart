import { Supplier, PricingRules } from '../types/wedding';

export const INITIAL_SUPPLIERS: Supplier[] = [
  // --- VENUES (5) ---
  {
    id: 'venue-1',
    name: 'Het Witte Kasteel',
    category: 'venue',
    location: 'Amsterdam',
    capacity: 200,
    minPrice: 8000,
    maxPrice: 14000,
    rating: 4.9,
    reviewCount: 128,
    tagline: 'Historic estate with romantic landscaped gardens & grand ballroom',
    includedFeatures: ['Bridal suite', 'Garden pavilion', 'Sound limit 102dB', 'Valet parking']
  },
  {
    id: 'venue-2',
    name: 'Landgoed De Hooge Vuursche',
    category: 'venue',
    location: 'Utrecht',
    capacity: 150,
    minPrice: 6000,
    maxPrice: 10000,
    rating: 4.8,
    reviewCount: 94,
    tagline: 'Neo-renaissance castle nestled in the Baarn woods',
    includedFeatures: ['Forest terrace', 'Fireplace lounge', 'Late license', '19 hotel rooms']
  },
  {
    id: 'venue-3',
    name: 'Kasteel Keukenhof',
    category: 'venue',
    location: 'Lisse',
    capacity: 180,
    minPrice: 7500,
    maxPrice: 12000,
    rating: 4.9,
    reviewCount: 112,
    tagline: 'Fairytale castle surrounded by 200 hectares of tulip parkland',
    includedFeatures: ['Coach house ballroom', 'Courtyard reception', 'Historic salon']
  },
  {
    id: 'venue-4',
    name: 'De Vertrekhal',
    category: 'venue',
    location: 'Rotterdam',
    capacity: 250,
    minPrice: 5000,
    maxPrice: 9000,
    rating: 4.7,
    reviewCount: 78,
    tagline: 'Industrial waterfront hall with skyline views of the Maas',
    includedFeatures: ['Harbor terrace', 'Acoustically tuned hall', 'Private boat dock']
  },
  {
    id: 'venue-5',
    name: 'Villa Augustus',
    category: 'venue',
    location: 'Dordrecht',
    capacity: 120,
    minPrice: 4500,
    maxPrice: 8000,
    rating: 4.8,
    reviewCount: 86,
    tagline: 'Former water tower surrounded by organic orchards and market gardens',
    includedFeatures: ['Victorian greenhouse', 'Secret gardens', 'Artisan bakery on site']
  },

  // --- CATERING (5) ---
  {
    id: 'catering-1',
    name: 'LOOF Catering',
    category: 'catering',
    location: 'Amsterdam',
    capacity: 300,
    minPrice: 4500,
    maxPrice: 8000,
    rating: 4.9,
    reviewCount: 142,
    tagline: 'Seasonal Dutch culinary artistry, organic sourcing & bespoke wine pairings',
    includedFeatures: ['4-course seated dinner', 'Late night snack bar', 'Full tableware & linen']
  },
  {
    id: 'catering-2',
    name: 'Exquisite Catering',
    category: 'catering',
    location: 'The Hague',
    capacity: 200,
    minPrice: 5000,
    maxPrice: 9000,
    rating: 4.8,
    reviewCount: 89,
    tagline: 'French-Mediterranean fine dining with Michelin-trained private chefs',
    includedFeatures: ['Oyster bar', 'Champagne tower', 'Custom wedding cake pastry']
  },
  {
    id: 'catering-3',
    name: 'De Keuken van Gastmaal',
    category: 'catering',
    location: 'Utrecht',
    capacity: 150,
    minPrice: 3500,
    maxPrice: 6500,
    rating: 4.8,
    reviewCount: 67,
    tagline: 'Generous family-style shared platters with artisanal local cheese',
    includedFeatures: ['Wood-fire grill station', 'Biodynamic wines', 'Vegetarian feast options']
  },
  {
    id: 'catering-4',
    name: 'Vers Catering',
    category: 'catering',
    location: 'Rotterdam',
    capacity: 250,
    minPrice: 3000,
    maxPrice: 5500,
    rating: 4.6,
    reviewCount: 95,
    tagline: 'Modern street food stations and contemporary Dutch comfort banquets',
    includedFeatures: ['Live cooking stations', 'Cocktail bar team', 'Late-night bitterballen']
  },
  {
    id: 'catering-5',
    name: 'Amuse Culinair',
    category: 'catering',
    location: 'Haarlem',
    capacity: 180,
    minPrice: 4000,
    maxPrice: 7000,
    rating: 4.7,
    reviewCount: 81,
    tagline: 'Intimate tasting experiences with botanical infusions & edible flowers',
    includedFeatures: ['Canapé reception', 'Sommelier service', 'Custom dessert wall']
  },

  // --- DJ / BAND (5) ---
  {
    id: 'dj-1',
    name: 'DJ Valentino',
    category: 'dj',
    location: 'Amsterdam',
    capacity: 500,
    minPrice: 1200,
    maxPrice: 2500,
    rating: 4.9,
    reviewCount: 160,
    tagline: 'Versatile open-format wedding DJ with live saxophone accompaniment',
    includedFeatures: ['Pioneer DJ console', 'Wireless mics for speeches', 'Moving light rig', 'Saxophone set']
  },
  {
    id: 'dj-2',
    name: 'The Wedding Collective',
    category: 'dj',
    location: 'Utrecht',
    capacity: 300,
    minPrice: 2000,
    maxPrice: 4000,
    rating: 4.9,
    reviewCount: 110,
    tagline: 'High-energy 6-piece live funk, soul & pop wedding band',
    includedFeatures: ['6 musicians', '2 vocalists', 'Sound engineer', 'DJ during breaks']
  },
  {
    id: 'dj-3',
    name: 'Beats & Beyond',
    category: 'dj',
    location: 'Rotterdam',
    capacity: 400,
    minPrice: 1500,
    maxPrice: 3000,
    rating: 4.7,
    reviewCount: 74,
    tagline: 'Club-grade audio experience tailored for modern celebration vibes',
    includedFeatures: ['Subwoofers & arrays', 'Atmospheric haze & uplighting', 'Custom playlist curation']
  },
  {
    id: 'dj-4',
    name: 'Luna Strings Quartet',
    category: 'dj',
    location: 'The Hague',
    capacity: 200,
    minPrice: 1800,
    maxPrice: 3500,
    rating: 4.8,
    reviewCount: 65,
    tagline: 'Classical acoustic quartet playing contemporary pop and cinematic anthems',
    includedFeatures: ['Ceremony acoustic set', 'Cocktail hour jazz', 'Sound amplification']
  },
  {
    id: 'dj-5',
    name: 'DJ Marlowe',
    category: 'dj',
    location: 'Eindhoven',
    capacity: 350,
    minPrice: 1000,
    maxPrice: 2000,
    rating: 4.6,
    reviewCount: 58,
    tagline: 'Chill sunset grooves transitioning into floor-filling indie dance classics',
    includedFeatures: ['Retro vinyl setup', 'Compact lighting truss', 'Pre-wedding music consultation']
  },

  // --- PHOTOGRAPHERS (5) ---
  {
    id: 'photo-1',
    name: 'Studio Lenssen',
    category: 'photographer',
    location: 'Amsterdam',
    capacity: 999,
    minPrice: 1800,
    maxPrice: 3500,
    rating: 5.0,
    reviewCount: 135,
    tagline: 'Candid documentary storytelling with warm, timeless film emulation',
    includedFeatures: ['10 hours coverage', 'Second shooter included', '500+ edited high-res photos', 'Web gallery']
  },
  {
    id: 'photo-2',
    name: 'Bruidsfoto De Vries',
    category: 'photographer',
    location: 'Utrecht',
    capacity: 999,
    minPrice: 1200,
    maxPrice: 2500,
    rating: 4.8,
    reviewCount: 92,
    tagline: 'Natural light photography capturing authentic emotion and laughter',
    includedFeatures: ['8 hours coverage', 'Handmade linen photo album', 'Engagement mini-shoot']
  },
  {
    id: 'photo-3',
    name: 'Moments by Sophie',
    category: 'photographer',
    location: 'Rotterdam',
    capacity: 999,
    minPrice: 1500,
    maxPrice: 3000,
    rating: 4.8,
    reviewCount: 88,
    tagline: 'Editorial fine-art aesthetics with an eye for fashion details',
    includedFeatures: ['Drone aerial coverage', 'Sneak peek in 48 hours', 'Highlight video clip']
  },
  {
    id: 'photo-4',
    name: 'Lichtbeeld Fotografie',
    category: 'photographer',
    location: 'The Hague',
    capacity: 999,
    minPrice: 2000,
    maxPrice: 4000,
    rating: 4.9,
    reviewCount: 79,
    tagline: 'Master wedding photographer with internationally recognized portrait portfolio',
    includedFeatures: ['Full-day unrestricted coverage', 'Master-print archival box', 'Pre-wedding portraits']
  },
  {
    id: 'photo-5',
    name: 'Klik Bruidsfotografie',
    category: 'photographer',
    location: 'Leiden',
    capacity: 999,
    minPrice: 1000,
    maxPrice: 2200,
    rating: 4.7,
    reviewCount: 64,
    tagline: 'Unobtrusive photojournalistic coverage with friendly guidance',
    includedFeatures: ['6 hours coverage', 'Full digital rights', 'Online guest print shop']
  }
];

export const INITIAL_PRICING_RULES: PricingRules = {
  dayOfWeek: {
    monday: -0.25,
    tuesday: -0.25,
    wednesday: -0.20,
    thursday: -0.20,
    friday: -0.10,
    saturday: 0.00,
    sunday: -0.15
  },
  season: {
    low: -0.20,
    normal: -0.05,
    high: 0.10
  }
};

/**
 * Generates initial realistic availability map for August 2027 (31 days).
 * Format: { [supplierId]: { '2027-08-01': true, ... } }
 */
export function generateInitialAvailability(): Record<string, Record<string, boolean>> {
  const availability: Record<string, Record<string, boolean>> = {};

  // All 31 dates in August 2027
  const dates = Array.from({ length: 31 }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    return `2027-08-${day}`;
  });

  // Base patterns for each supplier ID
  // Make sure Het Witte Kasteel, LOOF Catering, DJ Valentino, Studio Lenssen have:
  // - 15 August 2027 (Day 15) AVAILABLE
  // - 22 August 2027 (Day 22) AVAILABLE
  // - 5, 6, 8, 12, 19, 26, 29 Aug AVAILABLE
  // - Saturdays like 7 Aug, 14 Aug, 21 Aug partly or fully booked for realism

  const demoComboSupplierIds = ['venue-1', 'catering-1', 'dj-1', 'photo-1'];

  // Specific booked dates for demo combo to produce realistic Netherlands wedding season
  const bookedDatesBySupplier: Record<string, number[]> = {
    'venue-1': [1, 7, 14, 21, 28, 30],       // Het Witte Kasteel (Saturdays 7, 14, 21, 28 booked)
    'catering-1': [2, 7, 13, 21, 27, 31],    // LOOF Catering
    'dj-1': [3, 7, 10, 14, 21, 24],          // DJ Valentino
    'photo-1': [4, 7, 11, 21, 25, 28],       // Studio Lenssen

    // Other venues
    'venue-2': [6, 7, 13, 14, 15, 20, 21, 27],
    'venue-3': [1, 2, 8, 14, 15, 22, 28],
    'venue-4': [5, 6, 12, 19, 20, 26],
    'venue-5': [7, 8, 14, 15, 21, 22, 28, 29],

    // Other caterers
    'catering-2': [1, 6, 8, 15, 22, 29],
    'catering-3': [4, 7, 11, 14, 18, 21, 25, 28],
    'catering-4': [2, 9, 16, 23, 30],
    'catering-5': [3, 10, 14, 17, 21, 24, 31],

    // Other DJs
    'dj-2': [5, 7, 12, 14, 19, 21, 26, 28],
    'dj-3': [1, 8, 15, 22, 29],
    'dj-4': [6, 13, 20, 27],
    'dj-5': [2, 7, 9, 14, 16, 21, 23, 28],

    // Other photographers
    'photo-2': [3, 7, 10, 14, 17, 21, 24, 28],
    'photo-3': [1, 6, 8, 13, 15, 20, 22, 27, 29],
    'photo-4': [7, 14, 21, 28],
    'photo-5': [2, 5, 9, 12, 16, 19, 23, 26, 30]
  };

  INITIAL_SUPPLIERS.forEach(supplier => {
    availability[supplier.id] = {};
    const bookedDays = bookedDatesBySupplier[supplier.id] || [7, 14, 21];

    dates.forEach((dateStr, idx) => {
      const dayNum = idx + 1;
      const isBooked = bookedDays.includes(dayNum);
      availability[supplier.id][dateStr] = !isBooked;
    });

    // Enforce day 15 and 22 available for the 4 demo suppliers
    if (demoComboSupplierIds.includes(supplier.id)) {
      availability[supplier.id]['2027-08-15'] = true;
      availability[supplier.id]['2027-08-22'] = true;
      // Day 5, 6, 8, 12, 19, 26, 29 also available
      availability[supplier.id]['2027-08-05'] = true;
      availability[supplier.id]['2027-08-08'] = true;
      availability[supplier.id]['2027-08-12'] = true;
      availability[supplier.id]['2027-08-19'] = true;
      availability[supplier.id]['2027-08-26'] = true;
      availability[supplier.id]['2027-08-29'] = true;
    }
  });

  return availability;
}
