import type { AttributeBool } from "../base-html-tag-props";

declare global {
  namespace JSXTE {
    interface TrackTagProps {
      default?: AttributeBool;
      kind?:
        | "captions"
        | "chapters"
        | "descriptions"
        | "metadata"
        | "subtitles";
      label?: string;
      src?: string;
      srclang?: string;
    }
  }
}
