import type { Crossorigin } from "./shared/crossorigin";
import type { RefererPolicy } from "./shared/referer-policy";

declare global {
  namespace JSXTE {
    interface LinkTagProps {
      as?:
        | "audio"
        | "document"
        | "embed"
        | "fetch"
        | "font"
        | "image"
        | "object"
        | "script"
        | "style"
        | "track"
        | "video"
        | "worker";
      crossorigin?: Crossorigin;
      href?: string;
      hreflang?: string;
      imagesizes?: string;
      imagesrcset?: string;
      integrity?: string;
      media?: string;
      prefetch?: string;
      referrerpolicy?: RefererPolicy;
      rel?: string;
      sizes?: string;
      title?: string;
      type?: string;
      blocking?: string;
    }
  }
}
