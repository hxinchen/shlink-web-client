import { Card, Message } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { Link } from 'react-router';
import { NoMenuLayout } from '../../common/NoMenuLayout';
import { useTranslation } from '../../i18n/useTranslation';
import { isServerWithId } from '../data';
import { DeleteServerButton } from '../DeleteServerButton';
import { useSelectedServer } from '../reducers/selectedServer';
import { useServers } from '../reducers/servers';
import { ServersListGroup } from '../ServersListGroup';

export const ServerError: FC = () => {
  const { servers } = useServers();
  const { selectedServer } = useSelectedServer();
  const { t } = useTranslation();

  return (
    <NoMenuLayout>
      <div className="flex flex-col items-center gap-y-4 md:gap-y-8">
        <Message className="w-full lg:w-[80%]" variant="error">
          {!isServerWithId(selectedServer) && t('Could not find this server.')}
          {isServerWithId(selectedServer) && (
            <>
              <p>{t('Oops! Could not connect to this server.')}</p>
              {t('Make sure you have internet connection, and the server is properly configured and on-line.')}
            </>
          )}
        </Message>

        <p className="text-xl">
          {t('These are the servers currently configured. Choose one of them or')}{' '}
          <Link to="/server/create">{t('add a new one')}</Link>.
        </p>
        <Card className="w-full max-w-100 overflow-hidden">
          <ServersListGroup borderless servers={Object.values(servers)} />
        </Card>

        {isServerWithId(selectedServer) && (
          <p className="text-xl">
            {t('Alternatively, if you think you may have misconfigured this server, you can')}{' '}
            <DeleteServerButton server={selectedServer}>{t('remove it')}</DeleteServerButton> {t('or')}&nbsp;
            <Link to={`/server/${selectedServer.id}/edit?reconnect=true`}>{t('edit it')}</Link>.
          </p>
        )}
      </div>
    </NoMenuLayout>
  );
};
