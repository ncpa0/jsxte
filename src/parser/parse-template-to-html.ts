import type { ElementStruct } from "../jsx/jsx.types";
import { DOMFragment } from "./dom-fragment/dom-fragment";
import { getHTMLStruct } from "./get-html-struct";
import { bindAttributes } from "./state-binders/bind-attributes";
import { bindChildren } from "./state-binders/bind-children";
import { bindEventListeners } from "./state-binders/bind-event-listeners";
import { bindInnerText } from "./state-binders/bind-inner-text";

export type ParsingResult = {
  element: HTMLElement | DOMFragment;
  destroy(): void;
};

export const parseTemplateToHTML = (
  jsxTemplate: ElementStruct
): ParsingResult => {
  if (typeof jsxTemplate.tag === "string") {
    const htmlStruct = getHTMLStruct(jsxTemplate);
    if (jsxTemplate.tag === "") {
      const element = new DOMFragment();

      const childrenBinds = bindChildren(element, htmlStruct.children);

      return {
        element,
        destroy() {
          childrenBinds.unbind();
        },
      };
    } else {
      const element = document.createElement(jsxTemplate.tag);

      const attributesBinds = bindAttributes(element, htmlStruct);
      const eventsBinds = bindEventListeners(element, htmlStruct);
      const innerTextBinds = bindInnerText(element, htmlStruct);
      const childrenBinds = bindChildren(element, htmlStruct.children);

      return {
        element,
        destroy() {
          attributesBinds.unbind();
          eventsBinds.unbind();
          innerTextBinds.unbind();
          childrenBinds.unbind();
        },
      };
    }
  }

  const template = jsxTemplate.tag(jsxTemplate.props);

  return parseTemplateToHTML(template);
};
