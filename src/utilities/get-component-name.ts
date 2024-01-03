export const getComponentName = (element: JSXTE.TagElement) => {
  if (typeof element.tag === "string") {
    return element.tag;
  }

  if (
    "displayName" in element.tag &&
    typeof element.tag.displayName === "string"
  ) {
    return element.tag.displayName;
  }

  if ("name" in element.tag && typeof element.tag.name === "string") {
    return element.tag.name;
  }

  return "AnonymousComponent";
};
