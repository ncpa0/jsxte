import type { ComponentApi } from "../component-api/component-api";

type CreateElementProps = {
  [k: string]: any;
  children?: JSXTE.ElementChildren;
};

const mapChildren = (
  children: JSXTE.ElementChildren,
  accumulator: JSX.Element[],
) => {
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (typeof children) {
    case "string":
      accumulator.push({ type: "textNode", text: children });
      break;
    case "number":
      accumulator.push({ type: "textNode", text: children.toString() });
      break;
    case "object":
      if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i]!;
          mapChildren(child, accumulator);
        }
      } else if (children != null) {
        accumulator.push(children);
      }
      break;
  }

  return accumulator;
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

  const finalChildren: JSX.Element[] = [];

  for (let i = 0; i < children.length; i++) {
    mapChildren(children[i]!, finalChildren);
  }

  if (props?.children) {
    mapChildren(props.children, finalChildren);
  }

  props.children = finalChildren;

  Object.freeze(finalChildren);
  Object.freeze(props);

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
