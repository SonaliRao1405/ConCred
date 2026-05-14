import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import enMessages from '../../locales/en.json'
import { getLanguageMeta, LANGUAGE_OPTIONS, normalizeLocaleCode } from './catalog'

const LOCALE_STORAGE_KEY = 'conservationcred.locale'
const localeLoaders = import.meta.glob('../../locales/*.json')

const localeCache = {
  en: enMessages,
}

function readStoredLocale() {
  try {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (storedLocale) {
      return normalizeLocaleCode(storedLocale)
    }
  } catch {
    return 'en'
  }

  return normalizeLocaleCode(window.navigator.language || 'en')
}

function writeStoredLocale(localeCode) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, localeCode)
  } catch {
    return
  }
}

async function loadLocaleMessages(localeCode) {
  const normalized = normalizeLocaleCode(localeCode)

  if (localeCache[normalized]) {
    return localeCache[normalized]
  }

  const loader = localeLoaders[`../../locales/${normalized}.json`]
  if (!loader) {
    localeCache[normalized] = enMessages
    return enMessages
  }

  const module = await loader()
  localeCache[normalized] = module.default ?? module
  return localeCache[normalized]
}

function getNestedValue(source, path) {
  return path.split('.').reduce((current, segment) => current?.[segment], source)
}

function interpolate(template, params = {}) {
  if (typeof template !== 'string') {
    return template
  }

  return template.replace(/\{\{\s*(.+?)\s*\}\}/g, (_, key) => {
    const value = params[key]
    return value === undefined || value === null ? '' : `${value}`
  })
}

const LocalizationContext = createContext(null)

export function LocalizationProvider({ children }) {
  const [language, setLanguageState] = useState(() => readStoredLocale())
  const [messages, setMessages] = useState(enMessages)
  const [loadedLanguage, setLoadedLanguage] = useState('en')

  useEffect(() => {
    let cancelled = false
    const normalized = normalizeLocaleCode(language)

    const applyMessages = async () => {
      const nextMessages = await loadLocaleMessages(normalized)
      if (cancelled) {
        return
      }

      startTransition(() => {
        setMessages(nextMessages)
        setLoadedLanguage(normalized)
      })
    }

    writeStoredLocale(normalized)
    void applyMessages()

    return () => {
      cancelled = true
    }
  }, [language])

  useEffect(() => {
    const meta = getLanguageMeta(language)
    document.documentElement.lang = meta.code
    document.documentElement.dir = meta.dir
    document.body.dataset.locale = meta.code
  }, [language])

  const setLanguage = useCallback((nextLocale) => {
    const normalized = normalizeLocaleCode(nextLocale)
    setLanguageState((current) => (current === normalized ? current : normalized))
    writeStoredLocale(normalized)
  }, [])

  const getMessage = useCallback(
    (path, fallbackValue = path) => {
      const primaryValue = getNestedValue(messages, path)
      if (primaryValue !== undefined) {
        return primaryValue
      }

      const englishValue = getNestedValue(enMessages, path)
      return englishValue !== undefined ? englishValue : fallbackValue
    },
    [messages],
  )

  const t = useCallback(
    (path, params = {}, fallbackValue = path) => {
      const value = getMessage(path, fallbackValue)
      if (typeof value !== 'string') {
        return value
      }

      return interpolate(value, params)
    },
    [getMessage],
  )

  const value = useMemo(() => {
    const activeLanguage = getLanguageMeta(language)
    return {
      direction: activeLanguage.dir,
      getLanguageMeta,
      getMessage,
      isLocaleReady: loadedLanguage === normalizeLocaleCode(language),
      isRtl: activeLanguage.dir === 'rtl',
      language: activeLanguage.code,
      languages: LANGUAGE_OPTIONS,
      normalizeLocaleCode,
      setLanguage,
      t,
    }
  }, [getMessage, language, loadedLanguage, setLanguage, t])

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>
}

export function useI18n() {
  const context = useContext(LocalizationContext)

  if (!context) {
    throw new Error('useI18n must be used inside LocalizationProvider.')
  }

  return context
}
