export class DOMFragment {
  static isFragment(elem: DOMFragment | HTMLElement): elem is DOMFragment {
    return #children in elem;
  }

  #parent?: HTMLElement | DOMFragment;
  #fragmentBegin?: HTMLElement;
  #children: Array<HTMLElement | DOMFragment> = [];

  /** Appends this fragment after the specified HTMLElement. */
  private appendAfter(node: HTMLElement): void {
    for (const c of this.#children.reverse()) {
      if (DOMFragment.isFragment(c)) {
        c.appendAfter(node);
      } else {
        node.insertAdjacentElement("afterend", c);
      }
    }
  }

  private lastMountedChild(): HTMLElement | DOMFragment | undefined {
    return this.#children.reduce(
      (result: undefined | DOMFragment | HTMLElement, elem) => {
        if (DOMFragment.isFragment(elem)) {
          const last = elem.lastMountedChild();
          if (last) return last;
        } else {
          if (elem.parentElement !== null) {
            return elem;
          }
        }

        return result;
      },
      undefined
    );
  }

  /** Appends this Frgament to the specified node. */
  appendTo(node: HTMLElement | DOMFragment): DOMFragment {
    this.#parent = node;

    this.#fragmentBegin = document.createElement("span");
    node.appendChild(this.#fragmentBegin);

    for (const c of this.#children) {
      if (DOMFragment.isFragment(c)) {
        c.appendTo(node);
      } else {
        node.appendChild(c);
      }
    }

    return this;
  }

  private insertAfter(node: HTMLElement): void {
    if (this.#parent) {
      const lastChild = this.lastMountedChild();

      if (lastChild) {
        if (DOMFragment.isFragment(lastChild)) {
          lastChild.insertAfter(node);
        } else {
          lastChild.insertAdjacentElement("afterend", node);
        }
      } else {
        this.#fragmentBegin?.insertAdjacentElement("afterend", node);
      }
    }
  }

  /** Appends child to this Fragment. */
  appendChild(node: HTMLElement | DOMFragment): DOMFragment {
    this.#children.push(node);

    if (this.#parent) {
      if (DOMFragment.isFragment(node)) {
        node.appendTo(this.#parent);
      } else {
        this.insertAfter(node);
      }
    }

    if (DOMFragment.isFragment(node)) {
      node.#parent = this;
    }

    return this;
  }

  /** Replaces the specified node with this Fragment. */
  replace(node: HTMLElement | DOMFragment): DOMFragment {
    if (DOMFragment.isFragment(node)) {
      node.replaceWith(this);
    } else {
      this.appendAfter(node);
      node.remove();
    }

    return this;
  }

  /** Replaces this Fragment with specified node. */
  replaceWith(node: HTMLElement | DOMFragment): void {
    this.removeChildren();

    if (this.#fragmentBegin) {
      if (DOMFragment.isFragment(node)) {
        node.#parent = this.#parent;
        node.appendAfter(this.#fragmentBegin);
      } else {
        this.#fragmentBegin.replaceWith(node);
      }
    }
  }

  private removeChildren() {
    for (const child of this.#children) {
      child.remove();
    }
  }

  private detachChild(child: DOMFragment | HTMLElement) {
    const index = this.#children.findIndex((e) => e === child);

    if (index !== -1) this.#children.splice(index, 1);
  }

  /** Removes this Fragment. */
  remove(): void {
    this.#fragmentBegin?.remove();
    this.removeChildren();

    if (this.#parent && DOMFragment.isFragment(this.#parent)) {
      this.#parent.detachChild(this);
    }
  }
}
