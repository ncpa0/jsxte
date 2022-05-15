import type { JSXSyncElem } from "../../../jsx/jsx.types";
import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class ButtonHTMLParser extends HTMLElement {
  static readonly tag = "button";

  static attributes = {
    disabled: "disabled",
    form: "form",
    formaction: "formaction",
    formenctype: "formenctype",
    formmethod: "formmethod",
    formnovalidate: "formnovalidate",
    formtarget: "formtarget",
    name: "name",
    type: "type",
    value: "value",
  } as const;

  static toStruct(template: JSXSyncElem): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
