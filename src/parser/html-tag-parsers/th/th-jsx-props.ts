import type { HTMLPropsFor, Rewrap } from "../../types";
import type { ThHTMLParser } from "./th-html-parser";

export type ThProps = Rewrap<HTMLPropsFor<typeof ThHTMLParser>>;
