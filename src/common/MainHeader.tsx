import { faCogs as cogsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavBar } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { Link, useLocation } from 'react-router';
import { DEFAULT_LANGUAGE } from '../i18n';
import { useTranslation } from '../i18n/useTranslation';
import { ServersDropdown } from '../servers/ServersDropdown';
import { useSettings } from '../settings/reducers/settings';
import { ShlinkLogo } from './img/ShlinkLogo';

const LanguageSwitcher: FC = () => {
  const { settings, setSettings } = useSettings();
  const current = settings.ui?.language ?? DEFAULT_LANGUAGE;

  return (
    <select
      aria-label="Language"
      className="bg-lm-secondary dark:bg-dm-active text-lm-text dark:text-dm-text text-sm border border-lm-border dark:border-dm-border rounded-md px-2 py-1.5 cursor-pointer [&>option]:text-lm-text dark:[&>option]:bg-dm-primary dark:[&>option]:text-dm-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lm-brand/70 dark:focus-visible:outline-dm-brand/70"
      value={current}
      onChange={(e) => setSettings({ ui: { ...settings.ui!, language: e.target.value as 'zh-CN' | 'en' } })}
    >
      <option value="zh-CN">简体中文</option>
      <option value="en">English</option>
    </select>
  );
};

export const MainHeader: FC = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const settingsPath = '/settings';

  return (
    <NavBar
      className="[&]:fixed top-0 z-900 [&]:min-h-(--header-height)"
      brand={
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="[&]:text-lm-brand dark:[&]:text-dm-brand no-underline flex items-center gap-2"
          >
            <ShlinkLogo className="w-8" color="currentColor" />
            <span className="font-semibold tracking-wide text-lm-text dark:text-dm-text">Quarks Click</span>
          </Link>
          <LanguageSwitcher />
        </div>
      }
    >
      <NavBar.MenuItem
        to={settingsPath}
        active={pathname.startsWith(settingsPath)}
        className="flex items-center gap-1.5"
      >
        <FontAwesomeIcon icon={cogsIcon} /> {t('Settings')}
      </NavBar.MenuItem>
      <ServersDropdown />
    </NavBar>
  );
};
