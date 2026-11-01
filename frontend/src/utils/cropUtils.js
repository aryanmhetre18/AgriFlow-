// ── Crop Category & Detailed Crop Logo Mapping Utility ─────────────────────────

export const CROP_CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Flowers',
  'Grains & Cereals',
  'Pulses & Legumes',
  'Spices & Herbs',
  'Oilseeds',
  'Other',
]

export const FORM_CROP_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Flowers',
  'Grains & Cereals',
  'Pulses & Legumes',
  'Spices & Herbs',
  'Oilseeds',
  'Other',
]

export const CATEGORY_EMOJI_MAP = {
  'Vegetables':       '🥦',
  'Fruits':           '🍎',
  'Flowers':          '🌸',
  'Grains & Cereals': '🌾',
  'Pulses & Legumes': '🫘',
  'Spices & Herbs':   '🌿',
  'Oilseeds':         '🌻',
  'Other':            '🌱',
}

// Crop specific names mapping
const EXACT_CROP_EMOJIS = {
  // Vegetables
  'tomato': '🍅',
  'onion': '🧅',
  'potato': '🥔',
  'garlic': '🧄',
  'ginger': '🫚',
  'chilli': '🌶️',
  'chili': '🌶️',
  'green chilli': '🌶️',
  'red chilli': '🌶️',
  'brinjal': '🍆',
  'eggplant': '🍆',
  'carrot': '🥕',
  'cabbage': '🥬',
  'cauliflower': '🥦',
  'broccoli': '🥦',
  'cucumber': '🥒',
  'corn': '🌽',
  'sweet corn': '🌽',
  'maize': '🌽',
  'pea': '🫛',
  'peas': '🫛',
  'green peas': '🫛',
  'capsicum': '🫑',
  'bell pepper': '🫑',
  'beetroot': '🟣',
  'spinach': '🥬',
  'palak': '🥬',
  'plak': '🥬',
  'methi': '🌿',
  'fenugreek': '🌿',
  'coriander': '🌿',
  'kothmir': '🌿',
  'mint': '🌿',
  'pudina': '🌿',
  'okra': '🌱',
  'ladyfinger': '🌱',
  'bhindi': '🌱',
  'pumpkin': '🎃',
  'bottle gourd': '🥒',
  'bitter gourd': '🥒',

  // Fruits
  'mango': '🥭',
  'alphonso': '🥭',
  'banana': '🍌',
  'apple': '🍎',
  'grapes': '🍇',
  'grape': '🍇',
  'orange': '🍊',
  'citrus': '🍊',
  'lemon': '🍋',
  'lime': '🍋',
  'watermelon': '🍉',
  'melon': '🍈',
  'papaya': '🍈',
  'strawberry': '🍓',
  'berries': '🫐',
  'pomegranate': '🍎',
  'guava': '🍐',
  'pear': '🍐',
  'pineapple': '🍍',
  'coconut': '🥥',
  'custard apple': '🍈',
  'sitaphal': '🍈',
  'fig': '🫐',
  'chikoo': '🥔',
  'kiwi': '🥝',

  // Flowers
  'rose': '🌹',
  'marigold': '🌼',
  'genda': '🌼',
  'jasmine': '🌸',
  'mogra': '🌸',
  'lotus': '🪷',
  'sunflower': '🌻',
  'hibiscus': '🌺',
  'tulip': '🌷',
  'carnation': '🌸',
  'orchid': '💐',
  'chrysanthemum': '🌼',
  'shevanti': '🌼',
  'tuberose': '🪻',
  'rajnigandha': '🪻',
  'flower': '🌸',
  'flowers': '💐',

  // Grains & Cereals
  'wheat': '🌾',
  'rice': '🍚',
  'paddy': '🌾',
  'basmati': '🍚',
  'barley': '🌾',
  'millet': '🌾',
  'jowar': '🌾',
  'sorghum': '🌾',
  'bajra': '🌾',
  'ragi': '🌾',
  'oats': '🥣',

  // Pulses & Legumes
  'dal': '🫘',
  'chana': '🫘',
  'gram': '🫘',
  'chickpea': '🫘',
  'toor': '🫘',
  'moong': '🫘',
  'urad': '🫘',
  'lentil': '🫘',
  'rajma': '🫘',

  // Spices & Cash Crops
  'turmeric': '🌿',
  'haldi': '🌿',
  'cotton': '☁️',
  'sugarcane': '🎋',
  'soybean': '🌱',
  'mustard': '🌼',
  'groundnut': '🥜',
  'peanut': '🥜',
  'cardamom': '🌿',
  'clove': '🌿',
  'cinnamon': '🪵',
  'black pepper': '⚫',
  'cumin': '🌿',
  'coriander': '🌿',
  'coffee': '☕',
  'tea': '🍵',
}

/**
 * Returns the specific emoji representing the crop name or category.
 */
export function getCropEmoji(name = '', category = '') {
  const cleanName = (name || '').toLowerCase().trim()
  
  // 1. Direct exact or substring match in dictionary
  for (const [key, emoji] of Object.entries(EXACT_CROP_EMOJIS)) {
    if (cleanName === key || cleanName.includes(key) || key.includes(cleanName)) {
      return emoji
    }
  }

  // 2. Check if category is Flowers
  if (category === 'Flowers' || cleanName.includes('flower') || cleanName.includes('rose') || cleanName.includes('marigold')) {
    return '🌸'
  }

  // 3. Fallback to category emoji map
  if (category && CATEGORY_EMOJI_MAP[category]) {
    return CATEGORY_EMOJI_MAP[category]
  }

  return '🌱'
}

/**
 * Returns dynamic color themes for crop cards and badges based on type
 */
export function getCropTheme(name = '', category = '') {
  const clean = (name || '').toLowerCase()
  const cat = (category || '').toLowerCase()

  if (clean.includes('tomato') || clean.includes('chilli') || clean.includes('apple') || clean.includes('rose') || clean.includes('strawberry')) {
    return {
      bg: 'bg-rose-500/15',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.18)]',
      badge: 'bg-rose-950/60 text-rose-300 border-rose-800/40',
    }
  }
  if (clean.includes('onion') || clean.includes('brinjal') || clean.includes('grapes') || clean.includes('orchid')) {
    return {
      bg: 'bg-purple-500/15',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.18)]',
      badge: 'bg-purple-950/60 text-purple-300 border-purple-800/40',
    }
  }
  if (clean.includes('mango') || clean.includes('marigold') || clean.includes('orange') || clean.includes('turmeric') || clean.includes('wheat') || clean.includes('sunflower')) {
    return {
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.18)]',
      badge: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
    }
  }
  if (cat.includes('flower') || clean.includes('jasmine') || clean.includes('lotus')) {
    return {
      bg: 'bg-pink-500/15',
      border: 'border-pink-500/30',
      text: 'text-pink-400',
      glow: 'shadow-[0_0_15px_rgba(236,72,153,0.18)]',
      badge: 'bg-pink-950/60 text-pink-300 border-pink-800/40',
    }
  }
  if (clean.includes('potato') || clean.includes('ginger') || clean.includes('peanut')) {
    return {
      bg: 'bg-amber-700/15',
      border: 'border-amber-600/30',
      text: 'text-amber-300',
      glow: 'shadow-[0_0_15px_rgba(180,83,9,0.18)]',
      badge: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
    }
  }

  // Default fresh green
  return {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.18)]',
    badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
  }
}
