import type { HTMLElement } from "./base-html-parser";

type HTMLAttributeNames = keyof typeof HTMLElement["baseAttributes"];

export type BaseHTMLAttributes = {
  children?: JSX.Element | JSX.Element[] | string | string[];
} & {
  [K in HTMLAttributeNames]?: string;
};
