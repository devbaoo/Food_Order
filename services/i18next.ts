import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../assets/gb/en.json'
import vi from '../assets/gb/vi.json'

export const languageResources = {
  vi: { translation: vi },
  en: { translation: en }
}

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: 'vi',
  fallbackLng: 'vi',
  resources: languageResources,
})

export default i18next
