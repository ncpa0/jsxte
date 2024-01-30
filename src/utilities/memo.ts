import type { ComponentApi } from "../component-api/component-api";
import { createElement } from "../jsx-runtime";
import { Cache } from "./cache";

/**
 * Creates an in-memory cache for the provided component and returns a new
 * component that will shallow compare props provided to it and return a cached
 * html string if the props match those provided in previous renders.
 *
 * Props comparison is shallow, so it's best to avoid using `memo` on components
 * that have objects passed to it as props.
 *
 * Component children are not compared, so if only children change, the
 * component will use the cached html string and not reflect those changes.
 */
export const memo = <P extends object & { children?: any }>(
  Component: (props: P, context: ComponentApi) => JSX.Element,
  options?: {
    /**
     * Time in milliseconds. Default: 15 minutes.
     */
    maxCacheAge?: number;
    /**
     * Whether to use `renderToHtmlAsync` or `renderToHtml` to render this
     * component. Default: `false`.
     */
    renderAsynchronously?: boolean;
    /**
     * Maximum number of cached entries to keep in memory. Default: 10.
     */
    maxCacheEntries?: number;
  },
) => {
  const {
    maxCacheAge,
    maxCacheEntries,
    renderAsynchronously = false,
  } = options ?? {};

  const cache = new Cache<JSXTE.TextNodeElement>(maxCacheAge, maxCacheEntries);

  if (renderAsynchronously) {
    const MemoComponentAsync = async (
      props: P,
      context: ComponentApi,
    ): Promise<JSXTE.TextNodeElement> => {
      const { children, ...propsNoChildren } = props;

      const cachedResult = cache.get(propsNoChildren);
      if (cachedResult) return cachedResult;

      const result = (await context.renderAsync(
        createElement(Component, { ...propsNoChildren }, children),
      )).slice(0, -1);

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
    context: ComponentApi,
  ): JSXTE.TextNodeElement => {
    const { children, ...propsNoChildren } = props;

    const cachedResult = cache.get(propsNoChildren);
    if (cachedResult) return cachedResult;

    const result = context.render(
      createElement(Component, { ...propsNoChildren }, children),
    ).slice(0, -1);

    const textNode: JSXTE.TextNodeElement = {
      text: result,
      type: "textNode",
    };
    cache.set(propsNoChildren, textNode);

    return textNode;
  };

  return MemoComponent;
};
