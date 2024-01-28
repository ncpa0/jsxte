import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { DomRenderer } from "../../src/index";
// @ts-ignore
import { Fragment, jsx } from "../../src/jsx/jsx-runtime";

describe("DomRenderer", () => {
  const { window } = new JSDOM();
  const renderer = new DomRenderer(window as any as Window);

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
});
