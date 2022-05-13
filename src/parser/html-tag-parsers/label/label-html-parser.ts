import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class LabelHTMLParser extends HTMLElement {
  static readonly tag = "label";

  static attributes = {
    for: "for",
    from: "from",
  } as const;

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
