import { useCallback, useSyncExternalStore } from 'react';
import { i18n } from './index';

const subscribe = (callback: () => void) => {
  i18n.on('languageChanged', callback);
  return () => i18n.off('languageChanged', callback);
};

const getLanguage = () => i18n.language;

/** Translation hook bound to this app's own i18next instance. Re-renders on language change. */
export const useTranslation = () => {
  const language = useSyncExternalStore(subscribe, getLanguage);
  const t = useCallback(
    (key: string, options?: Record<string, unknown>) => i18n.getFixedT(language)(key, options),
    [language],
  );
  return { t, i18n, language };
};
