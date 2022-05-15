import type { JSXSyncElem } from "../../../jsx/jsx.types";
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

  static toStruct(template: JSXSyncElem): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
