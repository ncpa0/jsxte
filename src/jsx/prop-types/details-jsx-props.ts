import type { AttributeBool } from "../base-html-tag-props";

declare global {
  namespace JSXTE {
    interface DetailsTagProps {
      open?: AttributeBool;
    }
  }
}
