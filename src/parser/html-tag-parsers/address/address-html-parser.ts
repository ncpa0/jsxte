import type { ElementStruct } from "../../../jsx/jsx.types";
import { BaseHTMLParser } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class AddressHTMLParser extends BaseHTMLParser {
  static readonly tag = "address";

  static attributes: Record<string, string> = {};

  static events: Record<string, string> = {};

  static parse(template: ElementStruct): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
