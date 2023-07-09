import type { ComponentApi } from "../component-api/component-api";

type CreateElementProps = {
  [k: string]: any;
  children?: JSXTE.ElementChildren;
};

export const createElement = (
  tag:
    | string
    | ((props: any, contextMap: ComponentApi) => JSX.Element)
    | ((props: any, contextMap: ComponentApi) => Promise<JSX.Element>),
  props?: CreateElementProps,
  ...children: Array<
    JSX.Element | string | number | Array<JSX.Element | string | number>
  >
): JSX.Element => {
  props ??= {};

  if (children) {
    props.children = [
      ...(props.children
        ? Array.isArray(props.children)
          ? props.children.flat(2)
          : [props.children]
        : []),
      ...children.flat(2),
    ];
  }

  if (props?.children) {
    if (typeof props.children === "string") {
      props.children = { type: "textNode", text: props.children };
    } else if (typeof props.children === "number") {
      props.children = {
        type: "textNode",
        text: (props.children as number).toString(),
      };
    } else if (Array.isArray(props.children)) {
      props.children = props.children.reduce(
        (cl: JSX.Element[], child): JSX.Element[] => {
          if (
            typeof child === "boolean" ||
            child === null ||
            child === undefined
          ) {
            return cl;
          } else if (typeof child === "string") {
            cl.push({ type: "textNode", text: child });
            return cl;
          } else if (typeof child === "number") {
            cl.push({ type: "textNode", text: (child as number).toString() });
            return cl;
          }
          cl.push(child as JSX.Element);
          return cl;
        },
        []
      );
    } else if (
      typeof props.children === "boolean" ||
      props.children === null ||
      props.children === undefined
    ) {
      props.children = [];
    }
  }

  return {
    type: "tag",
    // @ts-expect-error
    tag,
    props: props as JSXTE.ElementProps,
  };
};

export const jsx = createElement;
export const jsxs = jsx;
export const _jsx = jsx;
export const _jsxs = jsx;

export const Fragment = "";
export const _Fragment = Fragment;
