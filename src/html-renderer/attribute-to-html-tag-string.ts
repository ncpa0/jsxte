import { join } from "../utilities/join";

export const attributeToHtmlTagString = ([key, value]: [
  string,
  string | boolean | number | undefined,
]): string => {
  if (value === true) {
    return `${key}`;
  }
  if (value === false || value === null || value === undefined) {
    return "";
  }
  return `${key}="${value.toString().replace(/"/g, "&quot;")}"`;
};

export const mapAttributesToHtmlTagString = (
  attributes: [string, any][],
): string => {
  const results: string[] = [];

  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i]!;
    const html = attributeToHtmlTagString(attribute);
    if (html.length > 0) results.push(html);
  }

  return join(results, " ");
};
