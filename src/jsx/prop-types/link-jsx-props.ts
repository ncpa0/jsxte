import type { Crossorigin } from "./shared/crossorigin";
import type { RefererPolicy } from "./shared/referer-policy";
import type { Relationship } from "./shared/relationship";

export type LinkTagProps = {
  crossorigin?: Crossorigin;
  href?: string;
  hreflang?: string;
  media?: string;
  referrerpolicy?: RefererPolicy;
  rel?:
    | "alternate"
    | "author"
    | "dns-prefetch"
    | "help"
    | "icon"
    | "license"
    | "next"
    | "pingback"
    | "preconnect"
    | "prefetch"
    | "preload"
    | "prerender"
    | "prev"
    | "search"
    | "stylesheet";
  sizes?: string;
  title?: string;
  type?: string;
};
