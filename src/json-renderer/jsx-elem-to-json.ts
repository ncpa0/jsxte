import type { ComponentApi } from "../component-api/component-api";
import { type ElementGenerator, JsxteRenderer } from "../renderer/renderer";
import type { JsonRenderOptions } from "./render-to-json";

export type JsxteJson = {
  element: keyof JSX.IntrinsicElements | "";
  attributes: [attributeName: string, value?: string][];
  children: Array<JsxteJson | number | bigint | string>;
};
export class JsonGenerator
  implements ElementGenerator<string | number | bigint | JsxteJson>
{
  createTextNode(text: string | number | bigint): string | number | bigint {
    return text;
  }

  createElement(
    type: string,
    attributes: [attributeName: string, attributeValue: any][],
    children: (string | number | bigint | JsxteJson)[],
  ): JsxteJson {
    return {
      element: type as keyof JSX.IntrinsicElements,
      attributes: attributes,
      children: children,
    };
  }

  createFragment(
    children: (string | number | bigint | JsxteJson)[],
  ): JsxteJson {
    return {
      element: "",
      attributes: [],
      children: children,
    };
  }
}

export const jsxElemToJsonSync = (
  element: JSX.Element,
  componentApi?: ComponentApi,
  options?: JsonRenderOptions,
): JsxteJson | string | number | bigint => {
  const renderer = new JsxteRenderer(
    new JsonGenerator(),
    { ...options, allowAsync: false },
    componentApi,
  );
  return renderer.render(element);
};

type AsyncResult =
  | Promise<string | number | bigint | JsxteJson>
  | string
  | number
  | bigint
  | JsxteJson;

export class AsyncJsonGenerator implements ElementGenerator<AsyncResult> {
  createTextNode(
    text: string | number | bigint | JsxteJson,
  ): string | number | bigint | JsxteJson {
    return text;
  }

  async createElement(
    type: string,
    attributes: [attributeName: string, attributeValue: any][],
    children: AsyncResult[] | Promise<AsyncResult[]>,
  ): Promise<JsxteJson> {
    return {
      element: type as keyof JSX.IntrinsicElements,
      attributes: attributes,
      children: await Promise.resolve(children).then((c) => Promise.all(c)),
    };
  }

  async createFragment(
    children: AsyncResult[] | Promise<AsyncResult[]>,
  ): Promise<JsxteJson> {
    return {
      element: "",
      attributes: [],
      children: await Promise.resolve(children).then((c) => Promise.all(c)),
    };
  }
}

export const jsxElemToJsonAsync = (
  element: JSX.Element,
  componentApi?: ComponentApi,
  options?: JsonRenderOptions,
): Promise<JsxteJson | string | number | bigint> => {
  const renderer = new JsxteRenderer(
    new AsyncJsonGenerator(),
    { ...options, allowAsync: true },
    componentApi,
  );
  return renderer.render(element) as any;
};
