import type { HTMLPropsFor, Rewrap } from "../../types";
import type { ButtonHTMLAttributes } from "./button-attributes.types";
import type { ButtonHTMLEvents } from "./button-events.types";

export type ButtonProps = Rewrap<
  HTMLPropsFor<ButtonHTMLAttributes, ButtonHTMLEvents>
>;
