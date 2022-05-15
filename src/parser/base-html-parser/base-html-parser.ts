import type { JSXSyncElem, JSXTagElem } from "../../jsx/jsx.types";
import { isObjectKey } from "../../utilities/is-object-key";
import type { HTMLElementStruct, RendererHTMLAttributes } from "../types";

export class HTMLElement {
  static readonly tag: string = "";

  static baseAttributes = {
    class: "class",
    draggable: "draggable",
    id: "id",
    lang: "lang",
    slot: "slot",
    style: "style",
    title: "title",
    onabort: "onabort",
    onafterprint: "onafterprint",
    onbeforeprint: "onbeforeprint",
    onbeforeunload: "onbeforeunload",
    onblur: "onblur",
    oncanplay: "oncanplay",
    oncanplaythrough: "oncanplaythrough",
    onchange: "onchange",
    onclick: "onclick",
    oncontextmenu: "oncontextmenu",
    oncopy: "oncopy",
    oncuechange: "oncuechange",
    oncut: "oncut",
    ondblclick: "ondblclick",
    ondrag: "ondrag",
    ondragend: "ondragend",
    ondragenter: "ondragenter",
    ondragleave: "ondragleave",
    ondragover: "ondragover",
    ondragstart: "ondragstart",
    ondrop: "ondrop",
    ondurationchange: "ondurationchange",
    onemptied: "onemptied",
    onended: "onended",
    onerror: "onerror",
    onfocus: "onfocus",
    onhashchange: "onhashchange",
    oninput: "oninput",
    oninvalid: "oninvalid",
    onkeydown: "onkeydown",
    onkeypress: "onkeypress",
    onkeyup: "onkeyup",
    onload: "onload",
    onloadeddata: "onloadeddata",
    onloadedmetadata: "onloadedmetadata",
    onloadstart: "onloadstart",
    onmousedown: "onmousedown",
    onmousemove: "onmousemove",
    onmouseout: "onmouseout",
    onmouseover: "onmouseover",
    onmouseup: "onmouseup",
    onmousewheel: "onmousewheel",
    onoffline: "onoffline",
    ononline: "ononline",
    onpagehide: "onpagehide",
    onpageshow: "onpageshow",
    onpaste: "onpaste",
    onpause: "onpause",
    onplay: "onplay",
    onplaying: "onplaying",
    onpopstate: "onpopstate",
    onprogress: "onprogress",
    onratechange: "onratechange",
    onreset: "onreset",
    onresize: "onresize",
    onscroll: "onscroll",
    onsearch: "onsearch",
    onseeked: "onseeked",
    onseeking: "onseeking",
    onselect: "onselect",
    onstalled: "onstalled",
    onstorage: "onstorage",
    onsubmit: "onsubmit",
    onsuspend: "onsuspend",
    ontimeupdate: "ontimeupdate",
    ontoggle: "ontoggle",
    onunload: "onunload",
    onvolumechange: "onvolumechange",
    onwaiting: "onwaiting",
    onwheel: "onwheel",
  } as const;

  static attributes: Record<string, string> = {};

  static resolveAttributes(element: JSXSyncElem): RendererHTMLAttributes {
    if (element.type === "textNode") return [];

    const attributes: HTMLElementStruct["attributes"] = [];

    for (const [key, prop] of Object.entries(element.props)) {
      if (key.startsWith("data-") || key.startsWith("aria-")) {
        attributes.push([key, prop?.toString()]);
        continue;
      }
      if (isObjectKey(key, this.baseAttributes)) {
        const attributeName = this.baseAttributes[key];
        attributes.push([attributeName, prop?.toString()]);
        continue;
      }
      if (isObjectKey(key, this.attributes)) {
        const attributeName = this.attributes[key]!;
        attributes.push([attributeName, prop?.toString()]);
        continue;
      }
    }

    return attributes;
  }

  static resolveChildren(element: JSXSyncElem): JSX.Element[] {
    if (element.type === "textNode") return [];

    if (!element.props.children) return [];

    if (Array.isArray(element.props.children))
      return element.props.children as JSX.Element[];

    return [element.props.children as JSX.Element];
  }

  static resolveKey(element: JSXSyncElem): any {
    if (element.type === "textNode") return undefined;
    return element.props.key;
  }

  static resolveElement(element: JSXSyncElem): HTMLElementStruct {
    const children = this.resolveChildren(element);
    const attributes = this.resolveAttributes(element);
    const key = this.resolveKey(element);

    return {
      tag: this.tag,
      key,
      children,
      attributes,
    };
  }

  static resolveWebComponentElement(element: JSXTagElem): HTMLElementStruct {
    const struct = this.resolveElement(element);
    struct.tag = element.tag.toString();

    return struct;
  }
}
