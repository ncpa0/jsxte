import type { JSXTagElem } from "../../jsx/jsx.types";
import { mapAttributeName } from "../../string-template-parser/map-attribute-name";
import type { HTMLElementStruct, RendererHTMLAttributes } from "../types";

export class HTMLElementResolver {
  private attributeMap: Record<string, string> = {};

  constructor(attributeMap: Record<string, string>) {
    this.attributeMap = attributeMap;
  }

  resolveAttributes(element: JSXTagElem): RendererHTMLAttributes {
    const attributes: HTMLElementStruct["attributes"] = [];

    for (const [key, prop] of Object.entries(element.props)) {
      if (key !== "children") {
        attributes.push([mapAttributeName(key, this.attributeMap), prop]);
      }
    }

    return attributes;
  }

  resolveChildren(element: JSXTagElem): JSX.Element[] {
    if (!element.props.children) return [];

    if (Array.isArray(element.props.children))
      return element.props.children as JSX.Element[];

    return [element.props.children as JSX.Element];
  }

  resolveElement(element: JSXTagElem): HTMLElementStruct {
    const children = this.resolveChildren(element);
    const attributes = this.resolveAttributes(element);

    return {
      tag: element.tag.toString(),
      children,
      attributes,
    };
  }
}
