import type { RendererHTMLAttributes } from "./types";

export const attributeToHtmlTagString = ([key, value]: [
  string,
  string | undefined
]): string => {
  if (value === undefined) {
    return `${key}`;
  }
  return `${key}="${value.replace('"', '\\"')}"`;
};

export const mapAttributesToHtmlTagString = (
  attributes: RendererHTMLAttributes
): string[] => {
  return attributes.map(attributeToHtmlTagString);
};
