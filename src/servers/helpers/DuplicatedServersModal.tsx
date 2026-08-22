import { CardModal } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { Fragment } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import type { ServerData } from '../data';

export type DuplicatedServersModalProps = {
  duplicatedServers: ServerData[];
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DuplicatedServersModal: FC<DuplicatedServersModalProps> = ({
  open,
  duplicatedServers,
  onClose,
  onConfirm,
}) => {
  const hasMultipleServers = duplicatedServers.length > 1;
  const { t } = useTranslation();

  return (
    <CardModal
      size="lg"
      title={hasMultipleServers ? t('Duplicated servers') : t('Duplicated server')}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={hasMultipleServers ? t('Save duplicates') : t('Save duplicate')}
      cancelText={hasMultipleServers ? t('Ignore duplicates') : t('Discard')}
    >
      <p>{hasMultipleServers ? t('The next servers already exist:') : t('There is already a server with:')}</p>
      <ul className="list-disc my-4 pl-5">
        {duplicatedServers.map(({ url, apiKey }, index) =>
          !hasMultipleServers ? (
            <Fragment key={index}>
              <li>
                {t('URL')}: <b>{url}</b>
              </li>
              <li>
                {t('API key')}: <b>{apiKey}</b>
              </li>
            </Fragment>
          ) : (
            <li key={index}>
              <b>{url}</b> - <b>{apiKey}</b>
            </li>
          ),
        )}
      </ul>
      <span>
        {hasMultipleServers ? t('Do you want to save duplicated servers') : t('Do you want to save this server')}?
      </span>
    </CardModal>
  );
};
