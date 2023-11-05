export const getComponentName = (component: Function) => {
  if ("displayName" in component && typeof component.displayName === "string") {
    return component.displayName;
  }

  if ("name" in component && typeof component.name === "string") {
    return component.name;
  }

  return "AnonymousComponent";
};
