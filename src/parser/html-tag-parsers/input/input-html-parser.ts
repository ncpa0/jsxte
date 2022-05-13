import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class InputHTMLParser extends HTMLElement {
  static readonly tag = "input";

  static attributes = {
    accept: "accept",
    alt: "alt",
    autocomplete: "autocomplete",
    autofocus: "autofocus",
    checked: "checked",
    dirname: "dirname",
    disabled: "disabled",
    form: "form",
    formaction: "formaction",
    formenctype: "formenctype",
    formmethod: "formmethod",
    formnovalidate: "formnovalidate",
    formtarget: "formtarget",
    height: "height",
    list: "list",
    max: "max",
    maxlength: "maxlength",
    min: "min",
    minlength: "minlength",
    multiple: "multiple",
    name: "name",
    pattern: "pattern",
    placeholder: "placeholder",
    readonly: "readonly",
    required: "required",
    size: "size",
    src: "src",
    step: "step",
    type: "type",
    value: "value",
    width: "width",
  } as const;

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
