import type { RefererPolicy } from "./shared/referer-policy";
import type { Target } from "./shared/target";

declare global {
  namespace JSXTE {
    interface AnchorTagProps {
      download?: string;
      href?: string;
      hreflang?: string;
      ping?: string;
      media?: string;
      referrerpolicy?: RefererPolicy;
      rel?:
        | "alternate"
        | "author"
        | "bookmark"
        | "external"
        | "help"
        | "license"
        | "next"
        | "nofollow"
        | "noreferrer"
        | "noopener"
        | "prev"
        | "search"
        | "tag";
      target?: Target;
      type?: string;
    }
  }
}
