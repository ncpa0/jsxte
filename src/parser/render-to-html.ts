import { jsxElemToHtmlAsync, jsxElemToHtmlSync } from "./jsx-elem-to-html";

/**
 * Renders the provided JSX component to pure html. This function
 * is synchronous and will not render components that are asynchronous.
 */
export const renderToHtml = <P>(
  component: (props: P) => JSX.Element,
  props: P
) => {
  return jsxElemToHtmlSync(component(props));
};

/**
 * Renders the provided JSX component to pure html. This function
 * is asynchronous, it allows to use asynchronous components
 * withing the provided component structure.
 */
export const renderToHtmlAsync = async <P>(
  component: ((props: P) => JSX.Element) | ((props: P) => Promise<JSX.Element>),
  props: P
) => {
  return await jsxElemToHtmlAsync(await component(props));
};
