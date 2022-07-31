export class ContextMap {
  public static create(): ContextMap {
    return new ContextMap();
  }

  public static clone(original: ContextMap): ContextMap {
    return new ContextMap(new Map(original.map));
  }

  private constructor(private readonly map: Map<symbol, unknown> = new Map()) {}

  /**
   * Retrieve the context data for the specified context. If the
   * context has never been set by any of this component
   * ancestors an error will be thrown.
   */
  public get<T>(ref: ContextDefinition<T>): T {
    const value = this.map.get(ref.id);

    if (value === undefined) {
      throw new Error(
        "Context not defined! Make sure the context is set before accessing it."
      );
    }

    return value as T;
  }

  /**
   * Partially update the state of the context data. Works only
   * for objects and can only be used if some context data is
   * already set beforehand.
   *
   * Updates to the context made with this method are only
   * visible to this component and it's descendants.
   */
  public update<T extends object>(
    ref: ContextDefinition<T>,
    updateData: Partial<T>
  ): void {
    const data = this.get(ref);

    if (
      typeof data === "object" &&
      data !== null &&
      typeof updateData === "object" &&
      updateData !== null
    ) {
      if (Array.isArray(data)) {
        const arr = Array.from(data);

        for (const [key, value] of Object.entries(updateData)) {
          const index = Number(key);
          if (!isNaN(index)) arr[index] = value;
        }

        return void this.map.set(ref.id, arr);
      } else {
        return void this.map.set(ref.id, { ...data, ...updateData });
      }
    } else {
      throw new Error(
        "Context data is not an object!. Partial updates are only possible for objects."
      );
    }
  }

  /**
   * Sets the context data for the specified context.
   *
   * Changes to the context made with this method are only
   * visible to this component and it's descendants.
   */
  public set<T>(ref: ContextDefinition<T>, data: T): void {
    this.map.set(ref.id, data);
  }

  /** Check if the context data for the specified context is set. */
  public has<T>(ref: ContextDefinition<T>): boolean {
    return this.map.has(ref.id);
  }
}

export class ContextDefinition<T> {
  id = Symbol();
}

export const defineContext = <T = unknown>() => new ContextDefinition<T>();
