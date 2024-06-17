import { createContext } from 'react'
import { ThemeContextType } from '../types/contextTypes'

export const ThemeContext = createContext<ThemeContextType>({
  themeColor: 'dark',
  setThemeColor: () => {},
})
