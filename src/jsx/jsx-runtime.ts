type CreateElementProps = {
  [k: string]: any;
  children?: JSX.ElementChildren;
};

export const createElement = (
  tag: string | ((props: any) => JSX.Element),
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
      props.children = props.children.map((child): JSX.Element => {
        if (typeof child === "string") {
          return { type: "textNode", text: child };
        } else if (typeof child === "number") {
          return { type: "textNode", text: (child as number).toString() };
        }
        return child as JSX.Element;
      });
    }
  }

  return {
    type: "tag",
    // @ts-expect-error
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
