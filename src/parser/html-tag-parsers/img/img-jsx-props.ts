import type { HTMLPropsFor, Rewrap } from "../../types";
import type { ImgHTMLParser } from "./img-html-parser";

export type ImgProps = Rewrap<HTMLPropsFor<typeof ImgHTMLParser>>;
