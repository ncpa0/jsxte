import type { JSXSyncElem } from "../../../jsx/jsx.types";
import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class MetaHTMLParser extends HTMLElement {
  static readonly tag = "meta";

  static readonly attributes = {
    "http-equiv": "http-equiv",
    charset: "charset",
    content: "content",
    name: "name",
  } as const;

  static toStruct(template: JSXSyncElem): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
