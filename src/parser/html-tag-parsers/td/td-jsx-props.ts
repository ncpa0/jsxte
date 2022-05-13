import type { HTMLPropsFor, Rewrap } from "../../types";
import type { TdHTMLParser } from "./td-html-parser";

export type TdProps = Rewrap<HTMLPropsFor<typeof TdHTMLParser>>;
