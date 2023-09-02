import type { AttributeBool } from "../base-html-tag-props";

declare global {
  namespace JSXTE {
    interface SelectTagProps {
      autofocus?: AttributeBool;
      disabled?: AttributeBool;
      form?: string;
      multiple?: AttributeBool;
      name?: string;
      required?: AttributeBool;
      size?: string | number;
    }
  }
}
