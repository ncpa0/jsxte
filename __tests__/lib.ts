import type {
  defineContext,
  DomRenderer,
  ErrorBoundary,
  renderToHtml,
  renderToHtmlAsync,
  renderToJson,
  renderToJsonAsync,
} from "../src/index";

let Lib: {
  DomRenderer: typeof DomRenderer;
  defineContext: typeof defineContext;
  ErrorBoundary: typeof ErrorBoundary;
  renderToHtml: typeof renderToHtml;
  renderToHtmlAsync: typeof renderToHtmlAsync;
  renderToJson: typeof renderToJson;
  renderToJsonAsync: typeof renderToJsonAsync;
};

if (process.env.TEST_DIST) {
  // @ts-ignore
  const pkg = await import("../dist/esm/index.mjs");
  Lib = {
    DomRenderer: pkg.DomRenderer,
    defineContext: pkg.defineContext,
    ErrorBoundary: pkg.ErrorBoundary,
    renderToHtml: pkg.renderToHtml,
    renderToHtmlAsync: pkg.renderToHtmlAsync,
    renderToJson: pkg.renderToJson,
    renderToJsonAsync: pkg.renderToJsonAsync,
  };
} else {
  // @ts-ignore
  const pkg = await import("../src/index");
  Lib = {
    DomRenderer: pkg.DomRenderer,
    defineContext: pkg.defineContext,
    ErrorBoundary: pkg.ErrorBoundary,
    renderToHtml: pkg.renderToHtml,
    renderToHtmlAsync: pkg.renderToHtmlAsync,
    renderToJson: pkg.renderToJson,
    renderToJsonAsync: pkg.renderToJsonAsync,
  };
}

export { Lib };
