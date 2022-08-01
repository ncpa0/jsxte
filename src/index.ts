import "./utilities/array-flat-polyfill";

export * from "./express/index";
export * from "./jsx/jsx.types";

export { renderToHtml, renderToHtmlAsync } from "./html-parser/render-to-html";
export { renderToStringTemplateTag } from "./string-template-parser/render-to-string-template-tag";
export {
  type ContextDefinition,
  type ContextMap,
  defineContext,
} from "./context-map/context-map";
export type { AttributeBool } from "./jsx/base-html-tag-props";
export type { StringTemplateParserOptions } from "./string-template-parser/render-to-string-template-tag";
export type { HTMLProps } from "./jsx/base-html-tag-props";
