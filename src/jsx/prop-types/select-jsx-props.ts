import type { AttributeBool } from "../base-html-tag-props";

export type SelectTagProps = {
  autofocus?: AttributeBool;
  disabled?: AttributeBool;
  form?: string;
  multiple?: AttributeBool;
  name?: string;
  required?: AttributeBool;
  size?: string;
};
