import type { AttributeBool } from "../base-html-tag-props";

declare global {
  namespace JSXTE {
    interface AudioTagProps {
      autoplay?: AttributeBool;
      controls?: AttributeBool;
      loop?: AttributeBool;
      muted?: AttributeBool;
      preload?: "auto" | "metadata" | "none";
      src?: string;
    }
  }
}
