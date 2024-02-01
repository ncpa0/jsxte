import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { DomRenderer } from "../../src/index";
// @ts-ignore
import { Fragment, jsx } from "../../src/jsx/jsx-runtime";

describe("DomRenderer", () => {
  const { window } = new JSDOM();
  const renderer = new DomRenderer(window);

  it("renders an empty div", () => {
    const element = renderer.render(<div />) as HTMLDivElement;
    expect(element).toMatchObject(window.document.createElement("div"));
    expect(element.outerHTML).toMatchSnapshot();
  });

  it("renders a div with text", () => {
    const element = renderer.render(<div>Hello</div>) as HTMLDivElement;
    const expected = window.document.createElement("div");
    expected.textContent = "Hello";
    expect(element).toMatchObject(expected);
    expect(element.outerHTML).toMatchSnapshot();
  });

  it("renders a div with a child", () => {
    const element = renderer.render(
      <div>
        <span>Hello</span>
      </div>,
    ) as HTMLDivElement;
    const expected = window.document.createElement("div");
    const span = window.document.createElement("span");
    span.textContent = "Hello";
    expected.appendChild(span);
    expect(element).toMatchObject(expected);
    expect(element.outerHTML).toMatchSnapshot();
  });

  it("renders a div with a child and a class", () => {
    const element = renderer.render(
      <div class="foo">
        <span>Hello</span>
      </div>,
    ) as HTMLDivElement;
    const expected = window.document.createElement("div");
    expected.className = "foo";
    const span = window.document.createElement("span");
    span.textContent = "Hello";
    expected.appendChild(span);
    expect(element).toMatchObject(expected);
    expect(element.outerHTML).toMatchSnapshot();
  });

  it("renders a nested structure with attributes", () => {
    const element = renderer.render(
      <body id="root" class="foo" draggable>
        <head>
          <nav>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
            </ul>
          </nav>
        </head>
        <main class="main-contents" style="padding: 1rem; margin: 1rem;">
          <div>
            <h1>Todo's:</h1>
            {"- Write some code"}
            <br />
            {"- Write some tests"}
            <br />
            {"- Profit"}
          </div>
          <div class="interpolated-str">
            This {"is"} a {"string"} with {"interpolated"} values
          </div>
        </main>
      </body>,
    ) as HTMLElement;

    expect(element).toMatchSnapshot();
  });

  describe("custom window type", () => {
    class HtmlElem {
      static make(
        tagName: string,
        attr: Record<string, string>,
        ...children: Array<HtmlElem | HtmlFrag | HtmlTxt>
      ) {
        const elem = new HtmlElem(tagName);
        for (const [name, value] of Object.entries(attr)) {
          elem.setAttribute(name, value);
        }
        for (const child of children) {
          elem.appendChild(child);
        }
        return elem;
      }

      public children: Array<HtmlElem | HtmlFrag | HtmlTxt> = [];
      public attributes: Record<string, string> = {};
      constructor(public tagName: string) {}
      appendChild<T extends HtmlElem | HtmlFrag | HtmlTxt>(child: T): T {
        this.children.push(child);
        return child;
      }
      setAttribute(name: string, value: string) {
        this.attributes[name] = value;
      }
    }

    class HtmlFrag {
      static make(
        ...children: Array<HtmlElem | HtmlFrag | HtmlTxt>
      ) {
        const elem = new HtmlFrag();
        for (const child of children) {
          elem.appendChild(child);
        }
        return elem;
      }

      public children: Array<HtmlElem | HtmlFrag | HtmlTxt> = [];
      appendChild<T extends HtmlElem | HtmlFrag | HtmlTxt>(child: T): T {
        this.children.push(child);
        return child;
      }
    }

    class HtmlTxt {
      public textContent: string | null = null;
      constructor(public text: string) {}
    }

    class Doc {
      public createElement(tagName: string) {
        return new HtmlElem(tagName);
      }

      public createTextNode(text: string) {
        return new HtmlTxt(text);
      }

      public createDocumentFragment() {
        return new HtmlFrag();
      }
    }

    class Win {
      public document = new Doc();
    }

    const window = new Win();

    it("renders a nested structure with attributes", () => {
      const renderer = new DomRenderer(window);

      const elem = renderer.render(
        <div id="root" class="foo" hidden>
          <span>Hello</span>
          <div contenteditable={false}>
            <ul class="links-list unordered column" role="navigation">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
            </ul>
          </div>
        </div>,
      );

      expect(elem).toMatchObject(
        HtmlElem.make(
          "div",
          { id: "root", class: "foo", hidden: "hidden" },
          HtmlElem.make("span", {}, new HtmlTxt("Hello")),
          HtmlElem.make(
            "div",
            {},
            HtmlElem.make(
              "ul",
              {
                class: "links-list unordered column",
                role: "navigation",
              },
              HtmlElem.make(
                "li",
                {},
                HtmlElem.make("a", { href: "/" }, new HtmlTxt("Home")),
              ),
              HtmlElem.make(
                "li",
                {},
                HtmlElem.make("a", { href: "/about" }, new HtmlTxt("About")),
              ),
            ),
          ),
        ),
      );
    });
  });
});
