import type { ElementStruct } from "../../../jsx/jsx.types";
import { BaseHTMLParser } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";
import type { ButtonHTMLAttributes } from "./button-attributes.types";

const createAttributeMap = <
  T extends Record<keyof ButtonHTMLAttributes, string>
>(
  v: T
): T => v;

export class ButtonHTMLParser extends BaseHTMLParser {
  static readonly tag = "button";

  static attributes = createAttributeMap({
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
  } as const);

  static events: Record<string, string> = {};

  static parse(template: ElementStruct): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
