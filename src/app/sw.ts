import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

// ---------------------------------------------------------------------------
// FCM push notification handler
// ---------------------------------------------------------------------------
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options: NotificationOptions & { vibrate?: number[] } = {
    body: data.notification?.body || "New deal found!",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: data.data,
  };

  event.waitUntil(
    self.registration.showNotification(
      data.notification?.title || "LocalSteals",
      options,
    ),
  );
});

// ---------------------------------------------------------------------------
// Handle notification click - open or focus the app
// ---------------------------------------------------------------------------
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow("/");
      }
    }),
  );
});

serwist.addEventListeners();
