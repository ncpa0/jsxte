import "../../src/jsx/jsx.types";
import { renderToHTML } from "../../src/parser/render-to-html";
// @ts-ignore
import { jsx, Fragment } from "../../src/jsx/jsx-runtime";
import { TJSXComponent } from "../../src/jsx/jsx.types";

describe("renderToHTML", () => {
  it("should correctly generate html from simple jsx", () => {
    const Component: TJSXComponent<{ title: string }> = (props) => {
      return (
        <div id="container" class={"bordered active"}>
          <h1>Hello World</h1>
          <h2>{props.title}</h2>
        </div>
      );
    };

    const html = renderToHTML(Component, { title: "Prop Title" });

    expect(html).toMatchSnapshot();
  });

  it("should correctly generate html from component base jsx structure", () => {
    const Header: TJSXComponent<{ title: string }> = (props) => {
      return <h2>{props.title}</h2>;
    };

    const Button: TJSXComponent<{ label: string; styles?: string }> = (
      props
    ) => {
      return <button style={props.styles}>{props.label}</button>;
    };

    const Template: TJSXComponent = ({ children }) => {
      return (
        <html>
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
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

    const Content: TJSXComponent = () => {
      return (
        <>
          <Header title="Hello World!" />
          <input value="write here" />
          <Button label="Submit" />
        </>
      );
    };

    const App: TJSXComponent = () => {
      return (
        <Template>
          <div class="main-container">
            <Content />
          </div>
        </Template>
      );
    };

    const html = renderToHTML(App, {});

    expect(html).toMatchSnapshot();
  });
});
