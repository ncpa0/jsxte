import type { HTMLPropsFor, Rewrap } from "../../types";
import type { ScriptHTMLParser } from "./script-html-parser";

export type ScriptProps = Rewrap<HTMLPropsFor<typeof ScriptHTMLParser>>;
