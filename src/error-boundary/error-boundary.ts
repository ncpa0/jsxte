import type { ContextMap } from "../context-map/context-map";

export type ErrorBoundaryElement<P extends object = {}> = new (
  props: JSXTE.PropsWithChildren<P>
) => Pick<ErrorBoundary<P>, keyof ErrorBoundary>;

export abstract class ErrorBoundary<P extends object = {}> {
  /** @internal */
  static _isErrorBoundary(o: any): o is ErrorBoundaryElement {
    const canBeClass = typeof o === "function";
    const isNotNull = o !== null;

    if (!canBeClass || !isNotNull) return false;

    const baseName = (o as any as typeof ErrorBoundary)._baseName;
    return baseName === this._baseName;
  }

  private static _baseName = "ErrorBoundary";

  constructor(props: JSXTE.PropsWithChildren<P>) {}

  abstract render(
    props: JSXTE.PropsWithChildren<P>,
    contextMap: ContextMap
  ): JSX.Element | Promise<JSX.Element>;

  abstract onError(
    error: unknown,
    originalProps: JSXTE.PropsWithChildren<P>,
    contextMap: ContextMap
  ): JSX.Element;
}