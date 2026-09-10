type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

class CacheService {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, value: T, ttlMs: number) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  clear() {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();
