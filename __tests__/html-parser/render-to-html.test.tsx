import { describe, expect, it } from "vitest";
import {
  ComponentApi,
  ContextDefinition,
  defineContext,
  ErrorBoundary,
  HtmlRenderOptions,
  renderToHtml,
  renderToHtmlAsync,
} from "../../src/index";
import { Fragment, jsx } from "../../src/jsx/jsx-runtime";

const sleep = (t: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), t));

const allTests = (renderOpts: HtmlRenderOptions = {}) => () => {
  it("should correctly generate html from simple jsx", () => {
    const Component = (props: { title: string }) => {
      return (
        <div
          id="container"
          class={"bordered active"}
        >
          <h1>Hello World</h1>
          <h2>{props.title}</h2>
          <button onclick={"console.log(\"Hello World!\")"}>Click me!</button>
          <input
            autofocus={true}
            disabled={false}
            draggable
          />
        </div>
      );
    };

    const html = renderToHtml(<Component title="Prop Title" />, renderOpts);

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
            <meta
              http-equiv="x-ua-compatible"
              content="IE=edge"
            />
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

    const html = renderToHtml(structure, renderOpts);

    expect(html).toMatchSnapshot();
  });

  it("should correctly render jsx with arrays in between elements", () => {
    const App = () => {
      return (
        <div>
          <h1>Header</h1>
          {Array.from({ length: 2 }, (_, i) => i).map((i) => <p>{i}</p>)}
          <footer />
        </div>
      );
    };

    const html = renderToHtml(<App />, renderOpts);

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
            <meta
              http-equiv="x-ua-compatible"
              content="IE=edge"
            />
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

    expect(() => renderToHtml(<App />, renderOpts)).toThrowError();

    const html = await renderToHtmlAsync(<App />, renderOpts);
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

    const renderedStandardDiv = renderToHtml(<StandardDiv />, renderOpts);

    const renderedDivWithNulls = renderToHtml(<DivWithNulls />, renderOpts);
    const renderedDivWithUndefined = renderToHtml(
      <DivWithUndefined />,
      renderOpts,
    );
    const renderedDivWithFalse = renderToHtml(<DivWithFalse />, renderOpts);
    const renderedDivWithTrue = renderToHtml(<DivWithTrue />, renderOpts);

    expect(renderedStandardDiv).toEqual(renderedDivWithNulls);
    expect(renderedStandardDiv).toEqual(renderedDivWithUndefined);
    expect(renderedStandardDiv).toEqual(renderedDivWithFalse);
    expect(renderedStandardDiv).toEqual(renderedDivWithTrue);
  });

  it("should correctly render <pre> tags", () => {
    const App = () => {
      return (
        <html>
          <body>
            <div id="root">
              <div>
                <pre>{`const foo = "bar";\nconst bar = "baz";\nconsole.log(foo + " " + bar);`}</pre>
              </div>
            </div>
          </body>
        </html>
      );
    };

    const html = renderToHtml(<App />, renderOpts);

    expect(html).toMatchSnapshot();
  });

  it("should correctly render text with interpolated values", () => {
    const App = () => {
      return (
        <div>
          <span>
            Hello {"Daniel"}, how is it going? It's {"Monday"} today.
          </span>
        </div>
      );
    };

    const html = renderToHtml(<App />, renderOpts);

    expect(html).toMatchSnapshot();
  });

  it("should correctly render text with interpolated multiline values", () => {
    const App = () => {
      return (
        <div>
          <span>
            Hello {"Daniel"}, how is it going?{"\n"}
            {"\n"}
            Task for today:{"\n"}
            {"- Clean the house\n"}
            {"- Do the laundry\n"}
            - {"Buy some milk\n"}
            {"- Buy some bread\n"}
            That is all
          </span>
        </div>
      );
    };

    const html = renderToHtml(<App />, renderOpts);

    expect(html).toMatchSnapshot();
  });

  it("should correctly render multiline text with interpolated values inside <pre> tag", () => {
    const App = () => {
      return (
        <div>
          <pre>
Hello {"Daniel"}, how is it going?{"\n"}
{123} / {1000}
          </pre>
        </div>
      );
    };

    const html = renderToHtml(<App />, renderOpts);

    expect(html).toMatchSnapshot();
  });

  describe("should properly handle context data", () => {
    it("should correctly render jsx with context data", () => {
      const context = defineContext<{ title: string }>();

      const Header: JSXTE.Component = (_, { ctx }) => {
        expect(ctx.has(context)).toBe(true);
        const { title } = ctx.getOrFail(context);
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

      const App: JSXTE.Component = (_, { ctx }) => {
        ctx.set(context, { title: "This title is set via the context" });

        return (
          <html>
            <head>
              <meta charset="utf-8" />
              <meta
                http-equiv="x-ua-compatible"
                content="IE=edge"
              />
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

      const html = renderToHtml(<App />, renderOpts);

      expect(html).toMatchSnapshot();
    });

    it("should correctly render jsx with context data and arrays in between elements", () => {
      const context = defineContext<{
        title: string;
        inputPlaceholder: string;
        buttonLabel: string;
      }>();

      const Header: JSXTE.Component = (_, { ctx }) => {
        expect(ctx.has(context)).toBe(true);
        const { title } = ctx.getOrFail(context);

        ctx.set(context, {
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

      const Input: JSXTE.Component = (_, { ctx }) => {
        expect(ctx.has(context)).toBe(true);
        const { inputPlaceholder } = ctx.getOrFail(context);
        expect(inputPlaceholder).toBe("write here");
        return <input placeholder={inputPlaceholder} />;
      };

      const Button: JSXTE.Component = (_, { ctx }) => {
        expect(ctx.has(context)).toBe(true);
        const { buttonLabel } = ctx.getOrFail(context);
        expect(buttonLabel).toBe("Submit");
        return <button>{buttonLabel}</button>;
      };

      const Content: JSXTE.Component = () => {
        return <>{[<Header />, <Input />, <Button />]}</>;
      };

      const App: JSXTE.Component = (_, { ctx }) => {
        ctx.set(context, {
          title: "This title is set via the context",
          buttonLabel: "Submit",
          inputPlaceholder: "write here",
        });

        return (
          <html>
            <head>
              <meta charset="utf-8" />
              <meta
                http-equiv="x-ua-compatible"
                content="IE=edge"
              />
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

      const html = renderToHtml(<App />, renderOpts);

      expect(html).toMatchSnapshot();
    });

    it("should correctly render jsx with context data and async components", async () => {
      const context = defineContext<{
        title: string;
        inputPlaceholder: string;
        buttonLabel: string;
      }>();

      const Header: JSXTE.Component = async (_, { ctx }) => {
        expect(ctx.has(context)).toBe(true);
        const { title } = ctx.getOrFail(context);

        ctx.set(context, {
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

      const Input: JSXTE.Component = async (_, { ctx }) => {
        expect(ctx.has(context)).toBe(true);
        const { inputPlaceholder } = ctx.getOrFail(context);
        expect(inputPlaceholder).toBe("write here");
        await sleep(50);
        return <input placeholder={inputPlaceholder} />;
      };

      const Button: JSXTE.Component = async (_, { ctx }) => {
        expect(ctx.has(context)).toBe(true);
        const { buttonLabel } = ctx.getOrFail(context);
        expect(buttonLabel).toBe("Submit");
        await sleep(50);
        return <button>{buttonLabel}</button>;
      };

      const Content: JSXTE.Component = () => {
        return <>{[<Header />, <Input />, <Button />]}</>;
      };

      const App: JSXTE.Component = async (_, { ctx }) => {
        ctx.set(context, {
          title: "This title is set via the context",
          buttonLabel: "Submit",
          inputPlaceholder: "write here",
        });

        return (
          <html>
            <head>
              <meta charset="utf-8" />
              <meta
                http-equiv="x-ua-compatible"
                content="IE=edge"
              />
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

      const html = await renderToHtmlAsync(<App />, renderOpts);

      expect(html).toMatchSnapshot();
    });

    it("should correctly override existing context data", async () => {
      const context = defineContext<{
        title: string;
        inputPlaceholder: string;
      }>();

      const Header: JSXTE.Component = async (_, { ctx }) => {
        expect(ctx.has(context)).toBe(true);
        const { title } = ctx.getOrFail(context);
        expect(title).toBe("This title was overridden");
        return <h1>{title}</h1>;
      };

      const Input: JSXTE.Component = async (_, { ctx }) => {
        expect(ctx.has(context)).toBe(true);
        const { inputPlaceholder } = ctx.getOrFail(context);
        expect(inputPlaceholder).toBe("write here");
        await sleep(50);
        return <input placeholder={inputPlaceholder} />;
      };

      const Content: JSXTE.Component = (_, { ctx }) => {
        expect(ctx.has(context)).toBe(true);
        const { title } = ctx.getOrFail(context);
        expect(title).toBe("This title was set in the app component");

        ctx.update(context, {
          title: "This title was overridden",
        });

        return (
          <>
            <Header />
            <Input />
          </>
        );
      };

      const App: JSXTE.Component = async (_, { ctx }) => {
        ctx.set(context, {
          title: "This title was set in the app component",
          inputPlaceholder: "write here",
        });

        return (
          <html>
            <head>
              <meta charset="utf-8" />
              <meta
                http-equiv="x-ua-compatible"
                content="IE=edge"
              />
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

      const html = await renderToHtmlAsync(<App />, renderOpts);

      expect(html).toMatchSnapshot();
    });

    it("should correctly handle provider pattern", () => {
      const myContext = defineContext<{
        title: string;
      }>();

      const Provider = <T,>(
        props: {
          children?: JSX.Element;
          context: ContextDefinition<T>;
          value: T;
        },
        { ctx }: ComponentApi,
      ) => {
        ctx.set(props.context, props.value);
        return <>{props.children}</>;
      };

      const Header: JSXTE.Component = (_, { ctx }) => {
        expect(ctx.has(myContext)).toBe(true);
        const { title } = ctx.getOrFail(myContext);
        expect(title).toBe("Provided title");
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
        return (
          <html>
            <head>
              <meta charset="utf-8" />
              <meta
                http-equiv="x-ua-compatible"
                content="IE=edge"
              />
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
            <Provider
              context={myContext}
              value={{ title: "Provided title" }}
            >
              <body>
                <Content />
              </body>
            </Provider>
          </html>
        );
      };

      const html = renderToHtml(<App />, renderOpts);

      expect(html).toMatchSnapshot();
    });

    it("should correctly drill the prop data through multiple components", async () => {
      const store = defineContext<string>();

      const Title: JSXTE.Component = (_, { ctx }) => {
        const title = ctx.get(store);
        return <p>{title}</p>;
      };

      const Provider = async <T,>(
        props: JSXTE.PropsWithChildren<{
          context: ContextDefinition<T>;
          value: T;
          sleep?: boolean;
        }>,
        { ctx }: ComponentApi,
      ) => {
        if (props.sleep) await sleep(Math.random() * 1000);
        ctx.set(props.context, props.value);
        return <>{props.children}</>;
      };

      const W1 = () => {
        return (
          <div>
            <div>
              <W2 />
            </div>
          </div>
        );
      };

      const W2 = () => {
        return (
          <div>
            <div>
              <W3 />
            </div>
          </div>
        );
      };

      const W3 = () => {
        return (
          <div>
            <div>
              <Title />
            </div>
          </div>
        );
      };

      const html = await renderToHtmlAsync(
        <html>
          <body>
            <Provider
              context={store}
              value={"foo"}
            >
              <div>
                <div>
                  <W1 />
                </div>
              </div>
            </Provider>
          </body>
        </html>,
        renderOpts,
      );

      expect(html).toMatchSnapshot();
    });

    it("close-by providers should not interfere with each other", async () => {
      const store = defineContext<string>();

      const Title: JSXTE.Component = (_, { ctx }) => {
        const title = ctx.getOrFail(store);
        return <p>{title}</p>;
      };

      const Provider = async <T,>(
        props: JSXTE.PropsWithChildren<{
          context: ContextDefinition<T>;
          value: T;
          sleep?: number;
        }>,
        { ctx }: ComponentApi,
      ) => {
        if (props.sleep) await sleep(props.sleep);
        ctx.set(props.context, props.value);
        return <>{props.children}</>;
      };

      const html = await renderToHtmlAsync(
        <html>
          <body>
            <Provider
              context={store}
              value={"foo"}
            >
              <Provider
                sleep={30}
                context={store}
                value={"bar"}
              >
                <Title />
              </Provider>
              {[
                <Provider
                  context={store}
                  value={"baz"}
                >
                  <Title />
                </Provider>,
                <Provider
                  sleep={50}
                  context={store}
                  value={"qux"}
                >
                  <Title />
                </Provider>,
                <Provider
                  sleep={10}
                  context={store}
                  value={"coorg"}
                >
                  <Title />
                </Provider>,
              ]}
              <Provider
                sleep={30}
                context={store}
                value={"fred"}
              >
                <Title />
              </Provider>
              <Provider
                context={store}
                value={"thud"}
              >
                <Title />
              </Provider>
              <Title />
            </Provider>
          </body>
        </html>,
        renderOpts,
      );

      expect(html).toMatchSnapshot();
    });

    it("correctly handles encapsulated providers", () => {
      const makeContextWithProvider = <T,>() => {
        const dctx = defineContext<T>();

        return {
          context: dctx,
          Provider: (
            props: JSXTE.PropsWithChildren<{
              value: T;
            }>,
            { ctx }: ComponentApi,
          ) => {
            ctx.set(dctx, props.value);
            return <>{props.children}</>;
          },
          Consumer: (
            props: { render: (value?: T) => JSX.Element },
            { ctx }: ComponentApi,
          ) => {
            if (ctx.has(dctx)) {
              const value = ctx.get(dctx);
              return <>{props.render(value)}</>;
            } else {
              return <>{props.render()}</>;
            }
          },
        };
      };

      const MagicalContext = makeContextWithProvider<string>();

      const RollTemplate: JSXTE.Component<{ name: string }> = ({
        children,
        name,
      }) => {
        return <div class={`template for-${name}`}>{children}</div>;
      };

      const Repeater: JSXTE.Component<{ name: string }> = ({
        children,
        ...props
      }) => {
        return (
          <MagicalContext.Provider value={`repeating_${props.name}_`}>
            <RollTemplate {...props}>{children}</RollTemplate>
          </MagicalContext.Provider>
        );
      };

      const Input: JSXTE.Component<{ name: string }> = ({ name }) => {
        return (
          <MagicalContext.Consumer
            render={(ctxName) => {
              const fullName = `${ctxName ?? ""}${name}`;
              return (
                <input
                  type="text"
                  name={fullName}
                />
              );
            }}
          />
        );
      };

      const App = () => {
        return (
          <html>
            <body>
              <div id="root">
                <Repeater name="magic">
                  <div>
                    <Input name="dwarf" />
                  </div>
                </Repeater>
              </div>
            </body>
          </html>
        );
      };

      const html = renderToHtml(<App />, renderOpts);

      expect(html).toMatchSnapshot();
    });

    it("Provider and Consumer", () => {
      const MagicalContext = defineContext<string>();

      const Foo: JSXTE.Component<{ id: string }> = (props, { ctx }) => {
        const value = ctx.get(MagicalContext) ?? "no value";
        return (
          <div
            id={props.id}
            class="foo"
          >
            {value}
          </div>
        );
      };

      const App = () => {
        return (
          <html>
            <body>
              <div id="root">
                <Foo id={"1"} />
                <MagicalContext.Consumer
                  render={(v) => <span id="span-1">{v ?? "no value"}</span>}
                />
                <MagicalContext.Provider value="FOO">
                  <Foo id={"2"} />
                  <MagicalContext.Consumer
                    render={(v) => <span id="span-2">{v}</span>}
                  />
                  <MagicalContext.Provider value="BAR">
                    <Foo id={"3"} />
                    <MagicalContext.Consumer
                      render={(v) => <span id="span-3">{v}</span>}
                    />
                  </MagicalContext.Provider>
                </MagicalContext.Provider>
              </div>
            </body>
          </html>
        );
      };

      const html = renderToHtml(<App />, renderOpts);

      expect(html).toMatchSnapshot();
    });
  });

  describe("ErrorBoundary", () => {
    class FallbackBoundary extends ErrorBoundary {
      render(props: JSXTE.ElementProps, contextMap: ComponentApi) {
        return <>{props.children}</>;
      }

      onError(
        error: unknown,
        originalProps: JSXTE.ElementProps,
        contextMap: ComponentApi,
      ): JSX.Element {
        return <h1>Oops. Something went wrong.</h1>;
      }
    }

    it("should correctly render the tree thats inside an ErrorBoundary", () => {
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
              <meta
                http-equiv="x-ua-compatible"
                content="IE=edge"
              />
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
          <FallbackBoundary>
            <Template>
              <div class="main-container">
                <Content />
              </div>
            </Template>
          </FallbackBoundary>
        );
      };

      const structure = <App />;

      const html = renderToHtml(structure, renderOpts);

      expect(html).toMatchSnapshot();
    });

    it("should render the fallback if the direct child throws an error", () => {
      const FailingComponent = (): JSX.Element => {
        throw new Error("I'm failing 1");
      };

      const App = () => {
        return (
          <html>
            <body>
              <FallbackBoundary>
                <FailingComponent />
              </FallbackBoundary>
            </body>
          </html>
        );
      };

      const html = renderToHtml(<App />, renderOpts);

      expect(html).toMatchSnapshot();
    });

    it("should render the fallback if a nested child throws an error", () => {
      const FailingComponent = (): JSX.Element => {
        throw new Error("I'm failing 2");
      };

      const Header = () => {
        return (
          <header>
            <h1>Hello</h1>
            <FailingComponent />
          </header>
        );
      };

      const Body = () => {
        return (
          <body>
            <Header title="Hello World!" />
          </body>
        );
      };

      const App = () => {
        return (
          <html>
            <FallbackBoundary>
              <Body />
            </FallbackBoundary>
          </html>
        );
      };

      const html = renderToHtml(<App />, renderOpts);

      expect(html).toMatchSnapshot();
    });

    it("should render the fallback if a nested async child throws an error", async () => {
      process.on("unhandledRejection", (err, promise) => {
        debugger;
      });

      const FailingComponent = async (): JSX.AsyncElement => {
        await sleep(10).then(() => {
          throw new Error("I'm failing 3");
        });

        return <></>;
      };

      const Header = async (): JSX.AsyncElement => {
        await sleep(10);
        return (
          <header>
            <h1>Hello</h1>
            <FailingComponent />
          </header>
        );
      };

      const Body = async () => {
        await sleep(10);
        return (
          <body>
            <Header title="Hello World!" />
          </body>
        );
      };

      const App = async () => {
        return (
          <html>
            <span>Async test:</span>
            <FallbackBoundary>
              <Body />
            </FallbackBoundary>
          </html>
        );
      };

      const html = await renderToHtmlAsync(<App />, renderOpts);

      expect(html).toMatchSnapshot();
    });
  });

  describe("should correctly perform sub renders", () => {
    describe("sync render", () => {
      it("renders a simple component", () => {
        const App = (_: {}, componentApi: ComponentApi) => {
          const content = componentApi.render(<div>Hello World!</div>);
          return <div>{content}</div>;
        };

        const html = renderToHtml(<App />, renderOpts);

        expect(html).toMatchSnapshot();
      });

      it("rendered computer can access the context defined on the parent", () => {
        const myCtx = defineContext<{ foo: string }>();

        const PrintFoo = (_: {}, componentApi: ComponentApi) => {
          const foo = componentApi.ctx.getOrFail(myCtx).foo;
          return <div>{foo}</div>;
        };

        const Foos = (_: {}, componentApi: ComponentApi) => {
          const foo1 = componentApi.render(<PrintFoo />);
          const foo2 = componentApi.render(<PrintFoo />);

          componentApi.ctx.set(myCtx, { foo: "bar" });

          const foo3 = componentApi.render(<PrintFoo />);

          return (
            <div>
              {foo1}
              {foo2}
              {foo3}
            </div>
          );
        };

        const App = (_: {}, componentApi: ComponentApi) => {
          componentApi.ctx.set(myCtx, { foo: "foo" });
          return (
            <div class="main">
              <Foos />
            </div>
          );
        };

        const html = renderToHtml(<App />, renderOpts);

        expect(html).toMatchSnapshot();
      });
    });

    describe("async render", () => {
      it("renders a simple component", async () => {
        const HelloWorld = async () => {
          await sleep(10);
          return <div>Hello World!</div>;
        };

        const App = async (_: {}, componentApi: ComponentApi) => {
          const content = await componentApi.renderAsync(<HelloWorld />);
          return <div>{content}</div>;
        };

        const html = await renderToHtmlAsync(<App />, renderOpts);

        expect(html).toMatchSnapshot();
      });

      it("rendered computer can access the context defined on the parent", async () => {
        const myCtx = defineContext<{ foo: string }>();

        const PrintFoo = async (_: {}, componentApi: ComponentApi) => {
          await sleep(10);
          const foo = componentApi.ctx.getOrFail(myCtx).foo;
          return <div>{foo}</div>;
        };

        const Foos = async (_: {}, componentApi: ComponentApi) => {
          const foo1 = await componentApi.renderAsync(<PrintFoo />);
          const foo2 = await componentApi.renderAsync(<PrintFoo />);

          componentApi.ctx.set(myCtx, { foo: "async bar" });

          const foo3 = await componentApi.renderAsync(<PrintFoo />);

          return (
            <div>
              {foo1}
              {foo2}
              {foo3}
            </div>
          );
        };

        const App = (_: {}, componentApi: ComponentApi) => {
          componentApi.ctx.set(myCtx, { foo: "async foo" });
          return (
            <div class="main">
              <Foos />
            </div>
          );
        };

        const html = await renderToHtmlAsync(<App />, renderOpts);

        expect(html).toMatchSnapshot();
      });
    });
  });

  it("should correctly handle components returning nulls, undefined and other types", () => {
    const RetUndef = () => undefined;
    const RetNull = () => null;
    const RetTrue = () => true;
    const RetFalse = () => false;
    const RetStr = () => "Hello World";
    const RetNum = () => 1234;

    const Main = () => {
      return (
        <div>
          <div>
            Undef: <RetUndef />
          </div>
          <div>
            Null: <RetNull />
          </div>
          <div>
            True: <RetTrue />
          </div>
          <div>
            False: <RetFalse />
          </div>
          <div>
            Str: <RetStr />
          </div>
          <div>
            Num: <RetNum />
          </div>
        </div>
      );
    };

    const html = renderToHtml(<Main />, renderOpts);

    expect(html).toMatchSnapshot();
  });

  it("should correctly handle component children of type nulls, undefined and other", () => {
    const RetUndef = () => <span>{undefined}</span>;
    const RetNull = () => <span>{null}</span>;
    const RetTrue = () => <span>{true}</span>;
    const RetFalse = () => <span>{false}</span>;
    const RetStr = () => <span>{"Hello World"}</span>;
    const RetNum = () => <span>{1234}</span>;
    const RetArr = () => (
      <span>{[undefined, null, true, false, "hi", 423]}</span>
    );

    const Main = () => {
      return (
        <div>
          <div>
            Undef: <RetUndef />
          </div>
          <div>
            Null: <RetNull />
          </div>
          <div>
            True: <RetTrue />
          </div>
          <div>
            False: <RetFalse />
          </div>
          <div>
            Str: <RetStr />
          </div>
          <div>
            Num: <RetNum />
          </div>
          <div>
            Arr: <RetArr />
          </div>
        </div>
      );
    };

    const html = renderToHtml(<Main />, renderOpts);

    expect(html).toMatchSnapshot();
  });

  it("should correctly render objects implementing toHtmlTag symbol interface", () => {
    class User {
      constructor(
        public firstName: string,
        public lastName: string,
        public age: number,
        public email: string,
        public friends: User[],
      ) {}

      [Symbol.toHtmlTag]() {
        return `${this.firstName} ${this.lastName}`;
      }
    }

    const user = new User("John", "Doe", 30, "johndoe@gmail.com", []);

    const App = () => {
      return (
        <div>
          <div>
            <span>{user}</span>
          </div>
        </div>
      );
    };

    const html = renderToHtml(<App />, renderOpts);

    expect(html).toMatchSnapshot();
  });
};

describe("renderToHTML", () => {
  describe("expanded/pretty", allTests());
  describe("compact", allTests({ compact: true }));

  describe("errors", () => {
    describe("error throw should contain information on which place in the tree the error occurred", () => {
      const Failing = () => {
        throw new Error("I'm failing 4");
      };

      it("scenario 1", () => {
        expect.assertions(1);
        try {
          renderToHtml(
            <html>
              <body>
                <div>
                  <Failing />
                </div>
              </body>
            </html>,
          );
        } catch (err) {
          expect(err).toMatchSnapshot();
        }
      });

      it("scenario 2", () => {
        expect.assertions(1);
        try {
          const Main = () => {
            return (
              <html>
                <body>
                  <div>
                    <Failing />
                  </div>
                </body>
              </html>
            );
          };
          renderToHtml(<Main />);
        } catch (err) {
          expect(err).toMatchSnapshot();
        }
      });

      it("scenario 3", () => {
        expect.assertions(1);
        try {
          const Html = (props: JSXTE.PropsWithChildren<{}>) => {
            return (
              <html>
                <body>{props.children}</body>
              </html>
            );
          };

          const Wrapper = (props: JSXTE.PropsWithChildren<{}>) => {
            return <div>{props.children}</div>;
          };

          const FailsEventually = () => {
            return (
              <span>
                <Failing></Failing>
              </span>
            );
          };

          const Main = () => {
            return (
              <Html>
                <div>
                  <Wrapper>
                    <FailsEventually />
                  </Wrapper>
                </div>
              </Html>
            );
          };
          renderToHtml(<Main />);
        } catch (err) {
          expect(err).toMatchSnapshot();
        }
      });

      it("scenario 4", async () => {
        expect.assertions(1);
        try {
          const Html = async (props: JSXTE.PropsWithChildren<{}>) => {
            return (
              <html>
                <body>{props.children}</body>
              </html>
            );
          };

          const Wrapper = async (props: JSXTE.PropsWithChildren<{}>) => {
            return <div>{props.children}</div>;
          };

          const Failing = async () => {
            throw new Error("I'm failing async 1");
          };

          const FailsEventually = async () => {
            return (
              <span>
                <Failing></Failing>
              </span>
            );
          };

          const Main = () => {
            return (
              <Html>
                <div>
                  <Wrapper>
                    <FailsEventually />
                  </Wrapper>
                </div>
              </Html>
            );
          };
          await renderToHtmlAsync(<Main />);
        } catch (err) {
          expect(err).toMatchSnapshot();
        }
      });

      it("scenario 5", async () => {
        expect.assertions(1);
        try {
          const Html = async (props: JSXTE.PropsWithChildren<{}>) => {
            return (
              <html>
                <body>{props.children}</body>
              </html>
            );
          };

          const Wrapper = async (props: JSXTE.PropsWithChildren<{}>) => {
            return <div>{props.children}</div>;
          };

          const Failing = async () => {
            throw new Error("I'm failing async 2");
          };

          const FailsEventually = async () => {
            return (
              <span>
                <>
                  <Failing></Failing>
                  {"lol"}
                </>
              </span>
            );
          };

          const Main = () => {
            return (
              <Html>
                <div>
                  <Wrapper>
                    <>
                      <FailsEventually />
                    </>
                  </Wrapper>
                </div>
              </Html>
            );
          };
          await renderToHtmlAsync(<Main />);
        } catch (err) {
          expect(err).toMatchSnapshot();
        }
      });
    });
  });
});
