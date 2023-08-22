import "./utilities/array-flat-polyfill";

export * from "./express/index";
export * from "./jsx/jsx.types";
export * from "./jsx/prop-types/index";

export {
  Interpolate,
  InterpolateTag,
} from "./string-template-parser/interpolate";
export { DefaultTemplateArrayCache } from "./string-template-parser/default-cache";
export { ErrorBoundary } from "./error-boundary/error-boundary";
export { defineContext } from "./component-api/component-api";
export { renderToHtml, renderToHtmlAsync } from "./html-parser/render-to-html";
export {
  renderToJson,
  renderToJsonAsync,
} from "./json-renderer/render-to-json";
export { renderToStringTemplateTag } from "./string-template-parser/render-to-string-template-tag";
export { memo } from "./utilities/memo";

export type {
  ContextDefinition,
  ComponentApi,
} from "./component-api/component-api";
export type { AttributeBool, HTMLProps } from "./jsx/base-html-tag-props";
export type { StringTemplateParserOptions } from "./string-template-parser/render-to-string-template-tag";
export type { Crossorigin } from "./jsx/prop-types/shared/crossorigin";
export type { RefererPolicy } from "./jsx/prop-types/shared/referer-policy";
export type { Target } from "./jsx/prop-types/shared/target";
export type { JsxteJson } from "./json-renderer/jsx-elem-to-json";
