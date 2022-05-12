import type { HTMLPropsFor, Rewrap } from "../../types";
import type { InputHTMLAttributes } from "./input-attributes.types";
import type { InputHTMLEvents } from "./input-events.types";

export type InputProps = Rewrap<
  HTMLPropsFor<InputHTMLAttributes, InputHTMLEvents>
>;
