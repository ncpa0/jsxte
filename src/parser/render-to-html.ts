import { jsxElemToHTML } from "./parse-template-to-html";

export const renderToHTML = <P>(
  component: (props: P) => JSX.Element,
  props: P
) => {
  return jsxElemToHTML(component(props));
};
