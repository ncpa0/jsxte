import type { JSXSyncElem } from "../../../jsx/jsx.types";
import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class LinkHTMLParser extends HTMLElement {
  static readonly tag = "link";

  static attributes = {
    crossorigin: "crossorigin",
    href: "href",
    hreflang: "hreflang",
    media: "media",
    referrerpolicy: "referrerpolicy",
    rel: "rel",
    sizes: "sizes",
    title: "title",
    type: "type",
  };

  static toStruct(template: JSXSyncElem): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
