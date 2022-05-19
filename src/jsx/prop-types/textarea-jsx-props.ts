import type { AttributeBool } from "../base-html-tag-props";

export type TextareaTagProps = {
  autofocus?: AttributeBool;
  cols?: string;
  dirname?: string;
  disabled?: AttributeBool;
  form?: string;
  maxlength?: string;
  name?: string;
  placeholder?: string;
  readonly?: AttributeBool;
  required?: AttributeBool;
  rows?: string;
  wrap?: "hard" | "soft";
};
