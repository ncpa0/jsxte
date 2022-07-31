import { ContextMap } from "../context-map/context-map";
import { pad } from "../utilities/pad";
import { mapAttributesToHtmlTagString } from "./attribute-to-html-tag-string";
import { getHTMLStruct } from "./get-html-struct";

const isSyncElem = (e: JSX.Element): e is JSXTE.SyncElement => true;

export const jsxElemToHtmlSync = (
  element: JSX.Element,
  contextMap: ContextMap = ContextMap.create(),
  options?: { indent?: number; attributeMap?: Record<string, string> }
): string => {
  const { attributeMap = {}, indent = 0 } = options ?? {};
  contextMap = ContextMap.clone(contextMap);

  if (!isSyncElem(element)) throw new Error("");

  if (element.type === "textNode") {
    const indentPadding = pad(indent);
    return indentPadding + element.text;
  }

  if (typeof element.tag !== "string") {
    const subElem = element.tag(
      element.props,
      contextMap
    ) as any as JSXTE.SyncElement;

    if (subElem instanceof Promise) {
      throw new Error(
        `Encountered an async Component: [${element.tag.name}] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`
      );
    }

    return jsxElemToHtmlSync(subElem, contextMap, { indent, attributeMap });
  } else {
    const htmlStruct = getHTMLStruct(element, attributeMap);

    if (htmlStruct.tag === "") {
      const results: string[] = [];
      for (const child of htmlStruct.children) {
        const renderedChild = jsxElemToHtmlSync(child, contextMap, {
          indent: indent + 2,
          attributeMap,
        });
        if (renderedChild.length > 0) results.push(renderedChild);
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
        const renderedChild = jsxElemToHtmlSync(child, contextMap, {
          indent: indent + 2,
          attributeMap,
        });

        if (renderedChild.length > 0) children.push(renderedChild);
      }

      return [startTag, ...children, endTag].join("\n");
    }
  }
};

export const jsxElemToHtmlAsync = async (
  element: JSX.Element,
  contextMap: ContextMap = ContextMap.create(),
  options?: { indent?: number; attributeMap?: Record<string, string> }
): Promise<string> => {
  const { attributeMap = {}, indent = 0 } = options ?? {};
  contextMap = ContextMap.clone(contextMap);

  if (!isSyncElem(element)) throw new Error("");

  if (element.type === "textNode") {
    const indentPadding = pad(indent);
    return indentPadding + element.text;
  }

  if (typeof element.tag !== "string") {
    const subElem = (await element.tag(
      element.props,
      contextMap
    )) as any as JSXTE.SyncElement;

    return await jsxElemToHtmlAsync(subElem, contextMap, {
      indent,
      attributeMap,
    });
  } else {
    const htmlStruct = getHTMLStruct(element, attributeMap);

    if (htmlStruct.tag === "") {
      const results: string[] = [];
      for (const child of htmlStruct.children) {
        const renderedChild = await jsxElemToHtmlAsync(child, contextMap, {
          indent: indent + 2,
          attributeMap,
        });
        if (renderedChild.length > 0) results.push(renderedChild);
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
        const renderedChild = await jsxElemToHtmlAsync(child, contextMap, {
          indent: indent + 2,
          attributeMap,
        });
        if (renderedChild.length > 0) children.push(renderedChild);
      }

      return [startTag, ...children, endTag].join("\n");
    }
  }
};
