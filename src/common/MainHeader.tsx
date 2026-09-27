import { faMoon as moonIcon, faSun as sunIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavBar, SelectMenu } from '@shlinkio/shlink-frontend-kit';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { Link } from 'react-router';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../i18n';
import { ServersDropdown } from '../servers/ServersDropdown';
import { useSettings } from '../settings/reducers/settings';
import { ShlinkLogo } from './img/ShlinkLogo';

const LanguageSwitcher: FC = () => {
  const { settings, setSettings } = useSettings();
  const current = settings.ui?.language ?? DEFAULT_LANGUAGE;

  return (
    <SelectMenu
      aria-label="Language"
      size="sm"
      className="min-w-28"
      options={Object.entries(SUPPORTED_LANGUAGES).map(([value, label]) => ({ value, label }))}
      value={current}
      onChange={(language) => setSettings({ ui: { ...settings.ui!, language: language as 'zh-CN' | 'en' } })}
    />
  );
};

const ThemeSwitcher: FC = () => {
  const { settings, setSettings } = useSettings();
  const isDark = (settings.ui?.theme ?? 'light') === 'dark';

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={clsx(
        'flex items-center justify-center w-8 h-8 rounded-md cursor-pointer',
        'text-lm-text/70 dark:text-dm-text/70 highlight:text-lm-text dark:highlight:text-dm-text',
        'highlight:bg-lm-secondary dark:highlight:bg-dm-active transition-colors duration-[160ms]',
      )}
      onClick={() => setSettings({ ui: { ...settings.ui!, theme: isDark ? 'light' : 'dark' } })}
    >
      <FontAwesomeIcon icon={isDark ? sunIcon : moonIcon} fixedWidth />
    </button>
  );
};

export const MainHeader: FC = () => (
  <NavBar
    className="[&]:fixed top-0 z-900 [&]:min-h-(--header-height)"
    brand={
      <Link
        to="/"
        className="[&]:text-lm-brand dark:[&]:text-dm-brand no-underline flex items-center gap-2"
      >
        <ShlinkLogo className="w-8" color="currentColor" />
        <span className="font-semibold tracking-wide text-lm-text dark:text-dm-text">Quarks Click</span>
      </Link>
    }
  >
    <ServersDropdown />
    <li role="menuitem" className="flex items-center gap-2 px-2 py-3 max-md:px-3 max-md:py-2">
      <ThemeSwitcher />
      <LanguageSwitcher />
    </li>
  </NavBar>
);
