import type {
  DomRenderOptions,
  WindowLike,
} from "../dom-renderer/dom-renderer";
import { DomRenderer } from "../dom-renderer/dom-renderer";
import { jsxElemToHtmlAsync } from "../html-renderer/jsx-elem-to-html-async";
import { jsxElemToHtmlSync } from "../html-renderer/jsx-elem-to-html-sync";
import type { HtmlRenderOptions } from "../html-renderer/render-to-html";
import {
  jsxElemToJsonAsync,
  jsxElemToJsonSync,
} from "../json-renderer/jsx-elem-to-json";
import type { JsonRenderOptions } from "../json-renderer/render-to-json";
import { jsx } from "../jsx-runtime";

export class ContextAccessor {
  public static clone(original: ContextAccessor): ContextAccessor {
    return new ContextAccessor(new Map(original.map));
  }

  constructor(private map: Map<symbol, unknown> = new Map()) {}

  /**
   * Retrieve the context data for the specified context. If the context has
   * never been set by any of this component ancestors an error will be thrown.
   */
  public getOrFail<T>(ref: ContextDefinition<T>): T {
    const value = this.map.get(ref.id);

    if (value === undefined) {
      throw new Error(
        "Context not defined! Make sure the context is set before accessing it.",
      );
    }

    return value as T;
  }

  /** Retrieve the context data for the specified context. */
  public get<T>(ref: ContextDefinition<T>): T | undefined {
    const value = this.map.get(ref.id);
    return value as any;
  }

  /**
   * Partially update the state of the context data. Works only for objects and
   * can only be used if some context data is already set beforehand.
   *
   * Updates to the context made with this method are only visible to this
   * component and it's descendants.
   */
  public update<T extends object>(
    ref: ContextDefinition<T>,
    updateData: Partial<T>,
  ): void {
    const data = this.get(ref);

    if (
      typeof data === "object"
      && data !== null
      && typeof updateData === "object"
      && updateData !== null
    ) {
      if (Array.isArray(data)) {
        const arr = Array.from(data);

        const entries = Object.entries(updateData);
        for (let i = 0; i < entries.length; i++) {
          const [key, value] = entries[i]!;
          const index = Number(key);
          if (!isNaN(index)) arr[index] = value;
        }

        return void this.map.set(ref.id, arr);
      } else {
        return void this.map.set(ref.id, { ...data, ...updateData });
      }
    } else {
      throw new Error(
        "Context data is not an object!. Partial updates are only possible for objects.",
      );
    }
  }

  /**
   * Sets the context data for the specified context.
   *
   * Changes to the context made with this method are only visible to this
   * component and it's descendants.
   */
  public set<T>(ref: ContextDefinition<T>, data: T): void {
    this.map.set(ref.id, data);
  }

  /** Check if the context data for the specified context is set. */
  public has<T>(ref: ContextDefinition<T>): boolean {
    return this.map.has(ref.id);
  }

  /**
   * Replaces this context entries with the entries of the context provided.
   *
   * @internal
   */
  public replace(context: ContextAccessor): void {
    this.map = context.map;
  }
}

export class ComponentApi {
  public static create(options?: HtmlRenderOptions): ComponentApi {
    return new ComponentApi(options);
  }

  public static clone(original: ComponentApi): ComponentApi {
    return new ComponentApi(
      original.options,
      ContextAccessor.clone(original.ctx),
    );
  }

  /** Access to the current context data. */
  public ctx;

  private constructor(
    private options?: HtmlRenderOptions,
    accessor?: ContextAccessor,
  ) {
    this.ctx = accessor ?? new ContextAccessor();
  }

  /**
   * Renders the given JSX component to pure html as if it was a child of this
   * component. All context available to this component will be available to the
   * given component as well.
   */
  public render(
    component: JSX.Element,
    optionsOverrides?: HtmlRenderOptions,
  ): string {
    const thisCopy = ComponentApi.clone(this);
    if (optionsOverrides) {
      return jsxElemToHtmlSync(component, thisCopy, {
        ...this.options,
        ...optionsOverrides,
      });
    }
    return jsxElemToHtmlSync(component, thisCopy, this.options);
  }

  public async renderAsync(
    component: JSX.Element | Promise<JSX.Element>,
    optionsOverrides?: HtmlRenderOptions,
  ): Promise<string> {
    const thisCopy = ComponentApi.clone(this);
    if (optionsOverrides) {
      return Promise.resolve(component).then((c) =>
        jsxElemToHtmlAsync(c, thisCopy, {
          ...this.options,
          ...optionsOverrides,
        })
      );
    }
    return Promise.resolve(component).then((c) =>
      jsxElemToHtmlAsync(c, thisCopy, this.options)
    );
  }

  public renderToJson(
    component: JSX.Element,
    optionsOverrides?: JsonRenderOptions,
  ) {
    const thisCopy = ComponentApi.clone(this);
    if (optionsOverrides) {
      return jsxElemToJsonSync(component, thisCopy, {
        ...this.options,
        ...optionsOverrides,
      });
    }
    return jsxElemToJsonSync(component, thisCopy, this.options);
  }

  public async renderToJsonAsync(
    component: JSX.Element | Promise<JSX.Element>,
    optionsOverrides?: JsonRenderOptions,
  ) {
    const thisCopy = ComponentApi.clone(this);
    if (optionsOverrides) {
      return Promise.resolve(component).then((c) =>
        jsxElemToJsonAsync(c, thisCopy, {
          ...this.options,
          ...optionsOverrides,
        })
      );
    }
    return Promise.resolve(component).then((c) =>
      jsxElemToJsonAsync(c, thisCopy, this.options)
    );
  }

  public renderToDom<W extends WindowLike>(
    window: W,
    component: JSX.Element,
    optionsOverrides?: DomRenderOptions<W>,
  ) {
    const thisCopy = ComponentApi.clone(this);
    if (optionsOverrides) {
      const r = new DomRenderer(window, {
        ...this.options,
        ...optionsOverrides,
      });
      return r.render(component, thisCopy);
    }
    const r = new DomRenderer(window, this.options);
    return r.render(component, thisCopy);
  }

  public async renderToDomAsync<W extends WindowLike>(
    window: W,
    component: JSX.Element | Promise<JSX.Element>,
    optionsOverrides?: DomRenderOptions<W>,
  ) {
    const thisCopy = ComponentApi.clone(this);
    if (optionsOverrides) {
      const r = new DomRenderer(window, {
        ...this.options,
        ...optionsOverrides,
      });
      return Promise.resolve(component).then((c) => r.renderAsync(c, thisCopy));
    }
    const r = new DomRenderer(window, this.options);
    return Promise.resolve(component).then((c) => r.renderAsync(c, thisCopy));
  }
}

export class ContextDefinition<T> {
  id = Symbol();

  Provider = (
    props: JSXTE.PropsWithChildren<{
      value: T;
    }>,
    componentApi: ComponentApi,
  ) => {
    componentApi.ctx.set(this, props.value);
    return jsx("", { children: props.children });
  };

  Consumer = (
    props: JSXTE.PropsWithChildren<{
      render: (value?: T) => JSX.Element;
    }>,
    componentApi: ComponentApi,
  ) => {
    const value = componentApi.ctx.get(this);
    return props.render(value);
  };
}

export const defineContext = <T = unknown>() => new ContextDefinition<T>();
