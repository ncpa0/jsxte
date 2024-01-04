import type { ComponentApi } from "../component-api/component-api";
import { type ElementGenerator, JsxteRenderer } from "../renderer/renderer";
import { join } from "../utilities/join";
import { SELF_CLOSING_TAG_LIST } from "../utilities/self-closing-tag-list";
import { mapAttributesToHtmlTagString } from "./attribute-to-html-tag-string";
import type { HtmlRenderOptions } from "./render-to-html";

function leftPadHtml(str: string, padLength: number): string {
  const pad = " ".repeat(padLength);

  let result = pad;
  let isPreformatted = false;
  for (let i = 0; i < str.length; i++) {
    const char = str[i]!;

    if (!isPreformatted) {
      if (
        char === "e"
        && i > 2
        && str[i - 1] === "r"
        && str[i - 2] === "p"
        && str[i - 3] === "<"
      ) {
        isPreformatted = true;
      }

      if (char === "\n" && i + 1 < str.length) {
        result += char + pad;
      } else {
        result += char;
      }
    } else {
      if (
        char === "<"
        && i + 4 < str.length
        && str[i + 1] === "/"
        && str[i + 2] === "p"
        && str[i + 3] === "r"
        && str[i + 4] === "e"
      ) {
        isPreformatted = false;
      }
      result += char;
    }
  }

  return result;
}

class BaseHtmlGenerator {
  constructor(protected options?: HtmlRenderOptions | undefined) {}

  protected prepareContent(tag: string, content: string[]): string | undefined {
    if (content.length === 0) return undefined;

    if (this.options?.compact === true) {
      return join(content);
    }

    if (tag === "pre") {
      return join(content, "");
    }

    const padded = leftPadHtml(join(content, ""), this.options?.indent ?? 2);

    if (padded[padded.length - 1] === "\n") {
      return padded.slice(0, -1);
    }

    return padded;
  }

  protected generateTag(tag: string, attributes?: string, content?: string) {
    if (attributes) {
      attributes = " " + attributes;
    } else {
      attributes = "";
    }

    if (!content) {
      if (SELF_CLOSING_TAG_LIST.includes(tag)) {
        return `<${tag}${attributes} />\n`;
      } else {
        return `<${tag}${attributes}></${tag}>\n`;
      }
    }

    if (this.options?.compact === true) {
      return `<${tag}${attributes}>${content}</${tag}>\n`;
    }

    if (tag === "pre") {
      return `<${tag}${attributes}>${content}</${tag}>\n`;
    }

    return `<${tag}${attributes}>\n${content}\n</${tag}>\n`;
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
    const content = this.prepareContent(type, children);
    return this.generateTag(type, attributesString, content);
  }

  createFragment(children: string[]): string {
    return this.prepareContent("pre", children) ?? "";
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
        const content = this.prepareContent(type, children);
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
        return this.prepareContent("pre", children) ?? "";
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
