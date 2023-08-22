import { jsxElemToJsonAsync, jsxElemToJsonSync } from "./jsx-elem-to-json";

type HtmlRenderOptions = {
  attributeMap?: Record<string, string>;
};

/**
 * Renders the provided JSX component to a JSON structure. This function is
 * synchronous and will not render components that are asynchronous.
 */
export const renderToJson = (
  component: JSX.Element,
  options?: HtmlRenderOptions,
) => {
  return jsxElemToJsonSync(component, undefined, options);
};

/**
 * Renders the provided JSX component to a JSON structure. This function is
 * synchronous and will not render components that are asynchronous.
 */
export const renderToJsonAsync = (
  component: JSX.Element,
  options?: HtmlRenderOptions,
) => {
  return jsxElemToJsonAsync(component, undefined, options);
};
