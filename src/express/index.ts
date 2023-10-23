import { renderToHtmlAsync } from "../html-renderer/render-to-html";
import { createElement } from "../jsx/jsx-runtime";

/**
 * Express.js support.
 *
 * Allows to support Express.js builtin templating.
 */
const __express = async <P extends object>(
  filePath: string,
  options: P,
  callback: (e: any, rendered?: string | undefined) => void,
) => {
  // @ts-expect-error
  options ??= {};

  try {
    // eslint-disable-next-line
    const Component: JSXTE.AsyncComponent<P> = require(filePath).default;
    const html = await renderToHtmlAsync(createElement(Component, options));
    return callback(null, html);
  } catch (e) {
    callback(e);
  }
};

type ExpressApp = {
  engine(
    ext: string,
    fn: (
      path: string,
      options: object,
      callback: (e: any, rendered?: string) => void,
    ) => void,
  ): any;
  set(setting: string, val: any): any;
};

/**
 * Extends the Express server to use jsxte engine for rendering views.
 *
 * View files should have `.js` extension and have a default export with a jsx
 * component.
 */
export const expressExtend = (app: ExpressApp) => {
  app.engine("js", __express);
  app.set("view engine", "js");
};
