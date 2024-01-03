import type { ComponentApi } from "../component-api/component-api";
import { type ElementGenerator, JsxteRenderer } from "../renderer/renderer";
import { join } from "../utilities/join";
import { SELF_CLOSING_TAG_LIST } from "../utilities/self-closing-tag-list";
import { mapAttributesToHtmlTagString } from "./attribute-to-html-tag-string";
import type { HtmlRenderOptions } from "./render-to-html";

function leftPad(str: string, padLength: number): string {
  const pad = " ".repeat(padLength);

  let result = pad;
  for (let i = 0; i < str.length; i++) {
    const char = str[i]!;
    if (char === "\n" && i + 1 < str.length) {
      result += char + pad;
    } else {
      result += char;
    }
  }

  return result;
}

class BaseHtmlGenerator {
  constructor(protected options?: HtmlRenderOptions | undefined) {}

  protected prepareContent(content: string[]): string | undefined {
    if (content.length === 0) return undefined;

    if (this.options?.compact === true) {
      return join(content);
    }
    return leftPad(join(content, "\n"), 2);
  }

  protected generateTag(tag: string, attributes?: string, content?: string) {
    if (attributes) {
      attributes = " " + attributes;
    }

    if (!content) {
      if (SELF_CLOSING_TAG_LIST.includes(tag)) {
        return `<${tag}${attributes} />`;
      } else {
        return `<${tag}${attributes}></${tag}>`;
      }
    }

    if (this.options?.compact === true) {
      return `<${tag}${attributes}>${content}</${tag}>`;
    }

    if (tag === "pre") {
      return `<${tag}${attributes}>${content}</${tag}>`;
    }

    return `<${tag}${attributes}>\n${content}\n</${tag}>`;
  }
}

export class HtmlGenerator extends BaseHtmlGenerator
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
    const content = this.prepareContent(children);
    return this.generateTag(type, attributesString, content);
  }

  createFragment(children: string[]): string {
    return this.prepareContent(children) ?? "";
  }
}

export const jsxElemToHtmlSync = (
  element: JSX.Element,
  componentApi?: ComponentApi,
  options?: HtmlRenderOptions,
): string => {
  const renderer = new JsxteRenderer(
    new HtmlGenerator(),
    { ...options, allowAsync: false },
    componentApi,
  );
  return renderer.render(element);
};

export class AsyncHtmlGenerator extends BaseHtmlGenerator
  implements ElementGenerator<string | Promise<string>>
{
  createElement(
    type: string,
    attributes: [attributeName: string, attributeValue: any][],
    children: Promise<Array<string>> | Array<string | Promise<string>>,
  ): Promise<string> {
    return Promise.resolve(children)
      .then((c) => Promise.all(c))
      .then((children) => {
        const attributesString = mapAttributesToHtmlTagString(attributes);
        const content = this.prepareContent(children);
        return this.generateTag(type, attributesString, content);
      });
  }

  createTextNode(text: string | number | bigint): string {
    return String(text);
  }

  createFragment(
    children: Promise<Array<string>> | Array<string | Promise<string>>,
  ): Promise<string> {
    return Promise.resolve(children)
      .then((c) => Promise.all(c))
      .then((children) => {
        return this.prepareContent(children) ?? "";
      });
  }
}

export const jsxElemToHtmlAsync = (
  element: JSX.Element,
  componentApi?: ComponentApi,
  options?: HtmlRenderOptions,
): Promise<string> => {
  const renderer = new JsxteRenderer(
    new AsyncHtmlGenerator(options),
    { ...options, allowAsync: true },
    componentApi,
  );
  return renderer.render(element) as any;
};
