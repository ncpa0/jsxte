class CacheEntry<T> {
  createdAt: number = Date.now();
  props: [string, any][];

  constructor(
    props: object,
    public value: T,
    private maxAge: number = 15 * 60 * 1000
  ) {
    this.props = Array.from(Object.entries(props));
  }

  isExpired(now: number): boolean {
    return now - this.createdAt > this.maxAge;
  }

  compareProps(propEntries: [string, any][]): boolean {
    if (propEntries.length !== this.props.length) return false;

    for (const [key, value] of propEntries) {
      const cachedPropValue = this.props.find(([k]) => k === key);
      if (cachedPropValue !== value) return false;
    }

    return true;
  }
}

export class Cache<T> {
  private lastInvalidate = Date.now();
  private invalidationInterval = 5 * 60 * 1000;

  private entries: CacheEntry<T>[] = [];

  constructor(private maxAge?: number) {}

  invalidateExpired() {
    const now = Date.now();
    this.entries = this.entries.filter((entry) => !entry.isExpired(now));
  }

  get(props: object): T | undefined {
    if (Date.now() - this.lastInvalidate > this.invalidationInterval) {
      this.lastInvalidate = Date.now();
      setTimeout(() => {
        this.invalidateExpired();
      }, 0);
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
  }
}
