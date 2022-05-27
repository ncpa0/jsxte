import type { AttributeBool } from "../base-html-tag-props";
import type { RefererPolicy } from "./shared/referer-policy";

export interface ImgTagProps {
  alt?: string;
  crossorigin?: "anonymous" | "use-credentials";
  height?: string | number;
  ismap?: AttributeBool;
  loading?: "eager" | "lazy";
  longdesc?: string;
  referrerpolicy?: RefererPolicy;
  sizes?: string;
  src?: string;
  srcset?: string;
  usemap?: string;
  width?: string | number;
}
