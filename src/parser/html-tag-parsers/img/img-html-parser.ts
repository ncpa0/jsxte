import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class ImgHTMLParser extends HTMLElement {
  static readonly tag = "img";

  static attributes = {
    alt: "alt",
    crossorigin: "crossorigin",
    height: "height",
    ismap: "ismap",
    loading: "loading",
    longdesc: "longdesc",
    referrerpolicy: "referrerpolicy",
    sizes: "sizes",
    src: "src",
    srcset: "srcset",
    usemap: "usemap",
    width: "width",
  } as const;

  static toStruct(template: JSX.Element): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
