import type { ElementStruct } from "../../jsx/jsx.types";
import { State } from "../../state/state";
import { DOMFragment } from "../dom-fragment/dom-fragment";
import type { ParsingResult } from "../parse-template-to-html";
import { parseTemplateToHTML } from "../parse-template-to-html";
import type { HTMLElementStruct } from "../types";

type BindChild = {
  struct: ElementStruct;
  parsed: ParsingResult;
};

export const getKey = (c: ElementStruct) => {
  const { key } = c.props;

  if (key === undefined) return undefined;

  if (State.isStateInstance<State<any>>(key)) return key.value();

  if (typeof key === "function") return key();

  return key;
};

export const bindChildren = (
  target: HTMLElement | DOMFragment,
  children: HTMLElementStruct["children"]
) => {
  const cleanups: Array<() => void> = [];

  if (State.isStateInstance(children)) {
    let prevChildList: BindChild[] = (children.value() ?? []).map(
      (childStruct) => {
        const parsed = parseTemplateToHTML(childStruct);

        if (DOMFragment.isFragment(parsed.element)) {
          parsed.element.appendTo(target);
        } else {
          target.appendChild(parsed.element);
        }

        return {
          struct: childStruct,
          parsed,
        };
      }
    );

    const observerID = children.observe((c) => {
      const nextChildList: BindChild[] = [];

      // // Remove all from the DOM tree
      // for (const curr of prevChildList) {
      //   curr.parsed.element.remove();
      // }

      // // Unbind children that should be removed permanently
      // for (const bindChild of toRemove) {
      //   bindChild.parsed.destroy();

      // }

      let offset = 0;
      const detachedChildren: BindChild[] = [];

      for (const [index, currentChild] of prevChildList.entries()) {
        const correspondingNewChild = c[index - offset];

        if (
          currentChild.struct.props.key === undefined ||
          correspondingNewChild?.props.key === undefined
        ) {
          currentChild.parsed.element.remove();
          currentChild.parsed.destroy();
          offset++;
          continue;
        }

        if (getKey(currentChild.struct) !== getKey(correspondingNewChild)) {
          currentChild.parsed.element.remove();
          detachedChildren.push(currentChild);
          offset++;
          continue;
        }

        nextChildList.push(currentChild);
      }

      for (const child of c.slice(prevChildList.length - offset)) {
        const existingIndex = detachedChildren.findIndex(
          (c) => getKey(c.struct) === getKey(child)
        );

        if (existingIndex !== -1) {
          detachedChildren.splice(existingIndex, 1);
          const existingChild = detachedChildren[existingIndex]!;

          if (DOMFragment.isFragment(existingChild.parsed.element)) {
            existingChild.parsed.element.appendTo(target);
          } else {
            target.appendChild(existingChild.parsed.element);
          }

          nextChildList.push(existingChild);
        } else {
          const parsed = parseTemplateToHTML(child);

          if (DOMFragment.isFragment(parsed.element)) {
            parsed.element.appendTo(target);
          } else {
            target.appendChild(parsed.element);
          }

          nextChildList.push({
            struct: child,
            parsed,
          });
        }
      }

      for (const detached of detachedChildren) {
        detached.parsed.destroy();
      }

      // // Reattach children in the correct order
      // for (const elem of c) {
      //   if (toAdd.includes(elem)) {
      //     const parsed = parseTemplateToHTML(elem);

      //     if (DOMFragment.isFragment(parsed.element)) {
      //       parsed.element.appendTo(target);
      //     } else {
      //       target.appendChild(parsed.element);
      //     }

      //     nextChildList.push({
      //       struct: elem,
      //       parsed,
      //     });
      //   } else {
      //     const existingChild = prevChildList.find(
      //       (e) => e.struct.props.key === elem.props.key
      //     )!;

      //     if (DOMFragment.isFragment(existingChild.parsed.element)) {
      //       existingChild.parsed.element.appendTo(target);
      //     } else {
      //       target.appendChild(existingChild.parsed.element);
      //     }

      //     nextChildList.push(existingChild);
      //   }
      // }

      prevChildList = nextChildList;
    });

    cleanups.push(() => {
      (children as State<ElementStruct[]>).removeObserver(observerID);
      for (const child of prevChildList) {
        child.parsed.destroy();
      }
    });
  } else {
    for (const child of children) {
      if (State.isStateInstance(child)) {
        const struct = child.value();

        let childElem = parseTemplateToHTML(struct);

        if (DOMFragment.isFragment(childElem.element)) {
          childElem.element.appendTo(target);
        } else {
          target.appendChild(childElem.element);
        }

        const observerID = child.observe((c) => {
          const newElem = parseTemplateToHTML(c);

          childElem.destroy();

          if (DOMFragment.isFragment(newElem.element)) {
            newElem.element.replace(childElem.element);
          } else {
            childElem.element.replaceWith(newElem.element);
          }

          childElem = newElem;
        });

        cleanups.push(() => {
          childElem.destroy();
          child.removeObserver(observerID);
        });
      } else {
        const childElem = parseTemplateToHTML(child);

        if (DOMFragment.isFragment(childElem.element)) {
          childElem.element.appendTo(target);
        } else {
          target.appendChild(childElem.element);
        }

        cleanups.push(() => {
          childElem.destroy();
        });
      }
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
