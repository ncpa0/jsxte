import type { AttributeBool } from "../base-html-tag-props";

export type InputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "datetime-local"
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

export type InputTagProps = {
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
  height?: string;
  list?: string;
  max?: string;
  maxlength?: string;
  min?: string;
  minlength?: string;
  multiple?: string;
  name?: string;
  pattern?: string;
  placeholder?: string;
  readonly?: string;
  required?: string;
  size?: string;
  src?: string;
  step?: string;
  type?: InputType;
  value?: string;
  width?: string;
};
