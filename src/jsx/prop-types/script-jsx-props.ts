import type { AttributeBool } from "../base-html-tag-props";
import type { Crossorigin } from "./shared/crossorigin";
import type { RefererPolicy } from "./shared/referer-policy";

export type ScriptTagProps = {
  async?: AttributeBool;
  crossorigin?: Crossorigin;
  defer?: AttributeBool;
  integrity?: string;
  nomodule?: string;
  referrerpolicy?: RefererPolicy;
  src?: string;
  type?: string;
};
