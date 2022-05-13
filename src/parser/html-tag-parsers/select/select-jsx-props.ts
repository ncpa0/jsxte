import type { HTMLPropsFor, Rewrap } from "../../types";
import type { SelectHTMLParser } from "./select-html-parser";

export type SelectProps = Rewrap<HTMLPropsFor<typeof SelectHTMLParser>>;
