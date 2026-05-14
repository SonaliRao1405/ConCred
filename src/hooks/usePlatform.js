import { useContext } from 'react'
import { AppPlatformContext } from '../providers/AppProvider'

export function usePlatform() {
  const context = useContext(AppPlatformContext)
  if (!context) {
    throw new Error('usePlatform must be used inside AppProvider.')
  }
  return context
}
