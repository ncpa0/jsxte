import type { ElementStruct } from "../../../jsx/jsx.types";
import { BaseHTMLParser } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";
import type { InputHTMLAttributes } from "./input-attributes.types";
import type { InputHTMLEvents } from "./input-events.types";

const createAttributeMap = <
  T extends Record<keyof InputHTMLAttributes, string>
>(
  v: T
): T => v;

const createEventMap = <T extends Record<keyof InputHTMLEvents, string>>(
  v: T
): T => v;

export class InputHTMLParser extends BaseHTMLParser {
  static readonly tag = "input";

  static attributes = createAttributeMap({
    type: "type",
    value: "value",
  });

  static events = createEventMap({
    onChange: "change",
    onInput: "input",
  });

  static parse(template: ElementStruct): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
