type CacheEntry = { data: unknown; expires: number };

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

export function invalidateCache(prefix?: string) {
  if (!prefix) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

export function cached<T>(key: string, fetcher: () => Promise<T>, ttlMs = 30_000): Promise<T> {
  const now = Date.now();
  const hit = cache.get(key);

  if (hit && hit.expires > now) {
    return Promise.resolve(hit.data as T);
  }

  const pending = inflight.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const promise = fetcher()
    .then((data) => {
      cache.set(key, { data, expires: Date.now() + ttlMs });
      inflight.delete(key);
      return data;
    })
    .catch((error) => {
      inflight.delete(key);
      throw error;
    });

  inflight.set(key, promise);
  return promise;
}
