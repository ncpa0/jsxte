import type { ComponentApi } from "../component-api/component-api";
import { type ElementGenerator, JsxteRenderer } from "../renderer/renderer";
import { mapAttributesToHtmlTagString } from "./attribute-to-html-tag-string";
import type { HtmlLine } from "./base-html-generator";
import { BaseHtmlGenerator } from "./base-html-generator";
import type { HtmlRenderOptions } from "./render-to-html";

export class HtmlCompactGenerator extends BaseHtmlGenerator
  implements ElementGenerator<string>
{
  createTextNode(text: string | number | bigint): string {
    return String(text);
  }

  createElement(
    type: string,
    attributes: [attributeName: string, attributeValue: any][],
    children: string[],
  ): string {
    const attributesString = mapAttributesToHtmlTagString(attributes);
    const content = this.flattenChildrenCompact(children);
    return this.generateTagCompact(type, attributesString, content);
  }

  createFragment(children: string[]): string {
    return this.flattenChildrenCompact(children);
  }
}

export class HtmlPrettyGenerator extends BaseHtmlGenerator
  implements ElementGenerator<HtmlLine[]>
{
  createTextNode(text: string | number | bigint): HtmlLine[] {
    return [{ type: "text", content: String(text) }];
  }

  createElement(
    type: string,
    attributes: [attributeName: string, attributeValue: any][],
    children: HtmlLine[][],
  ): HtmlLine[] {
    const attributesString = mapAttributesToHtmlTagString(attributes);
    const content = this.flattenChildren(children);
    return this.generateTag(type, attributesString, content);
  }

  createFragment(children: HtmlLine[][]): HtmlLine[] {
    return this.flattenChildren(children);
  }
}

export const jsxElemToHtmlSync = (
  element: JSX.Element,
  componentApi?: ComponentApi,
  options: HtmlRenderOptions = {},
): string => {
  const { pretty = false } = options;
  if (pretty) {
    const renderer = new JsxteRenderer(
      new HtmlPrettyGenerator(options),
      { ...options, allowAsync: false },
      componentApi,
    );
    const lines = renderer.render(element);
    return HtmlPrettyGenerator.concatHtmlLines(lines, options);
  } else {
    const renderer = new JsxteRenderer(
      new HtmlCompactGenerator(options),
      { ...options, allowAsync: false },
      componentApi,
    );
    return renderer.render(element);
  }
};
