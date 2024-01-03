import { mapAttributeName } from "../utilities/map-attribute-name";
import type { HTMLElementStruct, RendererHTMLAttributes } from "./types";

export class HTMLElementResolver {
  private attributeMap: Record<string, string> = {};

  constructor(attributeMap: Record<string, string>) {
    this.attributeMap = attributeMap;
  }

  resolveAttributes(element: JSXTE.TagElement): RendererHTMLAttributes {
    const attributes: HTMLElementStruct["attributes"] = [];
    const entries = Object.entries(element.props);
    for (let i = 0; i < entries.length; i++) {
      const [key, prop] = entries[i]!;
      if (key !== "children") {
        attributes.push([mapAttributeName(key, this.attributeMap), prop]);
      }
    }

    return attributes;
  }

  resolveChildren(element: JSXTE.TagElement): JSX.Element[] {
    if (!element.props.children) return [];

    if (Array.isArray(element.props.children))
      return element.props.children as JSX.Element[];

    return [element.props.children as JSX.Element];
  }

  resolveElement(element: JSXTE.TagElement): HTMLElementStruct {
    const children = this.resolveChildren(element);
    const attributes = this.resolveAttributes(element);

    return {
      tag: element.tag.toString(),
      children,
      attributes,
    };
  }
}
