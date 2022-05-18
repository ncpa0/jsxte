import type { JSXSyncElem } from "../../../jsx/jsx.types";
import { HTMLElement } from "../../base-html-parser/base-html-parser";
import type { HTMLElementStruct } from "../../types";

export class VideoHTMLParser extends HTMLElement {
  static readonly tag = "video";

  static attributes = {
    autoplay: "autoplay",
    controls: "controls",
    height: "height",
    loop: "loop",
    muted: "muted",
    poster: "poster",
    preload: "preload",
    src: "src",
    width: "width",
  } as const;

  static toStruct(template: JSXSyncElem): HTMLElementStruct {
    return this.resolveElement(template);
  }
}
