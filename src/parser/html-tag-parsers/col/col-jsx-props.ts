import type { HTMLPropsFor, Rewrap } from "../../types";
import type { ColHTMLParser } from "./col-html-parser";

export type ColProps = Rewrap<HTMLPropsFor<typeof ColHTMLParser>>;
