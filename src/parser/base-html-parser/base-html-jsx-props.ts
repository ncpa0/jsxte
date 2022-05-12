import type { HTMLPropsFor, Rewrap } from "../types";
import type { BaseHTMLAttributes } from "./attributes.types";
import type { BaseHTMLEvents } from "./events.types";

export type BaseHTMLProps<T extends object = never> = Rewrap<
  ([T] extends [never]
    ? HTMLPropsFor<BaseHTMLAttributes, BaseHTMLEvents>
    : Partial<T> & HTMLPropsFor<BaseHTMLAttributes, BaseHTMLEvents>) & {
    key?: any;
  }
>;
