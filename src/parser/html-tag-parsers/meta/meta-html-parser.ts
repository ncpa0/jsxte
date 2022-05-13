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

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
