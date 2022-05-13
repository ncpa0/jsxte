import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class LiHTMLParser extends HTMLElement {
  static readonly tag = "li";

  static attributes = {
    value: "value",
  } as const;

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
