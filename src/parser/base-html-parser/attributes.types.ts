import type { HTMLElement } from "./base-html-parser";

type HTMLAttributeNames = keyof typeof HTMLElement["baseAttributes"];

export type BaseHTMLAttributes = {
  children?: JSX.ElementChildren;
} & {
  [K in HTMLAttributeNames]?: string;
};
