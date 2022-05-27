import type { RendererHTMLAttributes } from "./types";

export const attributeToHtmlTagString = ([key, value]: [
  string,
  string | boolean | number | undefined
]): string => {
  if (value === undefined || value === true) {
    return `${key}`;
  }
  if (value === false) {
    return "";
  }
  return `${key}="${value?.toString().replace(/"/g, "&quot;")}"`;
};

export const mapAttributesToHtmlTagString = (
  attributes: RendererHTMLAttributes
): string[] => {
  return attributes.map(attributeToHtmlTagString).filter((e) => e);
};
