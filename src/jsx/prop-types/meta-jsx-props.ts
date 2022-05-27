export interface MetaTagProps {
  "http-equiv"?:
    | "content-security-policy"
    | "content-type"
    | "default-style"
    | "x-ua-compatible"
    | "refresh";
  charset?: string;
  content?: string;
  name?:
    | "application-name"
    | "author"
    | "description"
    | "generator"
    | "keywords"
    | "viewport";
}
