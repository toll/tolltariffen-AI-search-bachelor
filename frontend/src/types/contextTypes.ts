import { Dispatch, SetStateAction } from 'react'

export type ThemeContextType = {
  themeColor: string
  setThemeColor: Dispatch<SetStateAction<string>>
}
