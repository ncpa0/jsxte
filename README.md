# JSX Template Engine

A JSX based html templating engine for browsers or Node environments.

## Getting started

To use the `jsxte` you will have to set up your transpiler to use this package for transforming the JSX syntax, if you use typescript for transpiling all you have to do is set these options in the tsconfig:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "jsxte"
  }
}
```

If you use something else, like babel you will also need to adapt the configuration of that, for example: https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#with-a-configuration-file-recommended

Once you are done with that you can start writing your templates and rendering them.

```tsx
import { renderToHtml } from "jsxte";

const Header = (props: { label: string }) => {
  return <h1>{props.label}</h1>;
};

const App = (props: { label: string }) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Header label={props.label} />
      </body>
    </html>
  );
};

const html = renderToHtml(<App label="Hello World!" />);
// OR
const html = renderToHtml(jsx(App, { label: "Hello World!" }));
```

## Asynchronous Components

In case you use the templates in a server app in a Node environment you might want to include some data from the database in the html you serve to the client. To make it easier to fetch what's needed and marry it with the templates you can make your components asynchronous and send async requests from within them.

```tsx
import { renderToHtmlAsync } from "jsxte";

const Header = () => {
  return <h1>Hello World</h1>;
};

const ToDoList = async () => {
  const todos = await fetchMyTodosFromDB();

  return (
    <table>
      <thead>
        <tr>
          <th>Label</th>
          <th>Is Done?</th>
        </tr>
      </thead>
      <tbody>
        {todos.map((todo) => (
          <tr>
            <td>{todo.label}</td>
            <td>{todo.isDone ? "yes" : "no"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const App = () => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Header />
        <h3>ToDo's:</h3>
        <ToDoList />
      </body>
    </html>
  );
};

// If your component contains an asynchronous component at any point, `renderToHtmlAsync` needs to be used instead of `renderToHtml`
const html = await renderToHtmlAsync(<App label="Hello World!" />);
```

## Express JS View Engine

You can also use `jsxte` with the Express View Engine. To do that, use the `expressExtend` to add the engine support, specify the views directory and then use the express response method `.render()`. The `.render()` method takes the component props as it's second argument.

```ts
import express from "express";
import { expressExtend } from "jsxte";

const app = express();
expressExtend(app);

app.set("views", path.resolve(__dirname, "views"));

app.get("/", (_, resp) => {
  const indexProps = {
    /* ... */
  };
  resp.render("index", indexProps); // will render the `index.js` component located in the ./views file
});
```

For this approach to work, the JSX Components must be exported as defaults (ex. `export default () => <div></div>` or `exports.default = () => <div></div>`) and the views must be transpiled to `.js` files.

## Rendering to a string tag template

A [string tag template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) is special type of function that can be used for custom parsing of template literals.

JSXTE allows you to leverage any existing string tag templates but with a JSX syntax instead of a template literal.

### Example

```tsx
// using template literal:
import { html } from "some-library";
const props = {
  /* ... */
};
const result = html`<div class="${props.className}">
  <h1>${props.header}</h1>
</div>`;

// using JSXTE:
import { renderToStringTemplateTag } from "jsxte";
import { html } from "some-library";
const props = {
  /* ... */
};
const result = renderToStringTemplateTag(
  html,
  <div class={props.className}>
    <h1>{props.header}</h1>
  </div>
);
```

If the string tag template function uses non standard html attribute names (ex. `className` instead of `class` or `@click` instead of `onclick`) you can map the attribute names render by this method by specifying mapping for those:

```tsx
const result = renderToStringTemplateTag(
  html,
  <div>
    <button class="my-class" onclick={handler}>
      Click Me
    </button>
  </div>,
  {
    attributeMap: {
      onclick: "@click",
      class: "className",
    },
  }
);
```
