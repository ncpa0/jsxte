import { jsxElemToTagFuncArgsSync } from "./jsx-elem-to-strings";
import type { StringTemplateTag } from "./string-template-tag-type";

export type StringTemplateParserOptions = {
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
