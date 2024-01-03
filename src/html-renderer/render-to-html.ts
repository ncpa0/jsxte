import { JsxteRenderError } from "../jsxte-render-error";
import { jsxElemToHtmlAsync, jsxElemToHtmlSync } from "./jsx-elem-to-html";

export type HtmlRenderOptions = {
  attributeMap?: Record<string, string>;
  compact?: boolean;
};

/**
 * Renders the provided JSX component to pure html. This function is synchronous
 * and will not render components that are asynchronous.
 */
export const renderToHtml = (
  component: JSX.Element,
  options?: HtmlRenderOptions,
) => {
  try {
    return jsxElemToHtmlSync(component, undefined, options);
  } catch (err) {
    if (JsxteRenderError.is(err)) {
      err.regenerateMessage();
    }
    throw err;
  }
};

/**
 * Renders the provided JSX component to pure html. This function is
 * asynchronous, it allows to use asynchronous components withing the provided
 * component structure.
 */
export const renderToHtmlAsync = async (
  component: JSX.Element | Promise<JSX.Element>,
  options?: HtmlRenderOptions,
) => {
  try {
    return await jsxElemToHtmlAsync(await component, undefined, options);
  } catch (err) {
    if (JsxteRenderError.is(err)) {
      err.regenerateMessage();
    }
    throw err;
  }
};
