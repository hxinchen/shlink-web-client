import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import pack from '../package.json';
import { App } from './app/App';
import { ErrorHandler } from './common/ErrorHandler';
import { ScrollToTop } from './common/ScrollToTop';
import { container } from './container';
import { ContainerProvider } from './container/context';
import { unregister as unregisterServiceWorker } from './serviceWorkerRegistration';
import { setUpStore } from './store';
import './tailwind.css';

const store = setUpStore();

createRoot(document.getElementById('root')!).render(
  <ContainerProvider value={container}>
    <Provider store={store}>
      <BrowserRouter basename={pack.homepage}>
        <ErrorHandler>
          <ScrollToTop>
            <App />
          </ScrollToTop>
        </ErrorHandler>
      </BrowserRouter>
    </Provider>
  </ContainerProvider>,
);

// The admin console is an authenticated operational tool. Offline caching can retain stale
// credentials and can intercept backend documentation routes, so deliberately keep it online-only.
unregisterServiceWorker();
