import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import {createPartialResponse} from 'workbox-range-requests';

declare type ExtendableEvent = any
declare let self: any;

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('fetch', (event: ExtendableEvent) => {
  console.log('Fetch listener called');
  const {request} = event;
  if (request.headers.has('range')) {
    event.respondWith((async () => {
      const cache = await caches.open('media');
      const fullResponse = await cache.match(request);
      if (fullResponse) {
        return createPartialResponse(request, fullResponse);
      }
      // If there's a cache miss, fall back to the network.
      return fetch(request);
    })());
  }
});

self.addEventListener('install', (/* event: ExtendableEvent */) => {
  console.log('init listener called');
  self.skipWaiting();
});