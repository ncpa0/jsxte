export const isObjectKey = <K extends string>(
  key: string,
  obj: Record<K, any>
): key is K => key in obj;
