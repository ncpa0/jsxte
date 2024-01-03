import { ComponentApi } from "../component-api/component-api";
import { ErrorBoundary } from "../error-boundary/error-boundary";
import { JsxteRenderError } from "../jsxte-render-error";
import { getComponentName } from "../utilities/get-component-name";
import { getErrorMessage } from "../utilities/get-err-message";

export type RendererOptions = {
  allowAsync: boolean;
  attributeMap?: Record<string, string>;
  [key: string]: any;
};

export interface ElementGenerator<T> {
  createElement(
    type: string,
    attributes: Array<[attributeName: string, attributeValue: any]>,
    children: Array<T>,
  ): T;
  createTextNode(text: string | number | bigint): T;
  createFragment(children: Array<T>): T;
}

interface RenderingContext {
  componentApi: ComponentApi;
}

type RendererResult<T> = T | NIL | Promise<T | NIL>;

type OnStringTagHandler<T> = (
  element: { tag: string; props: JSXTE.ElementProps },
  context: RenderingContext,
  orgElement: JSX.Element,
) => RendererResult<T>;
type OnFunctionTagHandler<T> = (
  element: {
    funcComponent: JSXTE.FunctionalComponent;
    props: JSXTE.ElementProps;
  },
  context: RenderingContext,
  orgElement: JSX.Element,
) => RendererResult<T>;
type OnClassTagHandler<T> = (
  element: { classComponent: JSXTE.ClassComponent; props: JSXTE.ElementProps },
  context: RenderingContext,
  orgElement: JSX.Element,
) => RendererResult<T>;
type OnFragmentHandler<T> = (
  elements: JSXTE.ElementChildren,
  context: RenderingContext,
  orgElement: JSX.Element,
) => RendererResult<T>;
type OnTextNodeHandler<T> = (
  element: JSXTE.TextNodeElement,
  context: RenderingContext,
  orgElement: JSX.Element,
) => RendererResult<T>;
type OnPrimitiveHandler<T> = (
  element: string | number,
  context: RenderingContext,
  orgElement: JSX.Element,
) => RendererResult<T>;
type ErrorHandler<T> = (
  error: unknown,
  element: JSX.Element,
  context: RenderingContext,
) => RendererResult<T> | never;

type ResolvedProps = {
  attributes: Array<[attributeName: string, attributeValue: any]>;
  children: JSX.Element[];
};

const NIL = Symbol("NIL");
type NIL = typeof NIL;

function isTagElement(element: JSX.Element): element is JSXTE.TagElement {
  return (
    typeof element === "object" &&
    element !== null &&
    "type" in element &&
    element.type === "tag"
  );
}

function isErrorBoundaryElement(element: JSXTE.TagElement): element is {
  type: "tag";
  tag: JSXTE.ClassComponent;
  props: JSXTE.ElementProps;
} {
  return (
    typeof element.tag === "function" &&
    ErrorBoundary._isErrorBoundary(element.tag)
  );
}

function asyncError(): never {
  throw new JsxteRenderError(
    "Encountered an async Component: Asynchronous Component's cannot be parsed by this renderer.",
  );
}

class ElementMatcher<T> {
  private stringTagHandler!: OnStringTagHandler<T>;
  private functionTagHandler!: OnFunctionTagHandler<T>;
  private classTagHandler!: OnClassTagHandler<T>;
  private fragmentHandler!: OnFragmentHandler<T>;
  private textHandler!: OnTextNodeHandler<T>;
  private primitiveHandler!: OnPrimitiveHandler<T>;
  private handleError!: ErrorHandler<T>;

  constructor(private options: RendererOptions) {}

  private matchSyncElem(
    element: JSX.SyncElement,
    context: RenderingContext,
  ): RendererResult<T> {
    // eslint-disable-next-line
    switch (typeof element) {
      case "string":
      case "bigint":
      case "number":
        return this.primitiveHandler(element, context, element);
      case "boolean":
      case "function":
      case "symbol":
      case "undefined":
        return NIL;
    }

    if (element === null) {
      return NIL;
    }

    if (element.type === "textNode") {
      return this.textHandler(element, context, element);
    }

    if (element.type === "tag") {
      if (typeof element.tag === "string") {
        if (element.tag === "") {
          return this.fragmentHandler(element.props.children, context, element);
        }
        return this.stringTagHandler(
          {
            tag: element.tag,
            props: element.props,
          },
          context,
          element,
        );
      }
      if (typeof element.tag === "function") {
        if (ErrorBoundary._isErrorBoundary(element.tag)) {
          return this.classTagHandler(
            {
              classComponent: element.tag,
              props: element.props,
            },
            context,
            element,
          );
        } else {
          return this.functionTagHandler(
            {
              funcComponent: element.tag as JSXTE.FunctionalComponent,
              props: element.props,
            },
            context,
            element,
          );
        }
      }
    }

    return NIL;
  }

  private createHandler<
    F extends (
      _: any,
      context: RenderingContext,
      element: JSX.Element,
    ) => RendererResult<T>,
  >(func: F) {
    return (...args: Parameters<F>): RendererResult<T> => {
      try {
        const result = func.apply(null, args);
        if (result instanceof Promise) {
          return result.catch((err) => {
            return this.handleError(err, args[2], args[1]);
          });
        }
        return result;
      } catch (err) {
        return this.handleError(err, args[2], args[1]);
      }
    };
  }

  functionTag(on: OnFunctionTagHandler<T>) {
    this.functionTagHandler = this.createHandler(on);
    return this;
  }

  classTag(on: OnClassTagHandler<T>) {
    this.classTagHandler = this.createHandler(on);
    return this;
  }

  stringTag(on: OnStringTagHandler<T>) {
    this.stringTagHandler = this.createHandler(on);
    return this;
  }

  fragment(on: OnFragmentHandler<T>) {
    this.fragmentHandler = this.createHandler(on);
    return this;
  }

  text(on: OnTextNodeHandler<T>) {
    this.textHandler = this.createHandler(on);
    return this;
  }

  primitive(on: OnPrimitiveHandler<T>) {
    this.primitiveHandler = this.createHandler(on);
    return this;
  }

  onError(on: ErrorHandler<T>) {
    this.handleError = on;
    return this;
  }

  match(element: JSX.Element, context: RenderingContext): RendererResult<T> {
    if (element instanceof Promise) {
      if (this.options.allowAsync === false) {
        asyncError();
      }
      return element.then((element) => {
        return this.matchSyncElem(element, {
          componentApi: ComponentApi.clone(context.componentApi),
        });
      });
    }

    return this.matchSyncElem(element, {
      componentApi: ComponentApi.clone(context.componentApi),
    });
  }

  matchMap(
    elements: JSX.Element[],
    mapFn: <V>(
      element: JSX.Element,
      cont: (element: JSX.Element, context: RenderingContext) => V,
    ) => V,
  ): T[] | Promise<T[]> {
    const results: T[] = [];
    const awaits: Promise<any>[] = [];
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]!;
      const r = mapFn(element, (element, context) =>
        this.match(element, context),
      );
      if (r instanceof Promise) {
        if (this.options.allowAsync === false) {
          asyncError();
        }

        awaits.push(
          r.then((result: T | NIL) => {
            if (result !== NIL) {
              results[i] = result;
            }
          }),
        );
      } else if (r !== NIL) {
        results[i] = r;
      }
    }

    if (awaits.length === 0) {
      return results;
    }

    return Promise.all(awaits).then(() => {
      return results;
    });
  }
}

export class JsxteRenderer<T> {
  private matcher: ElementMatcher<T>;

  constructor(
    private generator: ElementGenerator<T>,
    private options: RendererOptions = { allowAsync: false },
    private rootComponentApi: ComponentApi = ComponentApi.create(),
  ) {
    this.matcher = new ElementMatcher(options);
    const renderer = this;
    this.matcher
      .functionTag((tagElement, context) => {
        const elem = tagElement.funcComponent(
          tagElement.props,
          context.componentApi,
        );
        return renderer.renderChild(elem, context);
      })
      .classTag((tagElement, context) => {
        const compoentInstance = new tagElement.classComponent(
          tagElement.props,
        );
        const elem = compoentInstance.render(
          tagElement.props,
          context.componentApi,
        );
        return renderer.renderChild(elem, context);
      })
      .stringTag((tagElement, context) => {
        const { attributes, children } = this.resolveProps(tagElement.props);

        const renderedChildren = this.matcher.matchMap(
          children,
          (child, next) =>
            next(child, {
              componentApi: ComponentApi.clone(context.componentApi),
            }),
        );

        return this.generator.createElement(
          tagElement.tag,
          attributes,
          // assume generator accepts promises of T[] (allowAsync is true)
          renderedChildren as T[],
        );
      })
      .fragment((fragmentElement, context) => {
        const childrenArray = Array.isArray(fragmentElement)
          ? fragmentElement.flat(1)
          : [fragmentElement];

        const renderedChildren = this.matcher.matchMap(
          childrenArray,
          (child, next) =>
            next(child, {
              componentApi: ComponentApi.clone(context.componentApi),
            }),
        );

        // assume generator accepts promises of T[] (allowAsync is true)
        return this.generator.createFragment(renderedChildren as T[]);
      })
      .text((textNode) => {
        return this.generator.createTextNode(textNode.text);
      })
      .primitive((primitive) => {
        return this.generator.createTextNode(primitive);
      })
      .onError((err, element, context) => {
        if (!isTagElement(element)) {
          throw err;
        }

        if (isErrorBoundaryElement(element)) {
          return this.renderChild(
            {
              type: "tag",
              tag: function ErrorHandler() {
                const component = new element.tag(element.props);
                return component.onError!(
                  err,
                  element.props,
                  context.componentApi,
                );
              },
              props: {},
            },
            context,
          );
        }

        if (!JsxteRenderError.is(err)) {
          throw new JsxteRenderError(
            "Rendering has failed due to an error: " + getErrorMessage(err),
            getComponentName(element),
          );
        }

        err.pushParent(getComponentName(element));
        throw err;
      });
  }

  private mapAttributeName(attributeName: string): string {
    if (
      this.options.attributeMap &&
      attributeName in this.options.attributeMap
    ) {
      return this.options.attributeMap[attributeName]!;
    }
    return attributeName;
  }

  private resolveProps({
    children,
    ...props
  }: JSXTE.ElementProps): ResolvedProps {
    const rprops: ResolvedProps = {
      attributes: [],
      children: [],
    };

    if (children) {
      if (Array.isArray(children)) {
        rprops.children = children.flat(1);
      } else {
        rprops.children = [children];
      }
    }

    const entries = Object.entries(props);
    for (let i = 0; i < entries.length; i++) {
      const [name, value] = entries[i]!;
      rprops.attributes.push([this.mapAttributeName(name), value]);
    }

    return rprops;
  }

  private renderChild(
    element: JSX.Element,
    context: RenderingContext,
  ): RendererResult<T> {
    if (element === null) {
      return NIL;
    }

    return this.matcher.match(element, context);
  }

  render(element: JSX.Element): T {
    const result = this.renderChild(element, {
      componentApi: this.rootComponentApi,
    });
    if (result === NIL) {
      return this.generator.createTextNode("");
    }
    if (result instanceof Promise) {
      return result.then((result) => {
        if (result === NIL) {
          return this.generator.createTextNode("");
        }
        return result;
      }) as any;
    }
    return result as any;
  }
}
