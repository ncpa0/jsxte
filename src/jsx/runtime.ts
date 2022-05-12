export const createElement = (
  tag: string,
  props: Record<string, any>, // TODO: typings
  key?: any
): JSX.Element => {
  props.key = key;
  return {
    tag,
    props,
  };
};

export const jsx = createElement;
export const jsxs = jsx;
export const _jsx = jsx;
export const _jsxs = jsx;

export const Fragment = "";
export const _Fragment = Fragment;
