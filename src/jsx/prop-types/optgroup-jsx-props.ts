import type { AttributeBool } from "../base-html-tag-props";

declare global {
  namespace JSXTE {
    interface OptgroupTagProps {
      disabled?: AttributeBool;
      label?: string;
    }
  }
}
