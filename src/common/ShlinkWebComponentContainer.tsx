import type { TagColorsStorage } from '@shlinkio/shlink-web-component';
import {
  ShlinkSidebarToggleButton,
  ShlinkSidebarVisibilityProvider,
  ShlinkWebComponent,
} from '@shlinkio/shlink-web-component';
import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import type { ShlinkApiClientBuilder } from '../api/services/ShlinkApiClientBuilder';
import { withDependencies } from '../container/context';
import { isReachableServer } from '../servers/data';
import { ServerError } from '../servers/helpers/ServerError';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import { useSelectedServer } from '../servers/reducers/selectedServer';
import { useSettings } from '../settings/reducers/settings';
import { NotFound } from './NotFound';

export type ShlinkWebComponentContainerProps = {
  TagColorsStorage: TagColorsStorage;
  buildShlinkApiClient: ShlinkApiClientBuilder;
};

const ShlinkWebComponentContainerBase: FC<ShlinkWebComponentContainerProps> = withSelectedServer(
  ({ buildShlinkApiClient, TagColorsStorage: tagColorsStorage }) => {
    const { selectedServer } = useSelectedServer();
    const { settings, setSettings } = useSettings();

    const reachable = isReachableServer(selectedServer);
    const routesPrefix = reachable ? `/server/${selectedServer.id}` : '';

    // ShlinkWebComponent re-creates its whole store when the apiClient prop changes identity, so
    // these references must stay stable across re-renders not caused by a server switch. Creating
    // them inline would wipe all cached state on every un-related re-render.
    const apiClient = useMemo(
      () => (reachable ? buildShlinkApiClient(selectedServer) : undefined),
      [buildShlinkApiClient, reachable, selectedServer],
    );
    const createNotFound = useCallback(
      (nonPrefixedHomePath: string) => (
        <NotFound to={`${routesPrefix}${nonPrefixedHomePath}`}>List short URLs</NotFound>
      ),
      [routesPrefix],
    );

    if (!reachable) {
      return <ServerError />;
    }

    return (
      <ShlinkSidebarVisibilityProvider>
        <ShlinkSidebarToggleButton className="fixed top-3.5 left-3 z-901" />
        <ShlinkWebComponent
          serverVersion={selectedServer.version}
          apiClient={apiClient!}
          settings={settings}
          onSettingsUpdate={setSettings}
          routesPrefix={routesPrefix}
          tagColorsStorage={tagColorsStorage}
          createNotFound={createNotFound}
          autoSidebarToggle={false}
        />
      </ShlinkSidebarVisibilityProvider>
    );
  },
);

export const ShlinkWebComponentContainer = withDependencies(ShlinkWebComponentContainerBase, [
  'buildShlinkApiClient',
  'TagColorsStorage',
]);
