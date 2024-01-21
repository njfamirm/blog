const {writeFile} = require('fs').promises;

const {generateSW} = require('workbox-build');

const deploymentServiceWorkerContent = "console.log('service worker not build in deployment.')";
const serviceWorkerDest = 'dist/service-worker.js';

async function generateServiceWorker() {
  if (process.env.NODE_ENV !== 'production') {
    return writeFile(serviceWorkerDest, deploymentServiceWorkerContent);
  }

  return generateSW({
    globDirectory: 'dist',
    clientsClaim: true,
    skipWaiting: true,
    globPatterns: ['**/*.{ttf,woff,woff2,html,js}'],
    swDest: serviceWorkerDest,
    sourcemap: false,
    mode: 'production',
    offlineGoogleAnalytics: true,
  });
}

module.exports = {generateServiceWorker};
