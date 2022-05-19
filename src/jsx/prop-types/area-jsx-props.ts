import type { RefererPolicy } from "./shared/referer-policy";
import type { Relationship } from "./shared/relationship";

export type AreaTagProps = {
  alt?: string;
  coords?: string;
  download?: string;
  href?: string;
  hreflang?: string;
  media?: string;
  referrerpolicy?: RefererPolicy;
  rel?: Relationship;
  shape?: "default" | "rect" | "circle" | "poly";
  target?: string;
  type?: string;
};
