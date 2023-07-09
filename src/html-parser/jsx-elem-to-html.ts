import { ComponentApi } from "../component-api/component-api";
import { ErrorBoundary } from "../error-boundary/error-boundary";
import { pad } from "../utilities/pad";
import { mapAttributesToHtmlTagString } from "./attribute-to-html-tag-string";
import { getHTMLStruct } from "./get-html-struct";

const isSyncElem = (e: JSX.Element): e is JSXTE.SyncElement => true;
const isTextNode = (e: JSX.Element): e is JSXTE.TextNodeElement =>
  "type" in e && e.type === "textNode";

export type RendererInternalOptions = {
  indent?: number;
  currentIndent?: number;
  attributeMap?: Record<string, string>;
};

export const jsxElemToHtmlSync = (
  element: JSX.Element,
  _contextMap?: ComponentApi,
  options?: RendererInternalOptions
): string => {
  const { attributeMap = {}, currentIndent = 0, indent = 2 } = options ?? {};
  const contextMap = _contextMap
    ? ComponentApi.clone(_contextMap)
    : ComponentApi.create(options);

  if (!isSyncElem(element)) throw new Error("");

  if (element.type === "textNode") {
    const indentPadding = pad(currentIndent);
    return indentPadding + element.text;
  }

  if (typeof element.tag !== "string") {
    if (ErrorBoundary._isErrorBoundary(element.tag)) {
      const boundary = new element.tag(element.props);

      try {
        const subElem = boundary.render(
          element.props,
          contextMap
        ) as any as JSXTE.SyncElement;

        if (subElem instanceof Promise) {
          throw new Error(
            `Encountered an async Component: [${element.tag.name}.render] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`
          );
        }

        return jsxElemToHtmlSync(subElem, contextMap, {
          indent,
          currentIndent: currentIndent,
          attributeMap,
        });
      } catch (e) {
        const fallbackElem = boundary.onError(e, element.props, contextMap);

        if (fallbackElem instanceof Promise) {
          throw new Error(
            `Encountered an async Component: [${element.tag.name}.onError] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`
          );
        }

        return jsxElemToHtmlSync(fallbackElem, contextMap, {
          indent,
          currentIndent: currentIndent,
          attributeMap,
        });
      }
    }

    const subElem = element.tag(
      element.props,
      contextMap
    ) as any as JSXTE.SyncElement;

    if (subElem instanceof Promise) {
      throw new Error(
        `Encountered an async Component: [${element.tag.name}] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`
      );
    }

    return jsxElemToHtmlSync(subElem, contextMap, {
      indent,
      currentIndent: currentIndent,
      attributeMap,
    });
  } else {
    const htmlStruct = getHTMLStruct(element, attributeMap);

    if (htmlStruct.tag === "") {
      const results: string[] = [];
      for (const child of htmlStruct.children) {
        const renderedChild = jsxElemToHtmlSync(child, contextMap, {
          indent,
          currentIndent: currentIndent + indent,
          attributeMap,
        });
        if (renderedChild.length > 0) results.push(renderedChild);
      }
      return results.join("\n");
    } else {
      const inlineTag =
        htmlStruct.children.length === 0 ||
        htmlStruct.children.every(isTextNode);
      const indentPadding = pad(currentIndent);

      const startTag =
        [
          `${indentPadding}<${htmlStruct.tag}`,
          ...mapAttributesToHtmlTagString(htmlStruct.attributes),
        ].join(" ") + ">";
      const endTag = `${inlineTag ? "" : indentPadding}</${htmlStruct.tag}>`;
      const children: string[] = [];

      for (const child of htmlStruct.children) {
        const renderedChild = jsxElemToHtmlSync(child, contextMap, {
          indent: inlineTag ? 0 : indent,
          currentIndent: inlineTag ? 0 : currentIndent + indent,
          attributeMap,
        });

        if (renderedChild.length > 0) children.push(renderedChild);
      }

      if (inlineTag) {
        return startTag + children.join("") + endTag;
      }

      return [startTag, ...children, endTag].join("\n");
    }
  }
};

export const jsxElemToHtmlAsync = async (
  element: JSX.Element,
  _contextMap?: ComponentApi,
  options?: RendererInternalOptions
): Promise<string> => {
  const { attributeMap = {}, currentIndent = 0, indent = 2 } = options ?? {};
  const contextMap = _contextMap
    ? ComponentApi.clone(_contextMap)
    : ComponentApi.create(options);

  if (!isSyncElem(element)) throw new Error("");

  if (element.type === "textNode") {
    const indentPadding = pad(currentIndent);
    return indentPadding + element.text;
  }

  if (typeof element.tag !== "string") {
    if (ErrorBoundary._isErrorBoundary(element.tag)) {
      const boundary = new element.tag(element.props);

      try {
        const subElem = (await boundary.render(
          element.props,
          contextMap
        )) as any as JSXTE.SyncElement;

        return await jsxElemToHtmlAsync(subElem, contextMap, {
          indent,
          currentIndent: currentIndent,
          attributeMap,
        });
      } catch (e) {
        const fallbackElem = await boundary.onError(
          e,
          element.props,
          contextMap
        );

        return await jsxElemToHtmlAsync(fallbackElem, contextMap, {
          indent,
          currentIndent: currentIndent,
          attributeMap,
        });
      }
    }

    const subElem = (await element.tag(
      element.props,
      contextMap
    )) as any as JSXTE.SyncElement;

    return await jsxElemToHtmlAsync(subElem, contextMap, {
      indent,
      currentIndent: currentIndent,
      attributeMap,
    });
  } else {
    const htmlStruct = getHTMLStruct(element, attributeMap);

    if (htmlStruct.tag === "") {
      const results: string[] = [];
      for (const child of htmlStruct.children) {
        const renderedChild = await jsxElemToHtmlAsync(child, contextMap, {
          indent,
          currentIndent: currentIndent + indent,
          attributeMap,
        });
        if (renderedChild.length > 0) results.push(renderedChild);
      }
      return results.join("\n");
    } else {
      const inlineTag =
        htmlStruct.children.length === 0 ||
        htmlStruct.children.every(isTextNode);
      const indentPadding = pad(currentIndent);

      const startTag =
        [
          `${indentPadding}<${htmlStruct.tag}`,
          ...mapAttributesToHtmlTagString(htmlStruct.attributes),
        ].join(" ") + ">";
      const endTag = `${inlineTag ? "" : indentPadding}</${htmlStruct.tag}>`;
      const children: string[] = [];

      for (const child of htmlStruct.children) {
        const renderedChild = await jsxElemToHtmlAsync(child, contextMap, {
          indent: inlineTag ? 0 : indent,
          currentIndent: inlineTag ? 0 : currentIndent + indent,
          attributeMap,
        });
        if (renderedChild.length > 0) children.push(renderedChild);
      }

      if (inlineTag) {
        return startTag + children.join("") + endTag;
      }

      return [startTag, ...children, endTag].join("\n");
    }
  }
};
