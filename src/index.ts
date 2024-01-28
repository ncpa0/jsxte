import "./utilities/array-flat-polyfill";

export * from "./express/index";
export * from "./jsx/jsx.types";

export { defineContext } from "./component-api/component-api";
export { DomRenderer } from "./dom-renderer/dom-renderer";
export { ErrorBoundary } from "./error-boundary/error-boundary";
export {
  renderToHtml,
  renderToHtmlAsync,
} from "./html-renderer/render-to-html";
export {
  renderToJson,
  renderToJsonAsync,
} from "./json-renderer/render-to-json";
export { createElement } from "./jsx/jsx-runtime";
export { JsxteRenderError } from "./jsxte-render-error";
export { JsxteRenderer } from "./renderer/renderer";
export { memo } from "./utilities/memo";

export type {
  ComponentApi,
  ContextDefinition,
} from "./component-api/component-api";
export type { DomRenderOptions } from "./dom-renderer/dom-renderer";
export type { HtmlRenderOptions } from "./html-renderer/render-to-html";
export type { JsxteJson } from "./json-renderer/jsx-elem-to-json";
export type { JsonRenderOptions } from "./json-renderer/render-to-json";
export type { AttributeBool, HTMLProps } from "./jsx/base-html-tag-props";
export type { InputType } from "./jsx/prop-types/input-jsx-props";
export type { Crossorigin } from "./jsx/prop-types/shared/crossorigin";
export type { RefererPolicy } from "./jsx/prop-types/shared/referer-policy";
export type { Target } from "./jsx/prop-types/shared/target";
export type { ElementGenerator, RendererOptions } from "./renderer/renderer";
