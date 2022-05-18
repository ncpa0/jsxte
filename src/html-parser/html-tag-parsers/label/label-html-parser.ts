import type { JSXSyncElem } from "../../../jsx/jsx.types";
import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class LabelHTMLParser extends HTMLElement {
  static readonly tag = "label";

  static attributes = {
    for: "for",
    from: "from",
  } as const;

  static toStruct(template: JSXSyncElem): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
