import type { AttributeBool } from "../base-html-tag-props";

declare global {
  namespace JSXTE {
    interface ObjectTagProps {
      data?: string;
      form?: string;
      height?: string | number;
      name?: string;
      type?: string;
      typemustmatch?: AttributeBool;
      usemap?: string;
      width?: string | number;
    }
  }
}
