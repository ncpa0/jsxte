import type { ContextMap } from "../context-map/context-map";
import { renderToHtml, renderToHtmlAsync } from "../html-parser/render-to-html";
import { jsx, Fragment } from "../jsx-runtime";
import { Cache } from "./cache";

const ReplaceMap = <P extends { context: ContextMap }>(
  props: JSXTE.PropsWithChildren<P>,
  context: ContextMap
) => {
  context.replace(props.context);
  // @ts-ignore
  return jsx(Fragment, {}, props.children);
};

/**
 * Creates an in-memory cache for the provided component and
 * returns a new component that will shallow compare props
 * provided to it and return a cached html string if the props
 * match those provided in previous renders.
 *
 * Props comparison is shallow, so it's best to avoid using
 * `memo` on components that have objects passed to it as props.
 *
 * Component children are not compared, so if only children
 * change, the component will use the cached html string and not
 * reflect those changes.
 */
export const memo = <P extends object & { children?: any }>(
  Component: (props: P, context: ContextMap) => JSX.Element,
  options?: {
    /** Time in milliseconds. Default: 15 minutes. */
    maxCacheAge?: number;
    /**
     * Whether to use `renderToHtmlAsync` or `renderToHtml` to
     * render this component. Default: `false`.
     */
    renderAsynchronously?: boolean;
  }
) => {
  const { maxCacheAge, renderAsynchronously = false } = options ?? {};

  const cache = new Cache<JSXTE.TextNodeElement>(maxCacheAge);

  if (renderAsynchronously) {
    const MemoComponentAsync = async (
      props: P,
      context: ContextMap
    ): Promise<JSXTE.TextNodeElement> => {
      const { children, ...propsNoChildren } = props;

      const cachedResult = cache.get(propsNoChildren);
      if (cachedResult) return cachedResult;

      const result = await renderToHtmlAsync(
        jsx(
          ReplaceMap,
          { context },
          jsx(Component, { ...propsNoChildren }, children)
        )
      );
      const textNode: JSXTE.TextNodeElement = {
        text: result,
        type: "textNode",
      };
      cache.set(propsNoChildren, textNode);

      return textNode;
    };

    return MemoComponentAsync;
  }

  const MemoComponent = (
    props: P,
    context: ContextMap
  ): JSXTE.TextNodeElement => {
    const { children, ...propsNoChildren } = props;

    const cachedResult = cache.get(propsNoChildren);
    if (cachedResult) return cachedResult;

    const result = renderToHtml(
      jsx(
        ReplaceMap,
        { context },
        jsx(Component, { ...propsNoChildren }, children)
      )
    );
    const textNode: JSXTE.TextNodeElement = {
      text: result,
      type: "textNode",
    };
    cache.set(propsNoChildren, textNode);

    return textNode;
  };

  return MemoComponent;
};
