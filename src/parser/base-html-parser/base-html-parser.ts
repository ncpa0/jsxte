import { isObjectKey } from "../../utilities/is-object-key";
import type { HTMLElementStruct, RendererHTMLAttributes } from "../types";
export class HTMLElement {
  static readonly tag: string = "";

  private static baseAttributes = {
    class: "class",
    draggable: "draggable",
    id: "id",
    lang: "lang",
    slot: "slot",
    style: "style",
    title: "title",
  } as const;
  static attributes: Record<string, string> = {};

  static resolveAttributes(element: JSX.Element): RendererHTMLAttributes {
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

  static resolveChildren(template: JSX.Element): JSX.Element[] {
    if (template.type === "textNode") return [];

    if (!template.props.children) return [];

    if (Array.isArray(template.props.children)) return template.props.children;

    return [template.props.children];
  }

  static resolveKey(template: JSX.Element): any {
    if (template.type === "textNode") return undefined;
    return template.props.key;
  }

  static resolveElement(template: JSX.Element): HTMLElementStruct {
    const children = this.resolveChildren(template);
    const attributes = this.resolveAttributes(template);
    const key = this.resolveKey(template);

    return {
      tag: this.tag,
      key,
      children,
      attributes,
    };
  }
}
