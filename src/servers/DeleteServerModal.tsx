import type { ExitAction } from '@shlinkio/shlink-frontend-kit';
import { CardModal } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import type { ServerWithId } from './data';
import { useServers } from './reducers/servers';

export type DeleteServerModalProps = {
  server: ServerWithId;
  onClose: (confirmed: boolean) => void;
  open: boolean;
};

export const DeleteServerModal: FC<DeleteServerModalProps> = ({ server, onClose, open }) => {
  const { deleteServer } = useServers();
  const { t } = useTranslation();
  const onClosed = useCallback(
    (exitAction: ExitAction) => {
      if (exitAction === 'confirm') {
        deleteServer(server);
      }
    },
    [deleteServer, server],
  );

  return (
    <CardModal
      open={open}
      title={t('Remove server')}
      variant="danger"
      onClose={() => onClose(false)}
      onConfirm={() => onClose(true)}
      onClosed={onClosed}
      confirmText={t('Delete')}
    >
      <div className="flex flex-col gap-y-4">
        <p>
          {t('Are you sure you want to remove')} <b>{server ? server.name : ''}</b>?
        </p>
        <p>
          <i>
            {t(
              'No data will be deleted, only the access to this server will be removed from this device. You can create it again at any moment.',
            )}
          </i>
        </p>
      </div>
    </CardModal>
  );
};
