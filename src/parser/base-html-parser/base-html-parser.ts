import type { ElementStruct } from "../../jsx/jsx.types";
import { State } from "../../state/state";
import { isObjectKey } from "../../utilities/is-object-key";
import type { HTMLElementStruct } from "../types";
import type { BaseHTMLAttributes } from "./attributes.types";
import type { BaseHTMLEvents } from "./events.types";

const createEventMap = <T extends Record<keyof BaseHTMLEvents, string>>(
  v: T
): T => v;

const createAttributeMap = <T extends Record<keyof BaseHTMLAttributes, string>>(
  v: T
): T => v;

export class BaseHTMLParser {
  static readonly tag: string = "";

  private static baseEvents = createEventMap({
    onClick: "click",
    onDrag: "drag",
    onDragEnd: "dragend",
    onDragEnter: "dragenter",
    onDragLeave: "dragleave",
    onDragOver: "dragover",
    onDragStart: "dragstart",
    onMouseDown: "mousedown",
    onMouseEnter: "mouseenter",
    onMouseLeave: "mouseleave",
    onMouseMove: "mousemove",
    onMouseOut: "mouseout",
    onMouseOver: "mouseover",
    onMouseUp: "mouseup",
    onTouchCancel: "touchcancel",
    onTouchEnd: "touchend",
    onTouchMove: "touchmove",
    onTouchStart: "touchstart",
  } as const);
  static events: Record<string, string> = {};

  private static baseAttributes = createAttributeMap({
    class: "class",
    draggable: "draggable",
    id: "id",
    lang: "lang",
    slot: "slot",
    style: "style",
    title: "title",
  } as const);
  static attributes: Record<string, string> = {};

  static resolveEvents(template: ElementStruct): HTMLElementStruct["events"] {
    const eventListeners: HTMLElementStruct["events"] = [];

    for (const [key, prop] of Object.entries(template.props)) {
      if (isObjectKey(key, this.baseEvents)) {
        const eventName = this.baseEvents[key];
        eventListeners.push([eventName, prop]);
      }
      if (isObjectKey(key, this.events)) {
        const eventName = this.events[key]!;
        eventListeners.push([eventName, prop]);
      }
    }

    return eventListeners;
  }

  static resolveAttributes(
    template: ElementStruct
  ): HTMLElementStruct["attributes"] {
    const attributes: HTMLElementStruct["attributes"] = [];

    for (const [key, prop] of Object.entries(template.props)) {
      if (isObjectKey(key, this.baseAttributes)) {
        const attributeName = this.baseAttributes[key];
        attributes.push([attributeName, prop]);
      }
      if (isObjectKey(key, this.attributes)) {
        const attributeName = this.attributes[key]!;
        attributes.push([attributeName, prop]);
      }
    }

    return attributes;
  }

  static resolveInnerText(
    template: ElementStruct
  ): State<string> | string | undefined {
    if (
      template.props.children &&
      (typeof template.props.children === "string" ||
        (State.isStateInstance(template.props.children) &&
          typeof template.props.children.value() === "string"))
    ) {
      return template.props.children as string | State<string>;
    }
    return undefined;
  }

  static resolveChildren(
    template: ElementStruct
  ): HTMLElementStruct["children"] {
    if (!template.props.children) return [];

    if (Array.isArray(template.props.children))
      return template.props.children.filter(
        (e): e is ElementStruct =>
          typeof e !== "string" &&
          !(State.isStateInstance(e) && typeof e.value() === "string")
      );

    if (State.isStateInstance(template.props.children)) {
      if (typeof template.props.children.value() !== "string") {
        return template.props.children as State<ElementStruct[]>;
      } else {
        return [];
      }
    }

    return [template.props.children].filter(
      (e): e is ElementStruct =>
        typeof e !== "string" &&
        !(State.isStateInstance(e) && typeof e.value() === "string")
    );
  }

  static resolveKey(template: ElementStruct): any {
    return template.props.key;
  }

  static resolveElement(template: ElementStruct): HTMLElementStruct {
    const children = this.resolveChildren(template);
    const attributes = this.resolveAttributes(template);
    const events = this.resolveEvents(template);
    const text = this.resolveInnerText(template);
    const key = this.resolveKey(template);

    return {
      tag: this.tag,
      key,
      children,
      attributes,
      events,
      text,
    };
  }
}
