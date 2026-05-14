import { createContext, useEffect, useState } from 'react'
import {
  bootstrapPlatform,
  completeModuleQuiz,
  createActivity,
  deleteAccount,
  moveToSavings,
  reviewActivity,
  saveModuleProgress,
  signIn,
  signOut,
  signUp,
  syncQueuedItems,
  updateUserLanguage,
  updateSavingsGoal,
} from '../repositories/platformRepository'

export const AppPlatformContext = createContext(null)

export function AppProvider({ children }) {
  const [platform, setPlatform] = useState(null)
  const [booting, setBooting] = useState(true)
  const [busyKey, setBusyKey] = useState('')
  const [error, setError] = useState('')
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)

  useEffect(() => {
    bootstrapPlatform()
      .then(setPlatform)
      .finally(() => setBooting(false))
  }, [])

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true)
      const nextPlatform = await syncQueuedItems(true)
      setPlatform(nextPlatform)
    }

    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  async function runTask(taskKey, operation) {
    try {
      setBusyKey(taskKey)
      setError('')
      const nextPlatform = await operation()
      setPlatform(nextPlatform)
      return nextPlatform
    } catch (taskError) {
      setError(taskError.message || 'Something went wrong while processing your request.')
      throw taskError
    } finally {
      setBusyKey('')
    }
  }

  const value = {
    booting,
    busyKey,
    error,
    isOnline,
    platform,
    actions: {
      login: (payload) => runTask('login', () => signIn(payload)),
      logout: () => runTask('logout', () => signOut()),
      deleteAccount: () => runTask('delete-account', () => deleteAccount(platform.sessionUser.id)),
      signup: (payload) => runTask('signup', () => signUp(payload)),
      createActivity: (payload) =>
        runTask('create-activity', () => createActivity(platform.sessionUser.id, payload, { isOnline })),
      syncNow: () => runTask('sync', () => syncQueuedItems(isOnline)),
      reviewActivity: (activityId, decision, note) =>
        runTask('review', () => reviewActivity(activityId, decision, platform.sessionUser.id, note)),
      moveToSavings: (amount) => runTask('savings', () => moveToSavings(platform.sessionUser.id, amount)),
      updateSavingsGoal: (changes) =>
        runTask('goal', () => updateSavingsGoal(platform.sessionUser.id, changes)),
      updateLanguage: (language) =>
        runTask('language', () => updateUserLanguage(platform.sessionUser.id, language)),
      saveModuleProgress: (moduleId, changes) =>
        runTask('module-progress', () => saveModuleProgress(platform.sessionUser.id, moduleId, changes)),
      completeModuleQuiz: (moduleId, score) =>
        runTask('module-complete', () => completeModuleQuiz(platform.sessionUser.id, moduleId, score)),
      clearError: () => setError(''),
    },
  }

  return <AppPlatformContext.Provider value={value}>{children}</AppPlatformContext.Provider>
}
