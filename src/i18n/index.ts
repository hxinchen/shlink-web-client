import { setLanguage as setKitLanguage, setNumberFormatLocale } from '@shlinkio/shlink-frontend-kit';
import { createInstance } from 'i18next';
import zhCN from './locales/zh-CN.json';

export type SupportedLanguage = 'zh-CN' | 'en';

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, string> = {
  'zh-CN': '简体中文',
  en: 'English',
};

export const DEFAULT_LANGUAGE: SupportedLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE === 'en' ? 'en' : 'zh-CN';

// Independent instance so that host applications using their own i18next are not affected.
// Keys are the original English copy. With `fallbackLng: false`, a missing key resolves to
// the key itself, which means untranslated strings gracefully fall back to English.
export const i18n = createInstance({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: false,
  // English copy contains `.` and `:` characters, so flat keys are required
  nsSeparator: false,
  keySeparator: false,
  returnEmptyString: false,
  interpolation: {
    // React already escapes rendered values
    escapeValue: false,
  },
  resources: {
    'zh-CN': {
      translation: zhCN,
    },
  },
});

i18n.init();

// Initialize the non-reactive helpers synchronously, so the very first render already uses the
// default language. Later changes go through `changeLanguage`, which re-renders via settings state.
setNumberFormatLocale(DEFAULT_LANGUAGE);
setKitLanguage(DEFAULT_LANGUAGE);

export const changeLanguage = (lang: SupportedLanguage) => {
  // The UI kit and number formatting live outside i18next, so they need to be told too
  setNumberFormatLocale(lang);
  setKitLanguage(lang);
  return i18n.changeLanguage(lang);
};
