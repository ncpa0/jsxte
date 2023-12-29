import type { ComponentApi } from "../component-api/component-api";
import type { CreateElementProps } from "./jsx-runtime";
import { Fragment, jsx, jsxs } from "./jsx-runtime";

const jsxDEV = (
  tag:
    | string
    | ((props: any, contextMap: ComponentApi) => JSX.Element)
    | ((props: any, contextMap: ComponentApi) => Promise<JSX.Element>),
  props?: CreateElementProps,
) => {
  const { children, ...restProps } = props ?? {};
  if (Array.isArray(children)) {
    return jsx(tag, restProps, ...children);
  }
  return jsx(tag, restProps, children);
};

export { Fragment, jsx, jsxs, jsxDEV };
