import { JsxteRenderError } from "../jsxte-render-error";
import { jsxElemToHtmlAsync } from "./jsx-elem-to-html-async";
import { jsxElemToHtmlSync } from "./jsx-elem-to-html-sync";

export type HtmlRenderOptions = {
  /**
   * The number of spaces to use for indentation.
   * @default 2
   */
  indent?: number;
  attributeMap?: Record<string, string>;
  /**
   * If true, the generated html will be prettified, adding new lines and
   * indentation.
   */
  pretty?: boolean;
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
