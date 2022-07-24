import { HTMLElementResolver } from "./base-html-parser/base-html-parser";

import type { HTMLElementStruct } from "./types";

export const getHTMLStruct = (
  element: JSXTE.TagElement,
  attributeMap: Record<string, string>
): HTMLElementStruct => {
  if (typeof element.tag === "string") {
    return new HTMLElementResolver(attributeMap).resolveElement(element);
  }

  throw new Error("");
};
