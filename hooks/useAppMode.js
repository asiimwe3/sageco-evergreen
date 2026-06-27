import { useState, useEffect } from 'react'
import { detectAppModeClient } from '../lib/appMode'

const SESSION_KEY = 'sageco_app_mode'

export function useAppMode() {
  const [appMode, setAppMode] = useState(false)

  useEffect(() => {
    const detected = detectAppModeClient()
    if (detected) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAppMode(true)
      return
    }
    const persisted = sessionStorage.getItem(SESSION_KEY) === '1'
    setAppMode(persisted)
  }, [])

  return appMode
}
