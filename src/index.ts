import "./utilities/array-flat-polyfill";

export * from "./express/index";
export * from "./jsx/jsx.types";

export { ErrorBoundary } from "./error-boundary/error-boundary";
export { defineContext } from "./component-api/component-api";
export {
  renderToHtml,
  renderToHtmlAsync,
} from "./html-renderer/render-to-html";
export {
  renderToJson,
  renderToJsonAsync,
} from "./json-renderer/render-to-json";
export { memo } from "./utilities/memo";
export { createElement } from "./jsx/jsx-runtime";
export { JsxteRenderError } from "./jsxte-render-error";
export type { ElementGenerator, RendererOptions } from "./renderer/renderer";
export { JsxteRenderer } from "./renderer/renderer";

export type {
  ContextDefinition,
  ComponentApi,
} from "./component-api/component-api";
export type { AttributeBool, HTMLProps } from "./jsx/base-html-tag-props";
export type { Crossorigin } from "./jsx/prop-types/shared/crossorigin";
export type { RefererPolicy } from "./jsx/prop-types/shared/referer-policy";
export type { Target } from "./jsx/prop-types/shared/target";
export type { JsxteJson } from "./json-renderer/jsx-elem-to-json";
export type { InputType } from "./jsx/prop-types/input-jsx-props";
export type { HtmlRenderOptions } from "./html-renderer/render-to-html";
export type { JsonRenderOptions } from "./json-renderer/render-to-json";
