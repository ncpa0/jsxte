import type { ElemOrList } from "./jsx.types";

type CreateElementProps = {
  [k: string]: any;
  children?: ElemOrList<JSX.Element | string> | undefined;
};

export const createElement = (
  tag: string,
  props?: CreateElementProps,
  ...children: Array<ElemOrList<JSX.Element | string>>
): JSX.Element => {
  props ??= {};

  if (children) {
    props.children = [
      ...(props.children
        ? Array.isArray(props.children)
          ? props.children
          : [props.children]
        : []),
      ...children.flat(),
    ];
  }

  if (props?.children) {
    if (typeof props.children === "string") {
      props.children = { type: "textNode", text: props.children };
    } else if (Array.isArray(props.children)) {
      props.children = props.children.map((child): JSX.Element => {
        if (typeof child === "string") {
          return { type: "textNode", text: child };
        }
        return child;
      });
    }
  }

  return {
    type: "tag",
    tag,
    props: props as JSX.ElementProps,
  };
};

export const jsx = createElement;
export const jsxs = jsx;
export const _jsx = jsx;
export const _jsxs = jsx;

export const Fragment = "";
export const _Fragment = Fragment;
