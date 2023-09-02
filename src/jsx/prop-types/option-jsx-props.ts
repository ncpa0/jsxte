import type { AttributeBool } from "../base-html-tag-props";

declare global {
  namespace JSXTE {
    interface OptionTagProps {
      disabled?: AttributeBool;
      label?: string;
      selected?: AttributeBool;
      value?: string;
    }
  }
}
