export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'xiaoju-survey-theme'

export const getThemeMode = (): ThemeMode => {
  const stored = localStorage.getItem(THEME_KEY)
  return stored === 'dark' ? 'dark' : 'light'
}

export const applyThemeMode = (mode: ThemeMode) => {
  document.documentElement.classList.toggle('dark', mode === 'dark')
  localStorage.setItem(THEME_KEY, mode)
}

export const toggleThemeMode = (): ThemeMode => {
  const next: ThemeMode = getThemeMode() === 'dark' ? 'light' : 'dark'
  applyThemeMode(next)
  return next
}
