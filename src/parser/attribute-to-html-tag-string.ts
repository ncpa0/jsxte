import type { RendererHTMLAttributes } from "./types";

export const attributeToHtmlTagString = ([key, value]: [
  string,
  string | number | undefined
]): string => {
  if (value === undefined) {
    return `${key}`;
  }
  return `${key}="${value.toString().replace(/"/g, "&quot;")}"`;
};

export const mapAttributesToHtmlTagString = (
  attributes: RendererHTMLAttributes
): string[] => {
  return attributes.map(attributeToHtmlTagString);
};
