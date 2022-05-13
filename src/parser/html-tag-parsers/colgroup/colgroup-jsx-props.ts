import type { HTMLPropsFor, Rewrap } from "../../types";
import type { ColgroupHTMLParser } from "./colgroup-html-parser";

export type ColgroupProps = Rewrap<HTMLPropsFor<typeof ColgroupHTMLParser>>;
