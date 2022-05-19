import type { AttributeBool } from "../base-html-tag-props";

export type AudioTagProps = {
  autoplay?: AttributeBool;
  controls?: AttributeBool;
  loop?: AttributeBool;
  muted?: AttributeBool;
  preload?: "auto" | "metadata" | "none";
  src?: string;
};
