import type { AttributeBool } from "../base-html-tag-props";

export interface AudioTagProps {
  autoplay?: AttributeBool;
  controls?: AttributeBool;
  loop?: AttributeBool;
  muted?: AttributeBool;
  preload?: "auto" | "metadata" | "none";
  src?: string;
}
