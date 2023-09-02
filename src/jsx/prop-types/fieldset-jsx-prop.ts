import type { AttributeBool } from "../base-html-tag-props";

declare global {
  namespace JSXTE {
    interface FieldsetTagProps {
      disabled?: AttributeBool;
      form?: string;
      name?: string;
    }
  }
}
