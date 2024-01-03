/* eslint-disable @typescript-eslint/prefer-for-of */

function flat<A extends any[], D extends number = 1>(
  this: A,
  depth?: D,
): FlatArray<A, D>[] {
  const copy: FlatArray<A, D>[] = [];

  if (depth === undefined) {
    // @ts-expect-error
    depth = 1;
  }

  for (let i = 0; i < this.length; i++) {
    const item = this[i];

    if (depth! > 0 && Array.isArray(item)) {
      const itemFlatCopy = flat.call(item, depth! - 1);
      for (let j = 0; j < itemFlatCopy.length; j++) {
        copy.push(itemFlatCopy[j]);
      }
    } else {
      copy.push(item);
    }
  }

  return copy;
}

// Add flat polyfill to Array prototype if not defined
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, "flat", {
    configurable: true,
    value: flat,
    writable: true,
  });
}
