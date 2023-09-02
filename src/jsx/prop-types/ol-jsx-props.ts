import type { AttributeBool } from "../base-html-tag-props";

declare global {
  namespace JSXTE {
    interface OlTagProps {
      reversed?: AttributeBool;
      start?: string | number;
      type?: "1" | "A" | "a" | "I" | "i";
    }
  }
}
