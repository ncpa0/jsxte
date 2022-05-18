import type { HTMLPropsFor, Rewrap } from "../../types";
import type { InputHTMLParser } from "./input-html-parser";

export type InputProps = Rewrap<HTMLPropsFor<typeof InputHTMLParser>>;
