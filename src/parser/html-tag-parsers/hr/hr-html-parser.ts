import type { ElementStruct } from "../../../jsx/jsx.types";
import { BaseHTMLParser } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class HrHTMLParser extends BaseHTMLParser {
  static readonly tag = "hr";

  static attributes: Record<string, string> = {};

  static events: Record<string, string> = {};

  static parse(template: ElementStruct): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
