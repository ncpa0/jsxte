import type { HTMLPropsFor, Rewrap } from "../../types";
import type { LinkHTMLParser } from "./link-html-parser";

export type LinkProps = Rewrap<HTMLPropsFor<typeof LinkHTMLParser>>;
