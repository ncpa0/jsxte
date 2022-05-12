import { State } from "../../state/state";
import type { EventCallback } from "../base-html-parser/events.types";
import type { HTMLElementStruct } from "../types";

export const bindEventListeners = (
  target: HTMLElement,
  struct: HTMLElementStruct
) => {
  const cleanups: Array<() => void> = [];

  const setEventListener = (event: string, callback: EventCallback) => {
    target.addEventListener(event, callback);
    return () => target.removeEventListener(event, callback);
  };

  for (const [event, callback] of struct.events) {
    if (State.isStateInstance(callback)) {
      let removeListener = setEventListener(
        event,
        callback.value() ?? (() => {})
      );
      const listenerID = callback.observe((c) => {
        removeListener();
        removeListener = setEventListener(event, c);
      });
      cleanups.push(() => {
        removeListener();
        callback.removeObserver(listenerID);
      });
    } else {
      const removeListener = setEventListener(event, callback as EventListener);
      cleanups.push(removeListener);
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
