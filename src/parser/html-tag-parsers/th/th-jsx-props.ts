import type { HTMLPropsFor, Rewrap } from "../../types";
import type { TheadHTMLParser } from "../thead/thead-html-parser";

export type ThProps = Rewrap<HTMLPropsFor<typeof TheadHTMLParser>>;
