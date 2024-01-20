import { createLogger } from '@alwatr/logger';

import {logger as logger_} from './logger';

logger_.logModule?.('register-service-worker');

const logger = createLogger('service-worker')

const serviceWorkerPath = '/es/service-worker.js';

/**
 * Register the service worker and listen for the 'updatefound' event
 *
 * @param serviceWorkerPath The path to the service worker
 *
 * @returns A promise that resolves to the service worker registration
 */
async function registerServiceWorker(serviceWorkerPath: string) {
  logger.logMethod?.('registerServiceWorker');

  try {
    const swRegistration = await navigator.serviceWorker.register(serviceWorkerPath);
    logger.logOther?.('Service worker registered.');
    swRegistration.addEventListener('updatefound', () => serviceWorkerUpdateFoundHandler(swRegistration.installing));
  }
  catch (error) {
    logger.error('registerServiceWorker', 'registration_failed ', {error});
  }
}

/**
 * Handle the 'updatefound' event
 *
 * @param serviceWorker The service worker
 */
function serviceWorkerUpdateFoundHandler(serviceWorker: ServiceWorker | null): void {
  if (serviceWorker == null) return;
  logger.logMethod?.('swUpdateFound');
  serviceWorker.addEventListener('statechange', () => serviceWorkerStateChangeHandler(serviceWorker));
}

/**
 * Handle the 'statechange' event
 *
 * If the service worker state is 'installed' then it is either a new install or an update
 * If the service worker state is 'redundant' then the service worker is redundant
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/state
 *
 * @param serviceWorker The service worker
 */
function serviceWorkerStateChangeHandler(serviceWorker: ServiceWorker): void {
  logger.logMethodArgs?.('serviceWorkerStateChangeHandler', serviceWorker.state);
  if (serviceWorker.state === 'installed') {
    // if old controller available then its update else its new install
    if (navigator.serviceWorker.controller) {
      // reload to update
      // TODO: snackbar to user before and after reload
      location.reload()
    }
  }
  else if (serviceWorker.state === 'redundant') {
    logger.accident('serviceWorkerStateChangeHandler', 'sw_redundant', 'Service worker redundant');
  }
}

if ('serviceWorker' in navigator) {
  registerServiceWorker(serviceWorkerPath);
}
