import type { Rewrap } from "../html-parser/types";

export type AttributeBool = true | false | "true" | "false";

export type HTMLProps<T extends object = never> = Rewrap<
  ExtendBaseProps<
    [T] extends [never]
      ? JSXTE.BaseHTMLTagProps
      : Partial<T> & JSXTE.BaseHTMLTagProps
  >
>;

type ExtendBaseProps<P> = {
  [K in keyof P]: JSXTE.AttributeAcceptedTypes extends {
    [E in K]: infer T;
  }
    ? T | P[K]
    : P[K];
};

declare global {
  namespace JSXTE {
    interface AttributeAcceptedTypes {}

    export type TagElement = {
      type: "tag";
      tag:
        | string
        | ((props: ElementProps) => Element)
        | ((props: ElementProps) => Promise<Element>);
      props: ElementProps;
    };

    export type TextNodeElement = {
      type: "textNode";
      text: string;
    };

    export type SyncElement = TagElement | TextNodeElement;

    type ElementChildren =
      | JSX.Element
      | string
      | number
      | Array<
          JSX.Element | string | number | Array<JSX.Element | string | number>
        >;

    type ElementProps = {
      children?: ElementChildren;
      [k: string]: any;
    };

    type PropsWithChildren<P extends object> = P & {
      children?: JSXTE.ElementChildren;
    };

    type Component<P extends object = {}> = (
      props: PropsWithChildren<P>
    ) => JSX.Element;

    type AsyncComponent<P extends object = {}> = (
      props: PropsWithChildren<P>
    ) => Promise<JSX.Element>;

    export interface BaseHTMLTagProps {
      children?: ElementChildren;

      accesskey?: string;
      class?: string;
      contenteditable?: AttributeBool;
      dir?: "ltr" | "rtl" | "auto";
      draggable?: AttributeBool | "auto";
      hidden?: AttributeBool;
      id?: string;
      inert?: AttributeBool;
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
      role?: string;
      slot?: string;
      spellcheck?: AttributeBool;
      style?: string;
      tabindex?: string | number;
      title?: string;
      translate?: "yes" | "no";
    }
  }
}
