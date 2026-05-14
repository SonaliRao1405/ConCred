import { Suspense, lazy, useEffect } from 'react'
import { AppProvider } from './providers/AppProvider'
import { usePlatform } from './hooks/usePlatform'
import { LoadingScreen } from './components/shared/Primitives'
import { LocalizationProvider, useI18n } from './localization'
import './App.css'

const AuthScreen = lazy(() => import('./components/auth/AuthScreen').then((module) => ({ default: module.AuthScreen })))
const GuardianApp = lazy(() => import('./components/guardian/GuardianApp').then((module) => ({ default: module.GuardianApp })))
const NgoDashboard = lazy(() => import('./components/ngo/NgoDashboard').then((module) => ({ default: module.NgoDashboard })))

function PlatformRouter() {
  const { actions, booting, busyKey, error, isOnline, platform } = usePlatform()
  const { normalizeLocaleCode, setLanguage } = useI18n()

  useEffect(() => {
    if (!platform?.sessionUser?.language) {
      return
    }

    setLanguage(normalizeLocaleCode(platform.sessionUser.language))
  }, [normalizeLocaleCode, platform?.sessionUser?.language, setLanguage])

  if (booting || !platform) {
    return <LoadingScreen />
  }

  if (!platform.sessionUser) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthScreen actions={actions} busyKey={busyKey} error={error} />
      </Suspense>
    )
  }

  if (platform.sessionUser.role === 'ngo_admin') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <NgoDashboard platform={platform} actions={actions} isOnline={isOnline} busyKey={busyKey} />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <GuardianApp platform={platform} actions={actions} isOnline={isOnline} busyKey={busyKey} />
    </Suspense>
  )
}

export default function App() {
  return (
    <LocalizationProvider>
      <AppProvider>
        <PlatformRouter />
      </AppProvider>
    </LocalizationProvider>
  )
}
