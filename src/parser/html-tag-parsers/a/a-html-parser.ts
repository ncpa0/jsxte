import type { ElementStruct } from "../../../jsx/jsx.types";
import { BaseHTMLParser } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";
import type { AHTMLAttributes } from "./a-attributes.types";

const createAttributeMap = <T extends Record<keyof AHTMLAttributes, string>>(
  v: T
): T => v;

export class AHTMLParser extends BaseHTMLParser {
  static readonly tag = "a";

  static attributes = createAttributeMap({
    media: "media",
    rel: "rel",
    target: "target",
    download: "download",
    href: "href",
  } as const);

  static events: Record<string, string> = {};

  static parse(template: ElementStruct): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
