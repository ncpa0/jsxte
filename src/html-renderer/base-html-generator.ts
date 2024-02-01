import { join } from "../utilities/join";
import { SELF_CLOSING_TAG_LIST } from "../utilities/self-closing-tag-list";
import type { HtmlRenderOptions } from "./render-to-html";

export type HtmlLine = {
  content: string;
  type: "tag-open" | "tag-close" | "tag-inline" | "tag-selfclose" | "text";
  tag?: string;
};

export class BaseHtmlGenerator {
  constructor(protected options?: HtmlRenderOptions | undefined) {}

  protected generateTagCompact(
    tag: string,
    attributes?: string,
    content?: string,
  ): string {
    if (attributes) {
      attributes = " " + attributes;
    } else {
      attributes = "";
    }

    if (!content || content.length === 0) {
      if (SELF_CLOSING_TAG_LIST.includes(tag)) {
        return `<${tag}${attributes} />`;
      } else {
        return `<${tag}${attributes}></${tag}>`;
      }
    }

    return `<${tag}${attributes}>${content}</${tag}>`;
  }

  protected flattenChildrenCompact(children: string[]): string {
    return join(children, "");
  }

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
          type: "tag-selfclose",
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

  public static leftPad(str: string, pad: string): string {
    if (!str.includes("\n")) {
      return pad + str;
    } else {
      const lines = str.split("\n");
      for (let i = 0; i < lines.length; i++) {
        lines[i] = pad + lines[i];
      }
      return join(lines);
    }
  }

  public static trimContent(
    content: string,
  ): { wsLeft: boolean; wsRight: boolean; trimmed: string } {
    let leftWhitespace = 0;
    let rightWhitespace = 0;
    let wsLeft = false;
    let wsRight = false;

    for (let i = 0; i < content.length; i++) {
      if (content[i] === " " || content[i] === "\n") {
        leftWhitespace += 1;
      } else {
        break;
      }
    }

    if (leftWhitespace === content.length) {
      return { wsLeft: true, wsRight: true, trimmed: "" };
    }

    if (leftWhitespace > 0) {
      content = content.substring(leftWhitespace);
      wsLeft = true;
    }

    for (let i = content.length - 1; i >= 0; i--) {
      if (content[i] === " " || content[i] === "\n") {
        rightWhitespace += 1;
      } else {
        break;
      }
    }
    if (rightWhitespace > 0) {
      content = content.substring(0, content.length - rightWhitespace);
      wsRight = true;
    }

    return { wsLeft, wsRight, trimmed: content };
  }

  public static concatHtmlLines(
    lines: HtmlLine[],
    options: HtmlRenderOptions | undefined,
  ): string {
    let result = "";

    const indentLength = options?.indent ?? 2;
    const singleIndent = " ".repeat(indentLength);
    let currentIndent = "";
    let inPre = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      if (inPre > 0) {
        const isLast = lines[i + 1]?.type === "tag-close"
          && lines[i + 1]?.tag === "pre";
        const suffix = isLast ? "" : "\n";

        switch (line.type) {
          case "tag-open":
            if (line.tag === "pre") {
              inPre += 1;
            }
            result += line.content + suffix;
            currentIndent += singleIndent;
            break;
          case "tag-close":
            if (line.tag === "pre") {
              inPre -= 1;
            }
            result += line.content + suffix;
            currentIndent = currentIndent.substring(indentLength);
            break;
          case "tag-inline":
            result += line.content + suffix;
            break;
          case "tag-selfclose":
            result += line.content + suffix;
            break;
          case "text":
            result += line.content + suffix;
            break;
        }
      } else {
        switch (line.type) {
          case "tag-open": {
            let suffix = "\n";
            if (line.tag === "pre") {
              inPre += 1;
              suffix = "";
            } else {
              const nextLine = lines[i + 1];
              const addNewLine = nextLine
                ? nextLine.type === "tag-open"
                  || nextLine.type === "tag-selfclose"
                : true;
              if (!addNewLine) {
                suffix = "";
              } else if (result.length && result.at(-1) !== "\n") {
                result += "\n";
              }
            }
            const addIndent = result.at(-1) === "\n";
            if (addIndent) {
              result += currentIndent + line.content + suffix;
            } else {
              result += line.content + suffix;
            }
            currentIndent += singleIndent;
            break;
          }
          case "tag-close": {
            currentIndent = currentIndent.substring(indentLength);
            const nextLine = lines[i + 1];
            const addIndent = result.at(-1) === "\n";
            const addNewLine = nextLine
              ? nextLine.type === "tag-close"
                || nextLine.type === "tag-selfclose"
              : true;

            if (addIndent) {
              result += currentIndent;
            }
            result += line.content;
            if (addNewLine) {
              result += "\n";
            }
            break;
          }
          case "tag-inline": {
            const nextLine = lines[i + 1];
            const addIndent = result.at(-1) === "\n";
            const addNewLine = nextLine ? nextLine.type !== "text" : true;
            if (addIndent) {
              result += currentIndent;
            }
            result += line.content;
            if (addNewLine) {
              result += "\n";
            }
            break;
          }
          case "tag-selfclose": {
            result += currentIndent + line.content + "\n";
            break;
          }
          case "text": {
            const content = BaseHtmlGenerator.trimContent(line.content);
            const nextLine = lines[i + 1];
            const addIndent = result.at(-1) === "\n";
            if (addIndent) {
              result += BaseHtmlGenerator.leftPad(
                content.trimmed,
                currentIndent,
              );
            } else {
              if (
                content.wsLeft
                && content.trimmed !== ""
              ) {
                result += "\n"
                  + BaseHtmlGenerator.leftPad(content.trimmed, currentIndent);
              } else {
                result += content.trimmed;
              }
            }
            if (content.wsRight && nextLine?.type !== "tag-close") {
              result += "\n";
            }
            break;
          }
        }
      }
    }

    return result;
  }
}
