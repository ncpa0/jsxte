import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class ColHTMLParser extends HTMLElement {
  static readonly tag = "col";

  static attributes = {
    span: "span",
  } as const;

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
