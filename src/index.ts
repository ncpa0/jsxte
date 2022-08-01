import "./utilities/array-flat-polyfill";

export { renderToHtml, renderToHtmlAsync } from "./html-parser/render-to-html";
export * from "./express/index";
export type { StringTemplateParserOptions } from "./string-template-parser/render-to-string-template-tag";
export { renderToStringTemplateTag } from "./string-template-parser/render-to-string-template-tag";
export type { HTMLProps } from "./jsx/base-html-tag-props";
export * from "./jsx/jsx.types";
