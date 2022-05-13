import type { HTMLPropsFor, Rewrap } from "../../types";
import type { OptionHTMLParser } from "./option-html-parser";

export type OptionProps = Rewrap<HTMLPropsFor<typeof OptionHTMLParser>>;
