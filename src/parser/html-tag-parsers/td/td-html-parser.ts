import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class TdHTMLParser extends HTMLElement {
  static readonly tag = "td";

  static attributes = {
    colspan: "colspan",
    headers: "headers",
    rowspan: "rowspan",
  } as const;

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
