import { ShlinkWebSettings } from '@shlinkio/shlink-web-component/settings';
import type { FC } from 'react';
import { NoMenuLayout } from '../common/NoMenuLayout';
import { DEFAULT_SHORT_URLS_ORDERING, useSettings } from './reducers/settings';
import { Link, useLocation } from 'react-router';
import { ApiKeysPage } from '../apiKeys/ApiKeysPage';
import { useTranslation } from '../i18n/useTranslation';

export const Settings: FC = () => {
  const { settings, setSettings } = useSettings();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  if (pathname === '/settings/api-keys') return <ApiKeysPage />;

  return (
    <NoMenuLayout>
      <div className="mb-5 flex justify-end"><Link to="/settings/api-keys" className="rounded-md border border-black/10 px-3 py-2 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">{t('API keys')}</Link></div>
      <ShlinkWebSettings
        settings={settings}
        onUpdateSettings={setSettings}
        defaultShortUrlsListOrdering={DEFAULT_SHORT_URLS_ORDERING}
      />
    </NoMenuLayout>
  );
};
