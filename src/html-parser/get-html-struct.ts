import type { JSXTagElem } from "../jsx/jsx.types";
import { HTMLElementResolver } from "./base-html-parser/base-html-parser";

import type { HTMLElementStruct } from "./types";

export const getHTMLStruct = (
  element: JSXTagElem,
  attributeMap: Record<string, string>
): HTMLElementStruct => {
  if (typeof element.tag === "string") {
    return new HTMLElementResolver(attributeMap).resolveElement(element);
  }

  throw new Error("");
};
