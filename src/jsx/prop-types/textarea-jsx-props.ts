import type { AttributeBool } from "../base-html-tag-props";

declare global {
  namespace JSXTE {
    interface TextareaTagProps {
      autofocus?: AttributeBool;
      cols?: string | number;
      dirname?: string;
      disabled?: AttributeBool;
      form?: string;
      maxlength?: string | number;
      name?: string;
      placeholder?: string;
      readonly?: AttributeBool;
      required?: AttributeBool;
      rows?: string | number;
      wrap?: "hard" | "soft";
    }
  }
}
