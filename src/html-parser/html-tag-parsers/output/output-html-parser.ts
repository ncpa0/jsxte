import type { JSXSyncElem } from "../../../jsx/jsx.types";
import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class OutputHTMLParser extends HTMLElement {
  static readonly tag = "output";

  static attributes: Record<string, string> = {};

  static toStruct(template: JSXSyncElem): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
