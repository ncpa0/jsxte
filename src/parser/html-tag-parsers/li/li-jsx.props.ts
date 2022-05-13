import type { HTMLPropsFor, Rewrap } from "../../types";
import type { LinkHTMLParser } from "../link/link-html-parser";

export type LiProps = Rewrap<HTMLPropsFor<typeof LinkHTMLParser>>;
