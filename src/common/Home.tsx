import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card } from '@shlinkio/shlink-frontend-kit';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from '../i18n/useTranslation';
import { withoutSelectedServer } from '../servers/helpers/withoutSelectedServer';
import { useServers } from '../servers/reducers/servers';
import { ServersListGroup } from '../servers/ServersListGroup';
import { ShlinkLogo } from './img/ShlinkLogo';

export const Home: FC = withoutSelectedServer(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { servers } = useServers();
  const serversList = Object.values(servers);
  const hasServers = serversList.length > 0;

  useEffect(() => {
    // Try to redirect to the first server marked as auto-connect
    const autoConnectServer = serversList.find(({ autoConnect }) => autoConnect);
    if (autoConnectServer) {
      navigate(`/server/${autoConnectServer.id}`);
    }
  }, [serversList, navigate]);

  return (
    <div className="px-3 w-full">
      <Card className="mx-auto max-w-[900px] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="p-10 hidden md:flex items-center w-[38%] bg-lm-main dark:bg-dm-main text-white">
            <div className="w-full">
              <ShlinkLogo />
            </div>
          </div>

          <div className="md:border-l border-lm-border dark:border-dm-border flex-grow">
            <h1 className={clsx('p-6 text-left border-lm-border dark:border-dm-border', { 'border-b': !hasServers })}>
              {t('Welcome!')}
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
