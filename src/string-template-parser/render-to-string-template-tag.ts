/* eslint-disable max-len */
import { jsxElemToTagFuncArgsSync } from "./jsx-elem-to-strings";
import type { StringTemplateTag } from "./string-template-tag-type";

export type StringTemplateParserOptions = {
  /**
   * Mappings for html attribute names. Attributes defined in
   * here will get renamed during the rendering to whatever is set.
   *
   * @example
   *   const options = {
   *     attributeMap: { onclick: "@click" },
   *   };
   *
   *   renderToStringTemplateTag(
   *     html,
   *     <button onclick={handle}>Click Me</button>,
   *     options
   *   );
   *   // Will give the same result as
   *   html`<button @click="${handle}">Click Me</button>`;
   */
  attributeMap?: Record<string, string>;
};

export const renderToStringTemplateTag = <R>(
  tag: StringTemplateTag<R>,
  Component: JSX.Element,
  options?: StringTemplateParserOptions
) => {
  const [templateStringArray, params] = jsxElemToTagFuncArgsSync(
    Component,
    options?.attributeMap ?? {}
  );

  Object.assign(templateStringArray, { raw: [...templateStringArray] });

  return tag(templateStringArray as any, ...params);
};
