import type { RefererPolicy } from "./shared/referer-policy";
import type { Relationship } from "./shared/relationship";

export type AnchorTagProps = {
  download?: string;
  href?: string;
  hreflang?: string;
  ping?: string;
  media?: string;
  referrerpolicy?: RefererPolicy;
  rel?: Relationship;
  target?: string;
  type?: string;
};
