import type { AttributeBool } from "../base-html-tag-props";

export interface OptionTagProps {
  disabled?: AttributeBool;
  label?: string;
  selected?: AttributeBool;
  value?: string;
}
