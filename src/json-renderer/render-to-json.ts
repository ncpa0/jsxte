import { JsxteRenderError } from "../jsxte-render-error";
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
  try {
    return jsxElemToJsonSync(component, undefined, options);
  } catch (err) {
    if (JsxteRenderError.is(err)) {
      err.regenerateMessage();
    }
    throw err;
  }
};

/**
 * Renders the provided JSX component to a JSON structure. This function is
 * synchronous and will not render components that are asynchronous.
 */
export const renderToJsonAsync = async (
  component: JSX.Element,
  options?: HtmlRenderOptions,
) => {
  try {
    return await jsxElemToJsonAsync(component, undefined, options);
  } catch (err) {
    if (JsxteRenderError.is(err)) {
      err.regenerateMessage();
    }
    throw err;
  }
};
