import type { AttributeBool } from "../base-html-tag-props";

declare global {
  namespace JSXTE {
    interface ButtonTagProps {
      autofocus?: AttributeBool;
      disabled?: string;
      form?: string;
      formaction?: string;
      formenctype?: string;
      formmethod?: string;
      formnovalidate?: string;
      formtarget?: string;
      name?: string;
      type?: "button" | "reset" | "submit";
      value?: string;
    }
  }
}
