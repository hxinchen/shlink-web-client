import { Button, useParsedQuery } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { NoMenuLayout } from '../common/NoMenuLayout';
import { useTranslation } from '../i18n/useTranslation';
import { useGoBack } from '../utils/helpers/hooks';
import type { ServerData } from './data';
import { isServerWithId } from './data';
import { ServerForm } from './helpers/ServerForm';
import { withSelectedServer } from './helpers/withSelectedServer';
import { useSelectedServer } from './reducers/selectedServer';
import { useServers } from './reducers/servers';

export const EditServer: FC = withSelectedServer(() => {
  const { editServer } = useServers();
  const { selectServer, selectedServer } = useSelectedServer();
  const goBack = useGoBack();
  const { reconnect } = useParsedQuery<{ reconnect?: 'true' }>();
  const { t } = useTranslation();

  if (!isServerWithId(selectedServer)) {
    return null;
  }

  const handleSubmit = (serverData: ServerData) => {
    editServer(selectedServer.id, serverData);
    if (reconnect === 'true') {
      selectServer(selectedServer.id);
    }
    goBack();
  };

  return (
    <NoMenuLayout>
      <ServerForm
        title={t('Edit "{{name}}"', { name: selectedServer.name })}
        initialValues={selectedServer}
        onSubmit={handleSubmit}
      >
        <Button variant="secondary" onClick={goBack}>
          {t('Cancel')}
        </Button>
        <Button type="submit">{t('Save')}</Button>
      </ServerForm>
    </NoMenuLayout>
  );
});
