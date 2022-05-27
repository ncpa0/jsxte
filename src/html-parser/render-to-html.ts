import { jsxElemToHtmlAsync, jsxElemToHtmlSync } from "./jsx-elem-to-html";

/**
 * Renders the provided JSX component to pure html. This function
 * is synchronous and will not render components that are asynchronous.
 */
export const renderToHtml = (component: JSX.Element) => {
  return jsxElemToHtmlSync(component);
};

/**
 * Renders the provided JSX component to pure html. This function
 * is asynchronous, it allows to use asynchronous components
 * withing the provided component structure.
 */
export const renderToHtmlAsync = async (
  component: JSX.Element | Promise<JSX.Element>
) => {
  return await jsxElemToHtmlAsync(await component);
};
