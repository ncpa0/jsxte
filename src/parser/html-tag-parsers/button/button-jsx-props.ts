import type { HTMLPropsFor, Rewrap } from "../../types";
import type { ButtonHTMLParser } from "./button-html-parser";

export type ButtonProps = Rewrap<HTMLPropsFor<typeof ButtonHTMLParser>>;
