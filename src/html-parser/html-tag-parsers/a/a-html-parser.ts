import type { JSXSyncElem } from "../../../jsx/jsx.types";
import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class AHTMLParser extends HTMLElement {
  static readonly tag = "a";

  static attributes = {
    media: "media",
    rel: "rel",
    target: "target",
    download: "download",
    href: "href",
  } as const;

  static toStruct(template: JSXSyncElem): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
