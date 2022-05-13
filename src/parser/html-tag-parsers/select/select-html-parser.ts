import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class SelectHTMLParser extends HTMLElement {
  static readonly tag = "select";

  static attributes = {
    autofocus: "autofocus",
    disabled: "disabled",
    form: "form",
    multiple: "multiple",
    name: "name",
    required: "required",
    size: "size",
  } as const;

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
