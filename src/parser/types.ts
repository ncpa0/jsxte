import type { ElementStruct } from "../jsx/jsx.types";
import type { EventCallback } from "./base-html-parser/events.types";

export type HTMLElementStruct = {
  tag: string;
  key?: any;
  children: ElementStruct[];
  attributes: [string, string | undefined][];
  events: [string, EventCallback][];
  text: string | undefined;
};

export type Rewrap<T extends object> = T extends infer OBJ
  ? {
      [K in keyof OBJ]: OBJ[K] extends infer O ? O : never;
    }
  : never;

export type HTMLPropsFor<Attributes, Events> = {
  [K in keyof Attributes]?: Attributes[K];
} & {
  [K in keyof Events]?: (e: Events[K]) => void;
};
