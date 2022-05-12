import { State } from "../../state/state";
import type { HTMLElementStruct } from "../types";

export const bindInnerText = (
  target: HTMLElement,
  struct: HTMLElementStruct
) => {
  const cleanups: Array<() => void> = [];

  const setInnerText = (v: string | undefined) => {
    if (v === undefined) target.innerText = "";
    else target.innerText = v;
  };

  if (State.isStateInstance(struct.text)) {
    setInnerText(struct.text.value());
    const listenerID = struct.text.observe((v) => {
      setInnerText(v);
    });
    cleanups.push(() => (struct.text as State<any>).removeObserver(listenerID));
  } else {
    setInnerText(struct.text as string | undefined);
  }

  return {
    unbind() {
      for (const cleanupFn of cleanups) {
        cleanupFn();
      }
    },
  };
};
