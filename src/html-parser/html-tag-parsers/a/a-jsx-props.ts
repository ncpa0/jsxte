import type { HTMLPropsFor, Rewrap } from "../../types";
import type { AHTMLParser } from "./a-html-parser";

export type AnchorProps = Rewrap<HTMLPropsFor<typeof AHTMLParser>>;
