import type { ComponentApi } from "../component-api/component-api";
import { type ElementGenerator, JsxteRenderer } from "../renderer/renderer";

export type NodeLike = object;
export type DocumentFragmentLike = {
  appendChild: (
    child: any,
  ) => any;
};
export type HTMLElementLike = {
  appendChild: (
    child: any,
  ) => any;
  setAttribute: (name: string, value: any) => void;
};
export type TextLike = {
  textContent: string | null;
};

export type DocumentLike = {
  createElement: (type: string) => HTMLElementLike;
  createTextNode: (text: string) => TextLike;
  createDocumentFragment: () => DocumentFragmentLike;
};

export type WindowLike = {
  document: DocumentLike;
};

export type AsDocumentFragmentLike<T> = T extends DocumentFragmentLike ? T
  : never;
export type AsHtmlElementLike<T> = T extends HTMLElementLike ? T : never;
export type AsTextLike<T> = T extends TextLike ? T : never;

export type GetDocumentFragmentType<W extends WindowLike> =
  AsDocumentFragmentLike<
    ReturnType<
      W["document"]["createDocumentFragment"]
    >
  >;
export type GetHtmlElementType<W extends WindowLike> = AsHtmlElementLike<
  ReturnType<
    W["document"]["createElement"]
  >
>;
export type GetTextType<W extends WindowLike> = AsTextLike<
  ReturnType<
    W["document"]["createTextNode"]
  >
>;

export type DomRenderOptions<W extends WindowLike> = {
  [key: string]: any;
  attributeMap?: Record<string, string> | undefined;
  /**
   * A custom attribute setter function. Can be used to assign elements object
   * properties for some JSX attributes instead of `HTMLElement.setAttribute`.
   *
   * @default element.setAttribute(name, value) */
  attributeSetter?: (
    element: GetHtmlElementType<W>,
    name: string,
    value: any,
  ) => void;
};

export class DomRenderer<W extends WindowLike> {
  private generator;
  private setAttribute = (
    element: GetHtmlElementType<W>,
    name: string,
    value: any,
  ) => {
    if (typeof value === "boolean") {
      if (value) {
        value = name;
      } else {
        return;
      }
    }
    element.setAttribute(name, value);
  };

  constructor(
    private window: W,
    private options: DomRenderOptions<W> = {},
  ) {
    if (options.attributeSetter) {
      this.setAttribute = options.attributeSetter;
    }

    const doc = this.window.document;
    const domrenderer = this;

    type R =
      | GetHtmlElementType<W>
      | GetTextType<W>
      | GetDocumentFragmentType<W>;

    class DomGenerator implements ElementGenerator<R> {
      createElement(
        type: string,
        attributes: Array<[attributeName: string, attributeValue: any]>,
        children: Array<R>,
      ): R {
        const element = doc.createElement(type) as GetHtmlElementType<W>;
        for (const [name, value] of attributes) {
          domrenderer.setAttribute(element, name, value);
        }
        for (const child of children) {
          element.appendChild(child);
        }
        return element;
      }

      createTextNode(
        text: string | number | bigint,
      ): R {
        return doc.createTextNode(String(text)) as GetTextType<W>;
      }

      createFragment(
        children: Array<R>,
      ): R {
        const fragment = doc.createDocumentFragment();
        for (const child of children) {
          fragment.appendChild(child);
        }
        return fragment as GetDocumentFragmentType<W>;
      }
    }

    this.generator = new DomGenerator();
  }

  public render(
    component: JSX.Element,
    componentApi?: ComponentApi,
  ): GetHtmlElementType<W> | GetTextType<W> | GetDocumentFragmentType<W> {
    const renderer = new JsxteRenderer(this.generator, {
      ...this.options,
      allowAsync: false,
    }, componentApi);
    return renderer.render(component);
  }

  public async renderAsync(
    component: JSX.Element,
    componentApi?: ComponentApi,
  ): Promise<
    GetHtmlElementType<W> | GetTextType<W> | GetDocumentFragmentType<W>
  > {
    const renderer = new JsxteRenderer(this.generator, {
      ...this.options,
      allowAsync: true,
    }, componentApi);
    return renderer.render(component);
  }
}
