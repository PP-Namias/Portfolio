const SW_PATH = '/sw.js';

type MessageCallback = (event: MessageEvent) => void;

let registration: ServiceWorkerRegistration | null = null;
const messageListeners = new Set<MessageCallback>();

export async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator)) return null;
  if (process.env.NODE_ENV !== 'production') return null;

  try {
    registration = await navigator.serviceWorker.register(SW_PATH, {
      scope: '/',
      updateViaCache: 'none',
    });

    registration.addEventListener('updatefound', () => {
      const installing = registration?.installing;
      if (installing) {
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            installing.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      }
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      messageListeners.forEach((listener) => listener(event));
    });

    return registration;
  } catch (error) {
    console.error('[SW] Registration failed:', error);
    return null;
  }
}

export async function sendMessageToSW(type: string, data?: Record<string, unknown>): Promise<unknown> {
  const controller = navigator.serviceWorker.controller;
  if (!controller) return null;

  return new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data?.error) reject(new Error(event.data.error));
      else resolve(event.data);
    };
    controller.postMessage(
      { type, ...data },
      [messageChannel.port2]
    );
  });
}

export function onSWMessage(callback: MessageCallback): () => void {
  messageListeners.add(callback);
  return () => messageListeners.delete(callback);
}

export async function unregisterSW(): Promise<boolean> {
  if (!registration) return false;
  const result = await registration.unregister();
  registration = null;
  return result;
}
