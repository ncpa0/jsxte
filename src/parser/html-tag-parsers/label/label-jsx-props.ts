import type { HTMLPropsFor, Rewrap } from "../../types";
import type { LabelHTMLParser } from "./label-html-parser";

export type LabelProps = Rewrap<HTMLPropsFor<typeof LabelHTMLParser>>;
