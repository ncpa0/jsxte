import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class ThHTMLParser extends HTMLElement {
  static readonly tag = "th";

  static attributes = {
    abbr: "abbr",
    colspan: "colspan",
    headers: "headers",
    rowspan: "rowspan",
    scope: "scope",
  } as const;

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
