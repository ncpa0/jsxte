import { pad } from "../utilities/pad";
import { mapAttributesToHtmlTagString } from "./attribute-to-html-tag-string";
import { getHTMLStruct } from "./get-html-struct";

export const jsxElemToHTML = (element: JSX.Element, indent = 0): string => {
  if (element.type === "textNode") {
    const indentPadding = pad(indent);
    return indentPadding + element.text;
  }

  if (typeof element.tag !== "string") {
    if (typeof element.tag !== "function") {
      console.log(element);
    }
    const subElem = element.tag(element.props);
    return jsxElemToHTML(subElem, indent);
  } else {
    const htmlStruct = getHTMLStruct(element);

    if (htmlStruct.tag === "") {
      const results: string[] = [];
      for (const child of htmlStruct.children) {
        results.push(jsxElemToHTML(child, indent + 2));
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
        children.push(jsxElemToHTML(child, indent + 2));
      }

      return [startTag, ...children, endTag].join("\n");
    }
  }
};
