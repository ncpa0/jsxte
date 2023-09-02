import type { RefererPolicy } from "./shared/referer-policy";
import type { Target } from "./shared/target";

declare global {
  namespace JSXTE {
    interface AreaTagProps {
      alt?: string;
      coords?: string;
      download?: string;
      href?: string;
      hreflang?: string;
      media?: string;
      referrerpolicy?: RefererPolicy;
      rel?:
        | "alternate"
        | "author"
        | "bookmark"
        | "help"
        | "license"
        | "next"
        | "nofollow"
        | "noreferrer"
        | "prefetch"
        | "prev"
        | "search"
        | "tag";
      shape?: "default" | "rect" | "circle" | "poly";
      target?: Target;
      type?: string;
    }
  }
}
