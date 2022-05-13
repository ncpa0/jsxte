import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class OptionHTMLParser extends HTMLElement {
  static readonly tag = "option";

  static attributes = {
    disabled: "disabled",
    label: "label",
    selected: "selected",
    value: "value",
  } as const;

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
