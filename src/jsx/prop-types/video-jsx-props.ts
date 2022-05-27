import type { AttributeBool } from "../base-html-tag-props";

export interface VideoTagProps {
  autoplay?: AttributeBool;
  controls?: AttributeBool;
  height?: string | number;
  loop?: AttributeBool;
  muted?: AttributeBool;
  poster?: string;
  preload?: "auto" | "metadata" | "none";
  src?: string;
  width?: string | number;
}
