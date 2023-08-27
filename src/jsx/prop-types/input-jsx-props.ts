import type { AttributeBool } from "../base-html-tag-props";

export type InputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export interface InputTagProps {
  accept?: string;
  alt?: string;
  autocomplete?: "on" | "off";
  autofocus?: AttributeBool;
  checked?: AttributeBool;
  dirname?: string;
  disabled?: AttributeBool;
  form?: string;
  formaction?: string;
  formenctype?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
  formmethod?: "get" | "post";
  formnovalidate?: string;
  formtarget?: string;
  height?: string | number;
  list?: string;
  max?: string | number;
  maxlength?: string | number;
  min?: string | number;
  minlength?: string | number;
  multiple?: string;
  name?: string;
  pattern?: string;
  placeholder?: string;
  readonly?: AttributeBool;
  required?: AttributeBool;
  size?: string | number;
  src?: string;
  step?: string | number;
  type?: InputType;
  value?: string | number;
  width?: string | number;
}
