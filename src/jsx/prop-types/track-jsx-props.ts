import type { AttributeBool } from "../base-html-tag-props";

export interface TrackTagProps {
  default?: AttributeBool;
  kind?: "captions" | "chapters" | "descriptions" | "metadata" | "subtitles";
  label?: string;
  src?: string;
  srclang?: string;
}
