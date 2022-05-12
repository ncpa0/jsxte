import type { HTMLPropsFor, Rewrap } from "../../types";
import type { AHTMLAttributes } from "./a-attributes.types";
import type { AHTMLEvents } from "./a-events.types";

export type AnchorProps = Rewrap<HTMLPropsFor<AHTMLAttributes, AHTMLEvents>>;
