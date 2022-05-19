import type { Rewrap } from "../html-parser/types";

export type AttributeBool = "true" | "false";

export type BaseHTMLTagProps = {
  children?: JSX.ElementChildren;

  accesskey?: string;
  class?: string;
  contenteditable?: AttributeBool;
  dir?: "ltr" | "rtl" | "auto";
  draggable?: AttributeBool | "auto";
  hidden?: AttributeBool;
  id?: string;
  lang?: string;
  onabort?: string;
  onafterprint?: string;
  onbeforeprint?: string;
  onbeforeunload?: string;
  onblur?: string;
  oncanplay?: string;
  oncanplaythrough?: string;
  onchange?: string;
  onclick?: string;
  oncontextmenu?: string;
  oncopy?: string;
  oncuechange?: string;
  oncut?: string;
  ondblclick?: string;
  ondrag?: string;
  ondragend?: string;
  ondragenter?: string;
  ondragleave?: string;
  ondragover?: string;
  ondragstart?: string;
  ondrop?: string;
  ondurationchange?: string;
  onemptied?: string;
  onended?: string;
  onerror?: string;
  onfocus?: string;
  onhashchange?: string;
  oninput?: string;
  oninvalid?: string;
  onkeydown?: string;
  onkeypress?: string;
  onkeyup?: string;
  onload?: string;
  onloadeddata?: string;
  onloadedmetadata?: string;
  onloadstart?: string;
  onmousedown?: string;
  onmousemove?: string;
  onmouseout?: string;
  onmouseover?: string;
  onmouseup?: string;
  onmousewheel?: string;
  onoffline?: string;
  ononline?: string;
  onpagehide?: string;
  onpageshow?: string;
  onpaste?: string;
  onpause?: string;
  onplay?: string;
  onplaying?: string;
  onpopstate?: string;
  onprogress?: string;
  onratechange?: string;
  onreset?: string;
  onresize?: string;
  onscroll?: string;
  onsearch?: string;
  onseeked?: string;
  onseeking?: string;
  onselect?: string;
  onstalled?: string;
  onstorage?: string;
  onsubmit?: string;
  onsuspend?: string;
  ontimeupdate?: string;
  ontoggle?: string;
  onunload?: string;
  onvolumechange?: string;
  onwaiting?: string;
  onwheel?: string;
  slot?: string;
  spellcheck?: AttributeBool;
  style?: string;
  tabindex?: string | number;
  title?: string;
  translate?: "yes" | "no";
};

export type HTMLProps<T extends object = never> = Rewrap<
  ExtendBaseProps<
    [T] extends [never] ? BaseHTMLTagProps : Partial<T> & BaseHTMLTagProps
  >
>;

type ExtendBaseProps<P> = {
  [K in keyof P]: TJSXExtends.AttributeAcceptedTypes extends {
    [E in K]: infer T;
  }
    ? T | P[K]
    : P[K];
};

declare global {
  namespace TJSXExtends {
    interface AttributeAcceptedTypes {}
  }
}
