import type { Rewrap } from "../types";
import type { BaseHTMLAttributes } from "./attributes.types";

export type BaseHTMLProps<T extends object = never> = Rewrap<
  [T] extends [never] ? BaseHTMLAttributes : Partial<T> & BaseHTMLAttributes
>;
