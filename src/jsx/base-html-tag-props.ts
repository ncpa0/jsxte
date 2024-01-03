import type { ComponentApi } from "../component-api/component-api";

type Rewrap<T extends object> = T extends infer OBJ
  ? {
      [K in keyof OBJ]: OBJ[K] extends infer O ? O : never;
    }
  : never;

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

    interface FunctionalComponent<P extends object = {}> {
      (props: P, contextMap: ComponentApi): JSX.Element;
    }

    interface ClassComponent<P extends object = {}> {
      new (props: P): {
        props: P;
        render(props: P, contextMap: ComponentApi): JSX.Element;
        onError(
          error: unknown,
          originalProps: P,
          contextMap: ComponentApi,
        ): JSX.Element;
      };
    }

    type TagElement = {
      type: "tag";
      tag:
        | FunctionalComponent<ElementProps>
        | ClassComponent<ElementProps>
        | string;
      props: ElementProps;
    };

    type TextNodeElement = {
      type: "textNode";
      text: string;
    };

    type SyncElement = TagElement | TextNodeElement;

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
      props: PropsWithChildren<P>,
      contextMap: ComponentApi,
    ) => JSX.Element;

    type AsyncComponent<P extends object = {}> = (
      props: PropsWithChildren<P>,
      contextMap: ComponentApi,
    ) => Promise<JSX.Element>;

    interface BaseHTMLTagProps {
      children?: ElementChildren;

      accesskey?: string;
      class?: string;
      contenteditable?: AttributeBool;
      dir?: "ltr" | "rtl" | "auto";
      draggable?: AttributeBool | "auto";
      hidden?: AttributeBool;
      id?: string;
      inert?: AttributeBool;
      is?: string;
      lang?: string;
      onabort?: string;
      onafterprint?: string;
      onanimationend?: string;
      onanimationiteration?: string;
      onanimationstart?: string;
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
      onfocusin?: string;
      onfocusout?: string;
      onfullscreenchange?: string;
      onfullscreenerror?: string;
      ongotpointercapture?: string;
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
      onlostpointercapture?: string;
      onmessage?: string;
      onmousedown?: string;
      onmouseenter?: string;
      onmouseleave?: string;
      onmousemove?: string;
      onmouseout?: string;
      onmouseover?: string;
      onmouseup?: string;
      onmousewheel?: string;
      onoffline?: string;
      ononline?: string;
      onopen?: string;
      onpagehide?: string;
      onpageshow?: string;
      onpaste?: string;
      onpause?: string;
      onplay?: string;
      onplaying?: string;
      onpointercancel?: string;
      onpointerdown?: string;
      onpointerenter?: string;
      onpointerleave?: string;
      onpointermove?: string;
      onpointerout?: string;
      onpointerover?: string;
      onpointerup?: string;
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
      onshow?: string;
      onstalled?: string;
      onstorage?: string;
      onsubmit?: string;
      onsuspend?: string;
      ontimeupdate?: string;
      ontoggle?: string;
      ontouchcancel?: string;
      ontouchend?: string;
      ontouchmove?: string;
      ontouchstart?: string;
      ontransitionend?: string;
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
