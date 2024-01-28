import type { ComponentApi } from "../component-api/component-api";
import { type ElementGenerator, JsxteRenderer } from "../renderer/renderer";
import { join } from "../utilities/join";
// import { join } from "../utilities/join";
import { SELF_CLOSING_TAG_LIST } from "../utilities/self-closing-tag-list";
import { mapAttributesToHtmlTagString } from "./attribute-to-html-tag-string";
import type { HtmlRenderOptions } from "./render-to-html";

type HtmlLine = {
  content: string;
  type: "tag-open" | "tag-close" | "tag-inline" | "text";
  tag?: string;
};

class BaseHtmlGenerator {
  constructor(protected options?: HtmlRenderOptions | undefined) {}

  protected generateTag(
    tag: string,
    attributes?: string,
    content?: HtmlLine[],
  ): HtmlLine[] {
    if (attributes) {
      attributes = " " + attributes;
    } else {
      attributes = "";
    }

    if (!content || content.length === 0) {
      if (SELF_CLOSING_TAG_LIST.includes(tag)) {
        return [{
          type: "tag-inline",
          tag: tag,
          content: `<${tag}${attributes} />`,
        }];
      } else {
        return [{
          type: "tag-inline",
          tag: tag,
          content: `<${tag}${attributes}></${tag}>`,
        }];
      }
    }

    if (this.options?.compact === true) {
      return [
        {
          type: "tag-open",
          tag: tag,
          content: `<${tag}${attributes}>`,
        },
        ...content,
        {
          type: "tag-close",
          tag: tag,
          content: `</${tag}>`,
        },
      ];
    }

    if (tag === "pre") {
      return [
        {
          type: "tag-open",
          tag: tag,
          content: `<${tag}${attributes}>`,
        },
        ...content,
        {
          type: "tag-close",
          tag: tag,
          content: `</${tag}>`,
        },
      ];
    }

    return [
      {
        type: "tag-open",
        tag: tag,
        content: `<${tag}${attributes}>`,
      },
      ...content,
      {
        type: "tag-close",
        tag: tag,
        content: `</${tag}>`,
      },
    ];
  }

  protected flattenChildren(children: HtmlLine[][]): HtmlLine[] {
    const result: HtmlLine[] = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i]!;
      if (child.length === 1 && child[0]!.type === "text") {
        const last = result.at(-1);
        if (last?.type === "text") {
          last.content += child[0]!.content;
          continue;
        }
      }
      const lasIdx = result.length;
      for (let j = 0; j < child.length; j++) {
        result[lasIdx + j] = child[j]!;
      }
    }
    return result;
  }
}

export class HtmlGenerator extends BaseHtmlGenerator
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

const leftPad = (str: string, pad: string): string => {
  if (!str.includes("\n")) {
    return pad + str;
  } else {
    const lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      lines[i] = pad + lines[i];
    }
    return join(lines);
  }
};

const concatHtmlLines = (
  lines: HtmlLine[],
  options: HtmlRenderOptions | undefined,
): string => {
  let result = "";

  if (options?.compact === true) {
    let inPre = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      if (inPre > 0) {
        if (line.tag === "pre" && line.type === "tag-close") {
          inPre -= 1;
        }
        result += line.content;
      } else {
        if (line.tag === "pre" && line.type === "tag-open") {
          inPre += 1;
        }
        let content = line.content.trim();
        if (line.type === "text") {
          content = content.replaceAll("\n", " ");
        }
        result += content;
      }
    }
    return result;
  }

  const indentLength = options?.indent ?? 2;
  const singleIndent = " ".repeat(indentLength);
  let currentIndent = "";
  let inPre = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (line.type === "tag-close") {
      currentIndent = currentIndent.substring(indentLength);
    }
    if (inPre > 0) {
      if (line.tag === "pre" && line.type === "tag-close") {
        inPre -= 1;
      }
      const isLast = lines[i + 1]?.type === "tag-close"
        && lines[i + 1]?.tag === "pre";

      if (isLast) {
        result += line.content;
      } else {
        result += line.content + "\n";
      }
    } else {
      const content = line.content.trim();
      if (line.tag === "pre" && line.type === "tag-open") {
        inPre += 1;
        result += currentIndent + content;
      } else {
        result += leftPad(content, currentIndent) + "\n";
      }
    }
    if (line.type === "tag-open") {
      currentIndent += singleIndent;
    }
  }

  return result;
};

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
  const lines = renderer.render(element);
  return concatHtmlLines(lines, options);
};

export class AsyncHtmlGenerator extends BaseHtmlGenerator
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
  options?: HtmlRenderOptions,
): Promise<string> => {
  const renderer = new JsxteRenderer(
    new AsyncHtmlGenerator(options),
    { ...options, allowAsync: true },
    componentApi,
  );
  const lines = renderer.render(element);

  return Promise.resolve(lines)
    .then((lines) => concatHtmlLines(lines, options));
};
