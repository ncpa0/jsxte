import { ComponentApi } from "../component-api/component-api";
import { ErrorBoundary } from "../error-boundary/error-boundary";
import { JsxteRenderError } from "../jsxte-render-error";
import { getComponentName } from "../utilities/get-component-name";
import { getErrorMessage } from "../utilities/get-err-message";
import { join } from "../utilities/join";
import { SELF_CLOSING_TAG_LIST } from "../utilities/self-closing-tag-list";
import { mapAttributesToHtmlTagString } from "./attribute-to-html-tag-string";
import { getHTMLStruct } from "./get-html-struct";

function assertSyncElem(
  e: JSXTE.TagElement | JSXTE.TextNodeElement | JSX.AsyncElement,
): asserts e is JSXTE.SyncElement {}

const isTextNode = (e: JSX.Element): e is JSXTE.TextNodeElement =>
  typeof e === "object" && e != null && "type" in e && e.type === "textNode";

export type RendererInternalOptions = {
  indent?: number;
  currentIndent?: number;
  attributeMap?: Record<string, string>;
};

export const jsxElemToHtmlSync = (
  element: JSX.Element,
  _componentApi?: ComponentApi,
  options?: RendererInternalOptions,
): string => {
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (typeof element) {
    case "string":
      return element;
    case "bigint":
    case "number":
      return String(element);
    case "boolean":
    case "function":
    case "symbol":
    case "undefined":
      return "";
  }

  if (element === null) return "";

  const attributeMap = options?.attributeMap ?? {};
  const currentIndent = options?.currentIndent ?? 0;
  const indent = options?.indent ?? 2;

  const componentApi = _componentApi
    ? ComponentApi.clone(_componentApi)
    : ComponentApi.create(options);

  assertSyncElem(element);

  if (element.type === "textNode") {
    const indentPadding = " ".repeat(currentIndent);
    return indentPadding + element.text;
  }

  if (typeof element.tag !== "string") {
    if (ErrorBoundary._isErrorBoundary(element.tag)) {
      const boundary = new element.tag(element.props);

      try {
        const subElem = boundary.render(
          element.props,
          componentApi,
        ) as any as JSXTE.SyncElement;

        if (subElem instanceof Promise) {
          throw new JsxteRenderError(
            `Encountered an async Component: [${element.tag.name}.render] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`,
            getComponentName(element.tag),
          );
        }

        return jsxElemToHtmlSync(subElem, componentApi, {
          indent,
          currentIndent: currentIndent,
          attributeMap,
        });
      } catch (e) {
        try {
          const fallbackElem = boundary.onError(e, element.props, componentApi);

          if (fallbackElem instanceof Promise) {
            throw new JsxteRenderError(
              `Encountered an async Component: [${element.tag.name}.onError] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`,
            );
          }

          return jsxElemToHtmlSync(fallbackElem, componentApi, {
            indent,
            currentIndent: currentIndent,
            attributeMap,
          });
        } catch (err) {
          const tagname = getComponentName(element.tag) + ".onError";

          if (!JsxteRenderError.is(err)) {
            throw new JsxteRenderError(
              "Rendering has failed due to an error: " + getErrorMessage(err),
              tagname,
            );
          }

          err.pushParent(tagname);
          throw err;
        }
      }
    }

    if (typeof element.tag !== "function") {
      throw new JsxteRenderError("Encountered an invalid element.");
    }

    try {
      const subElem = element.tag(
        element.props,
        componentApi,
      ) as any as JSXTE.SyncElement;

      if (subElem instanceof Promise) {
        throw new JsxteRenderError(
          `Encountered an async Component: [${element.tag.name}], Asynchronous Component's cannot be parsed by renderToHTML(). If you want to use asynchronous components use renderToHtmlAsync() instead.`,
        );
      }

      return jsxElemToHtmlSync(subElem, componentApi, {
        indent,
        currentIndent: currentIndent,
        attributeMap,
      });
    } catch (err) {
      if (!JsxteRenderError.is(err)) {
        throw new JsxteRenderError(
          "Rendering has failed due to an error: " + getErrorMessage(err),
          getComponentName(element.tag),
        );
      }

      err.pushParent(getComponentName(element.tag));
      throw err;
    }
  } else {
    const htmlStruct = getHTMLStruct(element, attributeMap);

    if (htmlStruct.tag === "") {
      try {
        const results: string[] = [];
        for (let i = 0; i < htmlStruct.children.length; i++) {
          const child = htmlStruct.children[i]!;
          const renderedChild = jsxElemToHtmlSync(child, componentApi, {
            indent,
            currentIndent: currentIndent + indent,
            attributeMap,
          });
          if (renderedChild.length > 0) results.push(renderedChild);
        }
        return join(results);
      } catch (err) {
        if (!JsxteRenderError.is(err)) {
          throw new JsxteRenderError(
            "Rendering has failed due to an error: " + getErrorMessage(err),
            htmlStruct.tag,
          );
        }

        err.pushParent(htmlStruct.tag);
        throw err;
      }
    } else {
      try {
        const isSelfClosingTag =
          htmlStruct.children.length === 0 &&
          SELF_CLOSING_TAG_LIST.includes(htmlStruct.tag);
        const inlineTag =
          htmlStruct.children.length === 0 ||
          htmlStruct.children.every(isTextNode);
        const indentPadding = " ".repeat(currentIndent);

        const attrString = join(
          mapAttributesToHtmlTagString(htmlStruct.attributes),
          " ",
        );

        const separator = attrString.length ? " " : "";

        if (isSelfClosingTag) {
          return (
            `${indentPadding}<${htmlStruct.tag}` +
            separator +
            join(mapAttributesToHtmlTagString(htmlStruct.attributes), " ") +
            separator +
            "/>"
          );
        }

        const startTag =
          `${indentPadding}<${htmlStruct.tag}` +
          separator +
          join(mapAttributesToHtmlTagString(htmlStruct.attributes), " ") +
          ">";
        const endTag = `${inlineTag ? "" : indentPadding}</${htmlStruct.tag}>`;
        const children: string[] = [];

        for (let i = 0; i < htmlStruct.children.length; i++) {
          const child = htmlStruct.children[i]!;
          const renderedChild = jsxElemToHtmlSync(child, componentApi, {
            indent: inlineTag ? 0 : indent,
            currentIndent: inlineTag ? 0 : currentIndent + indent,
            attributeMap,
          });

          if (renderedChild.length > 0) children.push(renderedChild);
        }

        if (inlineTag) {
          return startTag + join(children, "") + endTag;
        }

        return join([startTag, ...children, endTag]);
      } catch (err) {
        if (!JsxteRenderError.is(err)) {
          throw new JsxteRenderError(
            "Rendering has failed due to an error: " + getErrorMessage(err),
            htmlStruct.tag,
          );
        }

        err.pushParent(htmlStruct.tag);
        throw err;
      }
    }
  }
};

export const jsxElemToHtmlAsync = async (
  element: JSX.Element,
  _componentApi?: ComponentApi,
  options?: RendererInternalOptions,
): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (typeof element) {
    case "string":
      return element;
    case "bigint":
    case "number":
      return String(element);
    case "boolean":
    case "function":
    case "symbol":
    case "undefined":
      return "";
  }

  if (element === null) return "";

  const { attributeMap = {}, currentIndent = 0, indent = 2 } = options ?? {};
  const componentApi = _componentApi
    ? ComponentApi.clone(_componentApi)
    : ComponentApi.create(options);

  assertSyncElem(element);

  if (element.type === "textNode") {
    const indentPadding = " ".repeat(currentIndent);
    return indentPadding + element.text;
  }

  if (typeof element.tag !== "string") {
    if (ErrorBoundary._isErrorBoundary(element.tag)) {
      const boundary = new element.tag(element.props);

      try {
        const subElem = (await boundary.render(
          element.props,
          componentApi,
        )) as any as JSXTE.SyncElement;

        return await jsxElemToHtmlAsync(subElem, componentApi, {
          indent,
          currentIndent: currentIndent,
          attributeMap,
        });
      } catch (e) {
        try {
          const fallbackElem = await boundary.onError(
            e,
            element.props,
            componentApi,
          );

          return await jsxElemToHtmlAsync(fallbackElem, componentApi, {
            indent,
            currentIndent: currentIndent,
            attributeMap,
          });
        } catch (err) {
          const tagname = getComponentName(element.tag) + ".onError";

          if (!JsxteRenderError.is(err)) {
            throw new JsxteRenderError(
              "Rendering has failed due to an error: " + getErrorMessage(err),
              tagname,
            );
          }

          err.pushParent(tagname);
          throw err;
        }
      }
    }

    if (typeof element.tag !== "function") {
      throw new JsxteRenderError("Encountered an invalid element.");
    }

    try {
      const subElem = (await element.tag(
        element.props,
        componentApi,
      )) as any as JSXTE.SyncElement;

      return await jsxElemToHtmlAsync(subElem, componentApi, {
        indent,
        currentIndent: currentIndent,
        attributeMap,
      });
    } catch (err) {
      if (!JsxteRenderError.is(err)) {
        throw new JsxteRenderError(
          "Rendering has failed due to an error: " + getErrorMessage(err),
          getComponentName(element.tag),
        );
      }

      err.pushParent(getComponentName(element.tag));
      throw err;
    }
  } else {
    const htmlStruct = getHTMLStruct(element, attributeMap);

    if (htmlStruct.tag === "") {
      try {
        const results: string[] = [];
        for (let i = 0; i < htmlStruct.children.length; i++) {
          const child = htmlStruct.children[i]!;
          const renderedChild = await jsxElemToHtmlAsync(child, componentApi, {
            indent,
            currentIndent: currentIndent + indent,
            attributeMap,
          });
          if (renderedChild.length > 0) results.push(renderedChild);
        }
        return join(results);
      } catch (err) {
        if (!JsxteRenderError.is(err)) {
          throw new JsxteRenderError(
            "Rendering has failed due to an error: " + getErrorMessage(err),
            htmlStruct.tag,
          );
        }

        err.pushParent(htmlStruct.tag);
        throw err;
      }
    } else {
      try {
        const isSelfClosingTag =
          htmlStruct.children.length === 0 &&
          SELF_CLOSING_TAG_LIST.includes(htmlStruct.tag);
        const inlineTag =
          htmlStruct.children.length === 0 ||
          htmlStruct.children.every(isTextNode);
        const indentPadding = " ".repeat(currentIndent);

        const attrString = join(
          mapAttributesToHtmlTagString(htmlStruct.attributes),
          " ",
        );

        const separator = attrString.length ? " " : "";

        if (isSelfClosingTag) {
          return (
            `${indentPadding}<${htmlStruct.tag}` +
            separator +
            join(mapAttributesToHtmlTagString(htmlStruct.attributes), " ") +
            separator +
            "/>"
          );
        }

        const startTag =
          `${indentPadding}<${htmlStruct.tag}` + separator + attrString + ">";
        const endTag = `${inlineTag ? "" : indentPadding}</${htmlStruct.tag}>`;
        const children: string[] = [];

        for (let i = 0; i < htmlStruct.children.length; i++) {
          const child = htmlStruct.children[i]!;
          const renderedChild = await jsxElemToHtmlAsync(child, componentApi, {
            indent: inlineTag ? 0 : indent,
            currentIndent: inlineTag ? 0 : currentIndent + indent,
            attributeMap,
          });
          if (renderedChild.length > 0) children.push(renderedChild);
        }

        if (inlineTag) {
          return startTag + join(children, "") + endTag;
        }

        return join([startTag, ...children, endTag]);
      } catch (err) {
        if (!JsxteRenderError.is(err)) {
          throw new JsxteRenderError(
            "Rendering has failed due to an error: " + getErrorMessage(err),
            htmlStruct.tag,
          );
        }

        err.pushParent(htmlStruct.tag);
        throw err;
      }
    }
  }
};
