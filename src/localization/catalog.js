export const LANGUAGE_OPTIONS = [
  { code: 'en', englishName: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'kn', englishName: 'Kannada', nativeName: 'ಕನ್ನಡ', dir: 'ltr' },
  { code: 'ml', englishName: 'Malayalam', nativeName: 'മലയാളം', dir: 'ltr' },
  { code: 'ta', englishName: 'Tamil', nativeName: 'தமிழ்', dir: 'ltr' },
  { code: 'te', englishName: 'Telugu', nativeName: 'తెలుగు', dir: 'ltr' },
  { code: 'mr', englishName: 'Marathi', nativeName: 'मराठी', dir: 'ltr' },
  { code: 'gu', englishName: 'Gujarati', nativeName: 'ગુજરાતી', dir: 'ltr' },
  { code: 'bn', englishName: 'Bengali', nativeName: 'বাংলা', dir: 'ltr' },
  { code: 'or', englishName: 'Odia', nativeName: 'ଓଡ଼ିଆ', dir: 'ltr' },
  { code: 'as', englishName: 'Assamese', nativeName: 'অসমীয়া', dir: 'ltr' },
  { code: 'pa', englishName: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', dir: 'ltr' },
  { code: 'ur', englishName: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
]

const LOCALE_ALIAS_MAP = {
  english: 'en',
  en: 'en',
  'en-in': 'en',
  hindi: 'hi',
  hi: 'hi',
  'hi-in': 'hi',
  हिन्दी: 'hi',
  kannada: 'kn',
  kn: 'kn',
  'kn-in': 'kn',
  ಕನ್ನಡ: 'kn',
  malayalam: 'ml',
  ml: 'ml',
  'ml-in': 'ml',
  മലയാളം: 'ml',
  tamil: 'ta',
  ta: 'ta',
  'ta-in': 'ta',
  தமிழ்: 'ta',
  telugu: 'te',
  te: 'te',
  'te-in': 'te',
  తెలుగు: 'te',
  marathi: 'mr',
  mr: 'mr',
  'mr-in': 'mr',
  मराठी: 'mr',
  gujarati: 'gu',
  gu: 'gu',
  'gu-in': 'gu',
  ગુજરાતી: 'gu',
  bengali: 'bn',
  bangla: 'bn',
  bn: 'bn',
  'bn-in': 'bn',
  বাংলা: 'bn',
  odia: 'or',
  oriya: 'or',
  or: 'or',
  'or-in': 'or',
  ଓଡ଼ିଆ: 'or',
  assamese: 'as',
  as: 'as',
  'as-in': 'as',
  অসমীয়া: 'as',
  punjabi: 'pa',
  pa: 'pa',
  'pa-in': 'pa',
  ਪੰਜਾਬੀ: 'pa',
  urdu: 'ur',
  ur: 'ur',
  'ur-in': 'ur',
  اردو: 'ur',
}

export function normalizeLocaleCode(value) {
  if (!value) {
    return 'en'
  }

  const normalized = `${value}`.trim().toLowerCase()
  if (LOCALE_ALIAS_MAP[normalized]) {
    return LOCALE_ALIAS_MAP[normalized]
  }

  const stripped = normalized.split(/[-_]/)[0]
  return LOCALE_ALIAS_MAP[stripped] ?? 'en'
}

export function getLanguageMeta(value) {
  const code = normalizeLocaleCode(value)
  return LANGUAGE_OPTIONS.find((language) => language.code === code) ?? LANGUAGE_OPTIONS[0]
}
