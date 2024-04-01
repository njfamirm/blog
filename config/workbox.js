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
    globPatterns: ['**/*.{ttf,woff,woff2,js,css}'],
    swDest: serviceWorkerDest,
    sourcemap: false,
    mode: 'production',
    offlineGoogleAnalytics: true,
    runtimeCaching: [{
      urlPattern: /.*\.m4a$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'audio-cache',
      },
    }],
  });
}


module.exports = {generateServiceWorker};
