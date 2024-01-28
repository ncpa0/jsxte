import { type ElementGenerator, JsxteRenderer } from "../renderer/renderer";

export type DomRenderOptions = {
  [key: string]: any;
  attributeMap?: Record<string, string> | undefined;
  /**
   * A custom attribute setter function. Can be used to assign elements object
   * properties for some JSX attributes instead of `HTMLElement.setAttribute`.
   *
   * @default element.setAttribute(name, value) */
  attributeSetter?: (element: HTMLElement, name: string, value: any) => void;
};

export class DomRenderer {
  private generator;
  private setAttribute = (element: HTMLElement, name: string, value: any) => {
    element.setAttribute(name, value);
  };

  constructor(
    private window: Window,
    private options: DomRenderOptions = {},
  ) {
    if (options.attributeSetter) {
      this.setAttribute = options.attributeSetter;
    }

    const doc = this.window.document;
    const domrenderer = this;

    class DomGenerator
      implements ElementGenerator<HTMLElement | Text | DocumentFragment>
    {
      createElement(
        type: string,
        attributes: Array<[attributeName: string, attributeValue: any]>,
        children: Array<HTMLElement | Text | DocumentFragment>,
      ): HTMLElement | Text | DocumentFragment {
        const element = doc.createElement(type);
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
      ): HTMLElement | Text | DocumentFragment {
        return doc.createTextNode(String(text));
      }

      createFragment(
        children: Array<HTMLElement | Text | DocumentFragment>,
      ): HTMLElement | Text | DocumentFragment {
        const fragment = doc.createDocumentFragment();
        for (const child of children) {
          fragment.appendChild(child);
        }
        return fragment;
      }
    }

    this.generator = new DomGenerator();
  }

  public render(component: JSX.Element): HTMLElement | Text | DocumentFragment {
    const renderer = new JsxteRenderer(this.generator, {
      ...this.options,
      allowAsync: false,
    });
    return renderer.render(component);
  }

  public async renderAsync(
    component: JSX.Element,
  ): Promise<HTMLElement | Text | DocumentFragment> {
    const renderer = new JsxteRenderer(this.generator, {
      ...this.options,
      allowAsync: true,
    });
    return renderer.render(component);
  }
}
