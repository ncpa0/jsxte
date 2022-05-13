import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class ColgroupHTMLParser extends HTMLElement {
  static readonly tag = "colgroup";

  static attributes = {
    span: "span",
  } as const;

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
