import type { AttributeBool } from "../base-html-tag-props";
import type { Target } from "./shared/target";

declare global {
  namespace JSXTE {
    interface FormTagProps {
      "accept-charset"?: string;
      action?: string;
      autocomplete?: "on" | "off";
      enctype?:
        | "application/x-www-form-urlencoded"
        | "multipart/form-data"
        | "text/plain";
      method?: "get" | "post";
      name?: string;
      novalidate?: AttributeBool;
      rel?:
        | "external"
        | "help"
        | "license"
        | "next"
        | "nofollow"
        | "noopener"
        | "noreferrer"
        | "opener"
        | "prev"
        | "search";
      target?: Target;
    }
  }
}
