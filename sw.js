// Service worker: shows daily reminder notifications sent by the server
self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : { title: 'BRIDGE', body: 'Time to continue your learning track.' };
  e.waitUntil(self.registration.showNotification(d.title, { body: d.body, icon: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2214%22 fill=%22%236366f1%22/%3E%3Cpath d=%22M8 44V30C8 30 18 16 32 16s24 14 24 14v14%22 fill=%22none%22 stroke=%22%23fff%22 stroke-width=%224%22/%3E%3C/svg%3E', tag: 'bridge-daily' }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(cs => cs.length ? cs[0].focus() : clients.openWindow('/#track')));
});
