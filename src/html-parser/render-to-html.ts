import { jsxElemToHtmlAsync, jsxElemToHtmlSync } from "./jsx-elem-to-html";

type HtmlRenderOptions = {
  indent?: number;
  attributeMap?: Record<string, string>;
};

/**
 * Renders the provided JSX component to pure html. This function
 * is synchronous and will not render components that are asynchronous.
 */
export const renderToHtml = (
  component: JSX.Element,
  options?: HtmlRenderOptions
) => {
  return jsxElemToHtmlSync(component, undefined, options);
};

/**
 * Renders the provided JSX component to pure html. This function
 * is asynchronous, it allows to use asynchronous components
 * withing the provided component structure.
 */
export const renderToHtmlAsync = async (
  component: JSX.Element | Promise<JSX.Element>,
  options?: HtmlRenderOptions
) => {
  return await jsxElemToHtmlAsync(await component, undefined, options);
};
