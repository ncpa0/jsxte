export const mapAttributeName = (
  attributeName: string,
  map: Record<string, string>
): string => {
  if (attributeName in map && map[attributeName]) {
    return map[attributeName]!;
  }
  return attributeName;
};
