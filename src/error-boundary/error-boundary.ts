import type { ContextMap } from "../context-map/context-map";

export type ErrorBoundaryElement = new () => Pick<
  ErrorBoundary,
  keyof ErrorBoundary
>;

export abstract class ErrorBoundary {
  /** @internal */
  static _isErrorBoundary(o: any): o is ErrorBoundaryElement {
    const canBeClass = typeof o === "function";
    const isNotNull = o !== null;

    if (!canBeClass || !isNotNull) return false;

    const baseName = (o as any as typeof ErrorBoundary)._baseName;
    return baseName === this._baseName;
  }

  private static _baseName = "ErrorBoundary";

  constructor() {}

  abstract render(
    props: JSXTE.ElementProps,
    contextMap: ContextMap
  ): JSX.Element | Promise<JSX.Element>;

  abstract onError(
    error: unknown,
    originalProps: JSXTE.ElementProps,
    contextMap: ContextMap
  ): JSX.Element;
}
