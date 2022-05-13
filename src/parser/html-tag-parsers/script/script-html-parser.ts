import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class ScriptHTMLParser extends HTMLElement {
  static readonly tag = "script";

  static attributes = {
    async: "async",
    crossorigin: "crossorigin",
    defer: "defer",
    integrity: "integrity",
    nomodule: "nomodule",
    referrerpolicy: "referrerpolicy",
    src: "src",
    type: "type",
  } as const;

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
