import { ComponentApi } from "../component-api/component-api";
import { ErrorBoundary } from "../error-boundary/error-boundary";
import { getHTMLStruct } from "../html-parser/get-html-struct";

const isSyncElem = (e: JSX.Element): e is JSXTE.SyncElement => true;

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
  const attributeMap = options?.attributeMap ?? {};

  const componentApi = _componentApi
    ? ComponentApi.clone(_componentApi)
    : ComponentApi.create(options);

  if (!isSyncElem(element)) throw new Error("");

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
          throw new Error(
            `Encountered an async Component: [${element.tag.name}.render] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`,
          );
        }

        return jsxElemToJsonSync(subElem, componentApi, {
          attributeMap,
        });
      } catch (e) {
        const fallbackElem = boundary.onError(e, element.props, componentApi);

        if (fallbackElem instanceof Promise) {
          throw new Error(
            `Encountered an async Component: [${element.tag.name}.onError] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`,
          );
        }

        return jsxElemToJsonSync(fallbackElem, componentApi, {
          attributeMap,
        });
      }
    }

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
  } else {
    const htmlStruct = getHTMLStruct(element, attributeMap);

    const r: JsxteJson = {
      element: htmlStruct.tag as keyof JSX.IntrinsicElements,
      attributes: htmlStruct.attributes,
      children: [],
    };

    for (let i = 0; i < htmlStruct.children.length; i++) {
      const child = htmlStruct.children[i]!;

      const rendered = jsxElemToJsonSync(child, componentApi, {
        attributeMap,
      });

      r.children.push(rendered);
    }

    return r;
  }
};

export const jsxElemToJsonAsync = async (
  element: JSX.Element,
  _componentApi?: ComponentApi,
  options?: JsonRendererInternalOptions,
): Promise<JsxteJson | string> => {
  const attributeMap = options?.attributeMap ?? {};

  const componentApi = _componentApi
    ? ComponentApi.clone(_componentApi)
    : ComponentApi.create(options);

  if (!isSyncElem(element)) throw new Error("");

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
        const fallbackElem = await boundary.onError(
          e,
          element.props,
          componentApi,
        );

        return await jsxElemToJsonAsync(fallbackElem, componentApi, {
          attributeMap,
        });
      }
    }

    const subElem = (await element.tag(
      element.props,
      componentApi,
    )) as any as JSXTE.SyncElement;

    return await jsxElemToJsonAsync(subElem, componentApi, {
      attributeMap,
    });
  } else {
    const htmlStruct = getHTMLStruct(element, attributeMap);

    const r: JsxteJson = {
      element: htmlStruct.tag as keyof JSX.IntrinsicElements,
      attributes: htmlStruct.attributes,
      children: [],
    };

    for (let i = 0; i < htmlStruct.children.length; i++) {
      const child = htmlStruct.children[i]!;

      const rendered = await jsxElemToJsonAsync(child, componentApi, {
        attributeMap,
      });

      r.children.push(rendered);
    }

    return r;
  }
};