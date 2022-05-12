import { State } from "../../state/state";
import type { HTMLElementStruct } from "../types";

export const bindAttributes = (
  target: HTMLElement,
  struct: HTMLElementStruct
) => {
  const cleanups: Array<() => void> = [];

  const setAttribute = (k: string, v: string | undefined) => {
    if (v === undefined) target.removeAttribute(k);
    else target.setAttribute(k, v);
  };

  for (const [key, attribute] of struct.attributes) {
    if (State.isStateInstance(attribute)) {
      setAttribute(key, attribute.value());
      const listenerID = attribute.observe((v) => {
        setAttribute(key, v);
      });
      cleanups.push(() => attribute.removeObserver(listenerID));
    } else {
      setAttribute(key, attribute as string | undefined);
    }
  }

  return {
    unbind() {
      for (const cleanupFn of cleanups) {
        cleanupFn();
      }
    },
  };
};
