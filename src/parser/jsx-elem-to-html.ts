import type { JSXSyncElem } from "../jsx/jsx.types";
import { pad } from "../utilities/pad";
import { mapAttributesToHtmlTagString } from "./attribute-to-html-tag-string";
import { getHTMLStruct } from "./get-html-struct";

const isSyncElem = (e: JSX.Element): e is JSXSyncElem => true;

export const jsxElemToHtmlSync = (element: JSX.Element, indent = 0): string => {
  if (!isSyncElem(element)) throw new Error("");

  if (element.type === "textNode") {
    const indentPadding = pad(indent);
    return indentPadding + element.text;
  }

  if (typeof element.tag !== "string") {
    const subElem = element.tag(element.props) as any as JSXSyncElem;

    if (subElem instanceof Promise) {
      throw new Error(
        `Encountered an async Component: [${element.tag.name}] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`
      );
    }

    return jsxElemToHtmlSync(subElem, indent);
  } else {
    const htmlStruct = getHTMLStruct(element);

    if (htmlStruct.tag === "") {
      const results: string[] = [];
      for (const child of htmlStruct.children) {
        results.push(jsxElemToHtmlSync(child, indent + 2));
      }
      return results.join("\n");
    } else {
      const indentPadding = pad(indent);

      const startTag =
        [
          `${indentPadding}<${htmlStruct.tag}`,
          ...mapAttributesToHtmlTagString(htmlStruct.attributes),
        ].join(" ") + ">";
      const endTag = `${indentPadding}</${htmlStruct.tag}>`;
      const children: string[] = [];

      for (const child of htmlStruct.children) {
        children.push(jsxElemToHtmlSync(child, indent + 2));
      }

      return [startTag, ...children, endTag].join("\n");
    }
  }
};

export const jsxElemToHtmlAsync = async (
  element: JSX.Element,
  indent = 0
): Promise<string> => {
  if (!isSyncElem(element)) throw new Error("");

  if (element.type === "textNode") {
    const indentPadding = pad(indent);
    return indentPadding + element.text;
  }

  if (typeof element.tag !== "string") {
    const subElem = (await element.tag(element.props)) as any as JSXSyncElem;

    return await jsxElemToHtmlAsync(subElem, indent);
  } else {
    const htmlStruct = getHTMLStruct(element);

    if (htmlStruct.tag === "") {
      const results: string[] = [];
      for (const child of htmlStruct.children) {
        results.push(await jsxElemToHtmlAsync(child, indent + 2));
      }
      return results.join("\n");
    } else {
      const indentPadding = pad(indent);

      const startTag =
        [
          `${indentPadding}<${htmlStruct.tag}`,
          ...mapAttributesToHtmlTagString(htmlStruct.attributes),
        ].join(" ") + ">";
      const endTag = `${indentPadding}</${htmlStruct.tag}>`;
      const children: string[] = [];

      for (const child of htmlStruct.children) {
        children.push(await jsxElemToHtmlAsync(child, indent + 2));
      }

      return [startTag, ...children, endTag].join("\n");
    }
  }
};
