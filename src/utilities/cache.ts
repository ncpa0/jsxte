class CacheEntry<T> {
  createdAt: number = Date.now();
  props: Map<string, any>;

  constructor(props: object, public value: T, private maxAge: number) {
    this.props = new Map(Object.entries(props));
  }

  isExpired(now: number): boolean {
    return now - this.createdAt > this.maxAge;
  }

  compareProps(propEntries: [string, any][]): boolean {
    if (propEntries.length !== this.props.size) return false;

    for (let i = 0; i < propEntries.length; i++) {
      const [key, value] = propEntries[i]!;
      const cachedPropValue = this.props.get(key);
      if (cachedPropValue !== value) return false;
    }

    return true;
  }
}

export class Cache<T> {
  private lastInvalidate = Date.now();
  private invalidationInterval = 5 * 60 * 1000;

  private entries: CacheEntry<T>[] = [];

  constructor(
    private readonly maxAge: number = 15 * 60 * 1000,
    private readonly maxEntries: number = 10
  ) {
    if (maxEntries < 1) {
      throw new Error("Cache maxEntries must be greater than 0");
    }
  }

  private enforceEntryLimit() {
    while (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
  }

  private invalidateExpired() {
    const now = Date.now();
    this.entries = this.entries.filter((entry) => !entry.isExpired(now));
  }

  get(props: object): T | undefined {
    if (Date.now() - this.lastInvalidate > this.invalidationInterval) {
      this.lastInvalidate = Date.now();
      setTimeout(() => this.invalidateExpired(), 0);
    }

    const propsEntries = Array.from(Object.entries(props));

    const cacheEntry = this.entries.find((entry) =>
      entry.compareProps(propsEntries)
    );

    if (cacheEntry && !cacheEntry.isExpired(Date.now()))
      return cacheEntry.value;

    return undefined;
  }

  set(props: object, value: T) {
    this.entries.push(new CacheEntry(props, value, this.maxAge));
    setTimeout(() => this.enforceEntryLimit(), 0);
  }
}
