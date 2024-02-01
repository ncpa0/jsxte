import type { ComponentApi } from "../component-api/component-api";
import { type ElementGenerator, JsxteRenderer } from "../renderer/renderer";
import { mapAttributesToHtmlTagString } from "./attribute-to-html-tag-string";
import type { HtmlLine } from "./base-html-generator";
import { BaseHtmlGenerator } from "./base-html-generator";
import type { HtmlRenderOptions } from "./render-to-html";

export class AsyncHtmlCompactGenerator extends BaseHtmlGenerator
  implements ElementGenerator<string | Promise<string>>
{
  createElement(
    type: string,
    attributes: [attributeName: string, attributeValue: any][],
    children:
      | Promise<Array<string>>
      | Array<string | Promise<string>>,
  ): Promise<string> {
    return Promise.resolve(children)
      .then((c) => Promise.all(c))
      .then((children) => {
        const attributesString = mapAttributesToHtmlTagString(attributes);
        const content = this.flattenChildrenCompact(children);
        return this.generateTagCompact(type, attributesString, content);
      });
  }

  createTextNode(text: string | number | bigint): string {
    return String(text);
  }

  createFragment(
    children:
      | Promise<Array<string>>
      | Array<string | Promise<string>>,
  ): Promise<string> {
    return Promise.resolve(children)
      .then((c) => Promise.all(c))
      .then((children) => {
        return this.flattenChildrenCompact(children);
      });
  }
}

export class AsyncHtmlPrettyGenerator extends BaseHtmlGenerator
  implements ElementGenerator<HtmlLine[] | Promise<HtmlLine[]>>
{
  createElement(
    type: string,
    attributes: [attributeName: string, attributeValue: any][],
    children:
      | Promise<Array<HtmlLine[]>>
      | Array<HtmlLine[] | Promise<HtmlLine[]>>,
  ): Promise<HtmlLine[]> {
    return Promise.resolve(children)
      .then((c) => Promise.all(c))
      .then((children) => {
        const attributesString = mapAttributesToHtmlTagString(attributes);
        const content = this.flattenChildren(children);
        return this.generateTag(type, attributesString, content);
      });
  }

  createTextNode(text: string | number | bigint): HtmlLine[] {
    return [{ type: "text", content: String(text) }];
  }

  createFragment(
    children:
      | Promise<Array<HtmlLine[]>>
      | Array<HtmlLine[] | Promise<HtmlLine[]>>,
  ): Promise<HtmlLine[]> {
    return Promise.resolve(children)
      .then((c) => Promise.all(c))
      .then((children) => {
        return this.flattenChildren(children);
      });
  }
}

export const jsxElemToHtmlAsync = (
  element: JSX.Element,
  componentApi?: ComponentApi,
  options: HtmlRenderOptions = {},
): Promise<string> => {
  const { pretty = false } = options;
  if (pretty) {
    const renderer = new JsxteRenderer(
      new AsyncHtmlPrettyGenerator(options),
      { ...options, allowAsync: true },
      componentApi,
    );
    const lines = renderer.render(element);

    return Promise.resolve(lines)
      .then((lines) =>
        AsyncHtmlPrettyGenerator.concatHtmlLines(lines, options)
      );
  } else {
    const renderer = new JsxteRenderer(
      new AsyncHtmlCompactGenerator(options),
      { ...options, allowAsync: true },
      componentApi,
    );
    return Promise.resolve(renderer.render(element));
  }
};
