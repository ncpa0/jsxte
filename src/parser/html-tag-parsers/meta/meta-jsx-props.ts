import type { HTMLPropsFor, Rewrap } from "../../types";
import type { MetaHTMLParser } from "./meta-html-parser";

export type MetaProps = Rewrap<HTMLPropsFor<typeof MetaHTMLParser>>;
