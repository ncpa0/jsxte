export type RendererHTMLAttributes = [string, string | undefined][];

export type HTMLElementStruct = {
  tag: string;
  children: JSX.Element[];
  attributes: RendererHTMLAttributes;
};

export type Rewrap<T extends object> = T extends infer OBJ
  ? {
      [K in keyof OBJ]: OBJ[K] extends infer O ? O : never;
    }
  : never;
