import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card } from '@shlinkio/shlink-frontend-kit';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from '../i18n/useTranslation';
import { withoutSelectedServer } from '../servers/helpers/withoutSelectedServer';
import { useServers } from '../servers/reducers/servers';
import { ServersListGroup } from '../servers/ServersListGroup';
import { ShlinkLogo } from './img/ShlinkLogo';

export const Home: FC = withoutSelectedServer(() => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { servers } = useServers();
  const serversList = useMemo(() => Object.values(servers), [servers]);
  const hasNavigated = useRef(false);
  const hasServers = serversList.length > 0;

  useEffect(() => {
    // A single configured server is the normal self-hosted setup, so take the user directly to
    // its dashboard. Keep the selector for installations that manage multiple servers.
    const serverToOpen = serversList.length === 1
      ? serversList[0]
      : serversList.find(({ autoConnect }) => autoConnect);
    const targetPath = serverToOpen ? `/server/${serverToOpen.id}` : undefined;
    if (targetPath && pathname !== targetPath && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate(targetPath);
    }
  }, [serversList, navigate, pathname]);

  return (
    <div className="px-3 w-full">
      <Card className="mx-auto max-w-[900px] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="p-10 hidden md:flex items-center w-[38%] bg-lm-active dark:bg-dm-active text-lm-brand dark:text-dm-brand">
            <div className="w-full">
              <ShlinkLogo color="currentColor" />
            </div>
          </div>

          <div className="md:border-l border-lm-border dark:border-dm-border flex-grow">
            <h1 className={clsx('p-6 text-left border-lm-border dark:border-dm-border', { 'border-b': !hasServers })}>
              {hasServers ? t('Please, select a server.') : t('Welcome!')}
            </h1>
            {hasServers ? (
              <ServersListGroup servers={serversList} />
            ) : (
              <div className="p-8 text-left flex flex-col gap-8 text-lg">
                <p>{t('This application will help you manage your Shlink servers.')}</p>
                <p>
                  <Button to="/server/create" size="lg" inline>
                    <FontAwesomeIcon icon={faPlus} widthAuto /> {t('Add a server')}
                  </Button>
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
});
