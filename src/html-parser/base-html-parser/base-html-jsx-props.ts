import type { Rewrap } from "../types";
import type { BaseHTMLAttributes } from "./attributes.types";

export type BaseHTMLProps<T extends object = never> = Rewrap<
  ExtendBaseProps<
    [T] extends [never] ? BaseHTMLAttributes : Partial<T> & BaseHTMLAttributes
  >
>;

type ExtendBaseProps<P> = {
  [K in keyof P]: TJSXExtends.AttributeAcceptedTypes extends {
    [E in K]: infer T;
  }
    ? T | P[K]
    : P[K];
};

declare global {
  namespace TJSXExtends {
    interface AttributeAcceptedTypes {}
  }
}
