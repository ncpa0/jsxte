import type { AttributeBool } from "../base-html-tag-props";
import type { RefererPolicy } from "./shared/referer-policy";

export type IframeTagProps = {
  allow?: string;
  allowfullscreen?: AttributeBool;
  allowpaymentrequest?: AttributeBool;
  height?: string;
  loading?: "eager" | "lazy";
  name?: string;
  referrerpolicy?: RefererPolicy;
  sandbox?:
    | "allow-forms"
    | "allow-pointer-lock"
    | "allow-popups"
    | "allow-same-origin"
    | "allow-scripts"
    | "allow-top-navigation";
  src?: string;
  srcdoc?: string;
  width?: string;
};
