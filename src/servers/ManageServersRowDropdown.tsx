import { faCircle as toggleOnIcon } from '@fortawesome/free-regular-svg-icons';
import {
  faBan as toggleOffIcon,
  faEdit as editIcon,
  faMinusCircle as deleteIcon,
  faPlug as connectIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RowDropdown, useToggle } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import type { ServerWithId } from './data';
import { DeleteServerModal } from './DeleteServerModal';
import { useServers } from './reducers/servers';

export type ManageServersRowDropdownProps = {
  server: ServerWithId;
};

export const ManageServersRowDropdown: FC<ManageServersRowDropdownProps> = ({ server }) => {
  const { setAutoConnect } = useServers();
  const { flag: isModalOpen, setToTrue: showModal, setToFalse: hideModal } = useToggle();
  const { t } = useTranslation();
  const serverUrl = `/server/${server.id}`;
  const { autoConnect: isAutoConnect } = server;
  const autoConnectIcon = isAutoConnect ? toggleOffIcon : toggleOnIcon;

  return (
    <>
      <RowDropdown menuAlignment="right">
        <RowDropdown.Item to={serverUrl} className="gap-1.5">
          <FontAwesomeIcon icon={connectIcon} /> {t('Connect')}
        </RowDropdown.Item>
        <RowDropdown.Item to={`${serverUrl}/edit`} className="gap-1.5">
          <FontAwesomeIcon icon={editIcon} /> {t('Edit server')}
        </RowDropdown.Item>
        <RowDropdown.Item onClick={() => setAutoConnect(server, !isAutoConnect)} className="gap-1.5">
          <FontAwesomeIcon icon={autoConnectIcon} /> {isAutoConnect ? t('Do not auto-connect') : t('Auto-connect')}
        </RowDropdown.Item>
        <RowDropdown.Separator />
        <RowDropdown.Item className="[&]:text-danger gap-1.5" onClick={showModal}>
          <FontAwesomeIcon icon={deleteIcon} /> {t('Remove server')}
        </RowDropdown.Item>
      </RowDropdown>

      <DeleteServerModal server={server} open={isModalOpen} onClose={hideModal} />
    </>
  );
};
