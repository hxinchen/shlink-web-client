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
      className="bg-white/10 text-white text-sm border border-white/20 rounded-md px-2 py-1.5 cursor-pointer [&>option]:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
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
          <Link to="/" className="[&]:text-white no-underline flex items-center gap-2">
            <ShlinkLogo className="w-8" color="white" />
            <span className="font-semibold tracking-wide">Quarks Click</span>
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
