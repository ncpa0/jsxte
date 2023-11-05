import { ComponentApi } from "../component-api/component-api";
import { ErrorBoundary } from "../error-boundary/error-boundary";
import { getHTMLStruct } from "../html-renderer/get-html-struct";
import { JsxteRenderError } from "../jsxte-render-error";
import { getComponentName } from "../utilities/get-component-name";
import { getErrorMessage } from "../utilities/get-err-message";

function assertSyncElem(
  e: JSXTE.TagElement | JSXTE.TextNodeElement | JSX.AsyncElement,
): asserts e is JSXTE.SyncElement {}

export type JsonRendererInternalOptions = {
  attributeMap?: Record<string, string>;
};

export type JsxteJson = {
  element: keyof JSX.IntrinsicElements | "";
  attributes: [attributeName: string, value?: string][];
  children: Array<JsxteJson | string>;
};

export const jsxElemToJsonSync = (
  element: JSX.Element,
  _componentApi?: ComponentApi,
  options?: JsonRendererInternalOptions,
): JsxteJson | string => {
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

  const componentApi = _componentApi
    ? ComponentApi.clone(_componentApi)
    : ComponentApi.create(options);

  assertSyncElem(element);

  if (element.type === "textNode") {
    return element.text;
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

        return jsxElemToJsonSync(subElem, componentApi, {
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

          return jsxElemToJsonSync(fallbackElem, componentApi, {
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
        throw new Error(
          `Encountered an async Component: [${element.tag.name}] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`,
        );
      }

      return jsxElemToJsonSync(subElem, componentApi, {
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

    const r: JsxteJson = {
      element: htmlStruct.tag as keyof JSX.IntrinsicElements,
      attributes: htmlStruct.attributes,
      children: [],
    };

    try {
      for (let i = 0; i < htmlStruct.children.length; i++) {
        const child = htmlStruct.children[i]!;

        const rendered = jsxElemToJsonSync(child, componentApi, {
          attributeMap,
        });

        r.children.push(rendered);
      }

      return r;
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
};

export const jsxElemToJsonAsync = async (
  element: JSX.Element,
  _componentApi?: ComponentApi,
  options?: JsonRendererInternalOptions,
): Promise<JsxteJson | string> => {
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

  const componentApi = _componentApi
    ? ComponentApi.clone(_componentApi)
    : ComponentApi.create(options);

  assertSyncElem(element);

  if (element.type === "textNode") {
    return element.text;
  }

  if (typeof element.tag !== "string") {
    if (ErrorBoundary._isErrorBoundary(element.tag)) {
      const boundary = new element.tag(element.props);

      try {
        const subElem = (await boundary.render(
          element.props,
          componentApi,
        )) as any as JSXTE.SyncElement;

        return await jsxElemToJsonAsync(subElem, componentApi, {
          attributeMap,
        });
      } catch (e) {
        try {
          const fallbackElem = await boundary.onError(
            e,
            element.props,
            componentApi,
          );

          return await jsxElemToJsonAsync(fallbackElem, componentApi, {
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

      return await jsxElemToJsonAsync(subElem, componentApi, {
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

    const r: JsxteJson = {
      element: htmlStruct.tag as keyof JSX.IntrinsicElements,
      attributes: htmlStruct.attributes,
      children: [],
    };

    try {
      for (let i = 0; i < htmlStruct.children.length; i++) {
        const child = htmlStruct.children[i]!;

        const rendered = await jsxElemToJsonAsync(child, componentApi, {
          attributeMap,
        });

        r.children.push(rendered);
      }

      return r;
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
};
