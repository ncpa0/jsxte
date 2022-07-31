import "../../src/jsx/jsx.types";
import {
  renderToHtml,
  renderToHtmlAsync,
} from "../../src/html-parser/render-to-html";
// @ts-ignore
import { jsx, Fragment } from "../../src/jsx/jsx-runtime";
import { defineContext } from "../../src/context-map/context-map";

const sleep = (t: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), t));

describe("renderToHTML", () => {
  it("should correctly generate html from simple jsx", () => {
    const Component = (props: { title: string }) => {
      return (
        <div id="container" class={"bordered active"}>
          <h1>Hello World</h1>
          <h2>{props.title}</h2>
          <button onclick={'console.log("Hello World!")'}>Click me!</button>
          <input autofocus={true} disabled={false} draggable />
        </div>
      );
    };

    const html = renderToHtml(<Component title="Prop Title" />);

    expect(html).toMatchSnapshot();
  });

  it("should correctly generate html from component base jsx structure", () => {
    const Header = (props: { title: string }) => {
      return <h2>{props.title}</h2>;
    };

    const Button = (props: { label: string; styles?: string }) => {
      return <button style={props.styles}>{props.label}</button>;
    };

    const Template = ({ children }: JSXTE.ElementProps) => {
      return (
        <html>
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="IE=edge" />
            <title>Page Title</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link
              rel="stylesheet"
              type="text/css"
              media="screen"
              href="main.css"
            />
          </head>
          <body>{children}</body>
        </html>
      );
    };

    const Content = () => {
      return (
        <>
          <Header title="Hello World!" />
          <input value="write here" />
          <Button label="Submit" />
        </>
      );
    };

    const App = () => {
      return (
        <Template>
          <div class="main-container">
            <Content />
          </div>
        </Template>
      );
    };

    const structure = <App />;

    const html = renderToHtml(structure);

    expect(html).toMatchSnapshot();
  });

  it("should correctly render jsx with arrays in between elements", () => {
    const App = () => {
      return (
        <div>
          <h1>Header</h1>
          {Array.from({ length: 2 }, (_, i) => i).map((i) => (
            <p>{i}</p>
          ))}
          <footer />
        </div>
      );
    };

    const html = renderToHtml(<App />);

    expect(html).toMatchSnapshot();
  });

  it("should correctly parse async components", async () => {
    const Header = async (props: { title: string }) => {
      await sleep(50);
      return <h2>{props.title}</h2>;
    };

    const Button = async (props: { label: string; styles?: string }) => {
      await sleep(50);
      return <button style={props.styles}>{props.label}</button>;
    };

    const Template = ({ children }: JSXTE.ElementProps) => {
      return (
        <html>
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="IE=edge" />
            <title>Page Title</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link
              rel="stylesheet"
              type="text/css"
              media="screen"
              href="main.css"
            />
          </head>
          <body>{children}</body>
        </html>
      );
    };

    const Content = async () => {
      const headerTitle = await sleep(100).then(() => "Async title");
      return (
        <>
          <Header title={headerTitle} />
          <input value="write here" />
          <Button label="Submit" />
        </>
      );
    };

    const App = () => {
      return (
        <Template>
          <div class="main-container">
            <Content />
          </div>
        </Template>
      );
    };

    expect(() => renderToHtml(<App />)).toThrowError();

    const html = await renderToHtmlAsync(<App />);
    expect(html).toMatchSnapshot();
  });

  it("should correctly handle nulls, undefined and boolean values", () => {
    const StandardDiv = () => {
      return (
        <div>
          <div></div>
          <div></div>
          <div>{[<span>before</span>, <span>after</span>]}</div>
        </div>
      );
    };

    const DivWithNulls = () => {
      return (
        <div>
          <div>{null}</div>
          <div>{[null]}</div>
          <div>{[<span>before</span>, null, null, <span>after</span>]}</div>
        </div>
      );
    };

    const DivWithUndefined = () => {
      return (
        <div>
          <div>{undefined}</div>
          <div>{[undefined]}</div>
          <div>
            {[<span>before</span>, undefined, undefined, <span>after</span>]}
          </div>
        </div>
      );
    };

    const DivWithFalse = () => {
      return (
        <div>
          <div>{false}</div>
          <div>{[false]}</div>
          <div>{[<span>before</span>, false, false, <span>after</span>]}</div>
        </div>
      );
    };

    const DivWithTrue = () => {
      return (
        <div>
          <div>{true}</div>
          <div>{[true]}</div>
          <div>{[<span>before</span>, true, true, <span>after</span>]}</div>
        </div>
      );
    };

    const renderedStandardDiv = renderToHtml(<StandardDiv />);

    const renderedDivWithNulls = renderToHtml(<DivWithNulls />);
    const renderedDivWithUndefined = renderToHtml(<DivWithUndefined />);
    const renderedDivWithFalse = renderToHtml(<DivWithFalse />);
    const renderedDivWithTrue = renderToHtml(<DivWithTrue />);

    expect(renderedStandardDiv).toEqual(renderedDivWithNulls);
    expect(renderedStandardDiv).toEqual(renderedDivWithUndefined);
    expect(renderedStandardDiv).toEqual(renderedDivWithFalse);
    expect(renderedStandardDiv).toEqual(renderedDivWithTrue);
  });
  describe("should properly handle context data", () => {
    it("should correctly render jsx with context data", () => {
      const context = defineContext<{ title: string }>();

      const Header: JSXTE.Component = (_, contextMap) => {
        expect(contextMap.has(context)).toBe(true);
        const { title } = contextMap.get(context);
        expect(title).toBe("This title is set via the context");
        return (
          <div>
            <h1>{title}</h1>
          </div>
        );
      };

      const Content: JSXTE.Component = () => {
        return (
          <div class="main-container">
            <Header />
          </div>
        );
      };

      const App: JSXTE.Component = (_, contextMap) => {
        contextMap.set(context, { title: "This title is set via the context" });

        return (
          <html>
            <head>
              <meta charset="utf-8" />
              <meta http-equiv="x-ua-compatible" content="IE=edge" />
              <title>Page Title</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link
                rel="stylesheet"
                type="text/css"
                media="screen"
                href="main.css"
              />
            </head>
            <body>
              <Content />
            </body>
          </html>
        );
      };

      const html = renderToHtml(<App />);

      expect(html).toMatchSnapshot();
    });

    it("should correctly render jsx with context data and arrays in between elements", () => {
      const context = defineContext<{
        title: string;
        inputPlaceholder: string;
        buttonLabel: string;
      }>();

      const Header: JSXTE.Component = (_, contextMap) => {
        expect(contextMap.has(context)).toBe(true);
        const { title } = contextMap.get(context);

        contextMap.set(context, {
          title,
          inputPlaceholder:
            "This should not affect the rendered content, since this component has no children that consume this context.",
          buttonLabel:
            "This should not affect the rendered content, since this component has no children that consume this context.",
        });

        return (
          <div>
            <h1>{title}</h1>
          </div>
        );
      };

      const Input: JSXTE.Component = (_, contextMap) => {
        expect(contextMap.has(context)).toBe(true);
        const { inputPlaceholder } = contextMap.get(context);
        expect(inputPlaceholder).toBe("write here");
        return <input placeholder={inputPlaceholder} />;
      };

      const Button: JSXTE.Component = (_, contextMap) => {
        expect(contextMap.has(context)).toBe(true);
        const { buttonLabel } = contextMap.get(context);
        expect(buttonLabel).toBe("Submit");
        return <button>{buttonLabel}</button>;
      };

      const Content: JSXTE.Component = () => {
        return <>{[<Header />, <Input />, <Button />]}</>;
      };

      const App: JSXTE.Component = (_, contextMap) => {
        contextMap.set(context, {
          title: "This title is set via the context",
          buttonLabel: "Submit",
          inputPlaceholder: "write here",
        });

        return (
          <html>
            <head>
              <meta charset="utf-8" />
              <meta http-equiv="x-ua-compatible" content="IE=edge" />
              <title>Page Title</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link
                rel="stylesheet"
                type="text/css"
                media="screen"
                href="main.css"
              />
            </head>
            <body>
              <Content />
            </body>
          </html>
        );
      };

      const html = renderToHtml(<App />);

      expect(html).toMatchSnapshot();
    });

    it("should correctly render jsx with context data and async components", async () => {
      const context = defineContext<{
        title: string;
        inputPlaceholder: string;
        buttonLabel: string;
      }>();

      const Header: JSXTE.Component = async (_, contextMap) => {
        expect(contextMap.has(context)).toBe(true);
        const { title } = contextMap.get(context);

        contextMap.set(context, {
          title,
          inputPlaceholder:
            "This should not affect the rendered content, since this component has no children that consume this context.",
          buttonLabel:
            "This should not affect the rendered content, since this component has no children that consume this context.",
        });

        await sleep(10);
        return (
          <div>
            <h1>{title}</h1>
          </div>
        );
      };

      const Input: JSXTE.Component = async (_, contextMap) => {
        expect(contextMap.has(context)).toBe(true);
        const { inputPlaceholder } = contextMap.get(context);
        expect(inputPlaceholder).toBe("write here");
        await sleep(50);
        return <input placeholder={inputPlaceholder} />;
      };

      const Button: JSXTE.Component = async (_, contextMap) => {
        expect(contextMap.has(context)).toBe(true);
        const { buttonLabel } = contextMap.get(context);
        expect(buttonLabel).toBe("Submit");
        await sleep(50);
        return <button>{buttonLabel}</button>;
      };

      const Content: JSXTE.Component = () => {
        return <>{[<Header />, <Input />, <Button />]}</>;
      };

      const App: JSXTE.Component = async (_, contextMap) => {
        contextMap.set(context, {
          title: "This title is set via the context",
          buttonLabel: "Submit",
          inputPlaceholder: "write here",
        });

        return (
          <html>
            <head>
              <meta charset="utf-8" />
              <meta http-equiv="x-ua-compatible" content="IE=edge" />
              <title>Page Title</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link
                rel="stylesheet"
                type="text/css"
                media="screen"
                href="main.css"
              />
            </head>
            <body>
              <Content />
            </body>
          </html>
        );
      };

      const html = await renderToHtmlAsync(<App />);

      expect(html).toMatchSnapshot();
    });

    it("should correctly override existing context data", async () => {
      const context = defineContext<{
        title: string;
        inputPlaceholder: string;
      }>();

      const Header: JSXTE.Component = async (_, contextMap) => {
        expect(contextMap.has(context)).toBe(true);
        const { title } = contextMap.get(context);
        expect(title).toBe("This title was overridden");
        return <h1>{title}</h1>;
      };

      const Input: JSXTE.Component = async (_, contextMap) => {
        expect(contextMap.has(context)).toBe(true);
        const { inputPlaceholder } = contextMap.get(context);
        expect(inputPlaceholder).toBe("write here");
        await sleep(50);
        return <input placeholder={inputPlaceholder} />;
      };

      const Content: JSXTE.Component = (_, contextMap) => {
        expect(contextMap.has(context)).toBe(true);
        const { title } = contextMap.get(context);
        expect(title).toBe("This title was set in the app component");

        contextMap.update(context, {
          title: "This title was overridden",
        });

        return (
          <>
            <Header />
            <Input />
          </>
        );
      };

      const App: JSXTE.Component = async (_, contextMap) => {
        contextMap.set(context, {
          title: "This title was set in the app component",
          inputPlaceholder: "write here",
        });

        return (
          <html>
            <head>
              <meta charset="utf-8" />
              <meta http-equiv="x-ua-compatible" content="IE=edge" />
              <title>Page Title</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link
                rel="stylesheet"
                type="text/css"
                media="screen"
                href="main.css"
              />
            </head>
            <body>
              <Content />
            </body>
          </html>
        );
      };

      const html = await renderToHtmlAsync(<App />);

      expect(html).toMatchSnapshot();
    });
  });
});
