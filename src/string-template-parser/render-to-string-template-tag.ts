/* eslint-disable max-len */
import { jsxElemToTagFuncArgsSync } from "./jsx-elem-to-strings";
import type { StringTemplateTag } from "./string-template-tag-type";
import { toTemplateStringArray } from "./to-template-string-array";

export interface TemplateLiteralCache {
  get: (
    templateStringsArray: TemplateStringsArray,
  ) => TemplateStringsArray | undefined;
  set: (templateStringsArray: TemplateStringsArray) => void;
}

export type StringTemplateParserOptions = {
  /**
   * Mappings for html attribute names. Attributes defined in here
   * will get renamed during the rendering to whatever is set.
   *
   * @example
   *   const options = {
   *   attributeMap: { onclick: "@click" },
   *   };
   *
   *   renderToStringTemplateTag(
   *   html,
   *   <button onclick={handle}>Click Me</button>,
   *   options
   *   );
   *   // Will give the same result as
   *   html`<button @click="${handle}">Click Me</button>`;
   */
  attributeMap?: Record<string, string>;
  /**
   * Template literal tags have a specific behavior to them, the
   * `TemplateStringsArray` is memoized for evaluations of the same
   * template literal. This is possible because the
   * `TemplateStringsArray` contains only parts of the template
   * literal that are not dynamic, and will never change.
   *
   * JSXTE templates can produce different `TemplateStringsArray` so
   * similar behavior is not possible.
   *
   * By providing a cache object you can simulate a similar behavior
   * to real template literals. Cache object is expected to be an
   * object with a `get` and `set` method.
   *
   * The `get` method shall compare the given `TemplateStringsArray`
   * to the ones in the cache and if a value that is deeply equal to
   * it exists, return it.
   *
   * The `set` method shall store the given `TemplateStringsArray` in
   * the cache.
   */
  cache?: TemplateLiteralCache;
};

export const renderToStringTemplateTag = <R>(
  tag: StringTemplateTag<R>,
  Component: JSX.Element,
  options: StringTemplateParserOptions = {},
) => {
  const [tmpTsa, params] = jsxElemToTagFuncArgsSync(Component, {
    ...options,
    tag,
  });

  const templateStringArray = toTemplateStringArray(tmpTsa);

  const cached = options?.cache?.get(templateStringArray as any);

  if (cached) {
    return tag(cached as any, ...params);
  }

  options?.cache?.set(templateStringArray as any);

  return tag(templateStringArray as any, ...params);
};
