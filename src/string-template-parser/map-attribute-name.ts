export const mapAttributeName = (
  attributeName: string,
  map: Record<string, string>
) => {
  if (attributeName in map) {
    return map[attributeName];
  }
  return attributeName;
};
