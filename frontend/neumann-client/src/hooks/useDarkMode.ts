import { isDarkMode as isDarkModeFn } from '@/utils/darkMode'
import { useEffect, useState } from 'react'

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(isDarkModeFn())

  useEffect(() => {
    const updateSettingColor = () => setIsDarkMode(isDarkModeFn())
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateSettingColor)

    return () => window.removeEventListener('change', updateSettingColor)
  }, [])

  return isDarkMode
}
