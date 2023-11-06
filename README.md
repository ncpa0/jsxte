# JSX Template Engine

![NPM](https://img.shields.io/npm/l/jsxte?style=for-the-badge) [![npm](https://img.shields.io/npm/v/jsxte?style=for-the-badge)](https://www.npmjs.com/package/jsxte) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/jsxte?style=for-the-badge) ![GitHub last commit](https://img.shields.io/github/last-commit/ncpa0cpl/jsxte?style=for-the-badge)

A JSX based html templating engine for browsers or Node environments.

1. [Getting started](#getting-started)
   1. [Installation](#installation)
   2. [Building](#building)
2. [Examples](#examples)
3. [Asynchronous Components](#asynchronous-components)
4. [Context](#context)
   1. [Example](#example)
   2. [Provider/Consumer Pattern](#providerconsumer-pattern)
5. [Error Boundaries](#error-boundaries)
   1. [Example](#example-1)
6. [toHtmlTag symbol](#tohtmltag-symbol)
7. [Extending the typings](#extending-the-typings)
   1. [Adding custom web component tags](#adding-custom-web-component-tags)
   2. [Adding a global html attribute](#adding-a-global-html-attribute)
8. [Express JS View Engine](#express-js-view-engine)
9. [Rendering to a string tag template](#rendering-to-a-string-tag-template)
   1. [Example](#example-2)
10. [Monkey-Patching type definitions](#monkey-patching-type-definitions)
11. [Contributing](#contributing)

## Getting started

### Installation

```bash
npm i jsxte
```

or

```bash
yarn add jsxte
```

### Building

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

(See example configurations [here](./docs/config-examples/)).

Once you are done with that you can start writing your templates and rendering them.

```tsx
import { renderToHtml, createElement } from "jsxte";

const Header: JSXTE.Component<{ label: string }> = (props) => {
  return <h1>{props.label}</h1>;
};

const App: JSXTE.Component<{ label: string }> = (props) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          http-equiv="X-UA-Compatible"
          content="IE=edge"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </head>
      <body>
        <Header label={props.label} />
      </body>
    </html>
  );
};

const html = renderToHtml(<App label="Hello World!" />);
// OR
const html = renderToHtml(createElement(App, { label: "Hello World!" }));
```

## Examples

Check out these example repositories:

- [(Express + TypeScript) TODO App](https://github.com/ncpa0/jsxte-with-typescript-example)
- [(Express + Babel) TODO App](https://github.com/ncpa0/jsxte-with-babel-example)

## Asynchronous Components

In case you use the templates in a server app in a Node environment you might want to include some data from the database in the html you serve to the client. To make it easier to fetch what's needed and marry it with the templates you can make your components asynchronous and send async requests from within them.

```tsx
import { renderToHtmlAsync } from "jsxte";

const Header: JSXTE.Component = () => {
  return <h1>Hello World</h1>;
};

const ToDoList: JSXTE.Component = async () => {
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

const App: JSXTE.Component = () => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          http-equiv="X-UA-Compatible"
          content="IE=edge"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
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

## Context

Context Map is a interface provided to each functional component that provides a mechanism for providing any arbitrary data to it's descendant. This is primarily to avoid the prop-drilling.

### Example

```tsx
import { defineContext } from "jsxte";

const myContext = defineContext<{ label: string }>();

const App: JSXTE.Component = (props, componentApi) => {
  // Set the context to a new value, all descendants of this component will have access to it
  componentApi.ctx.set(myContext, { label: "Hello" });

  return <Foo />;
};

const Foo: JSXTE.Component = (props, componentApi) => {
  let label = "";

  // Check if `myContext` is being provided by any of the ancestors
  if (componentApi.ctx.has(myContext)) {
    // Retrieve the context data
    label = componentApi.ctx.getOrFail(myContext).label;
  }

  return <p>{label}</p>;
};
```

### Provider/Consumer Pattern

Context also provides a Provider and a Consumer components.

```tsx
const MyContext = defineContext<string>();

const App: JSXTE.Component = () => {
  return (
    <MyContext.Provider value={"Hello World!"}>
      <div>
        <MyContext.Consumer
          render={(providedValue) => <h1>{providedValue ?? ""}</h1>}
        />
      </div>
    </MyContext.Provider>
  );
};
```

## Error Boundaries

Error boundaries are components that catch errors thrown by their children and allow you to display a fallback UI instead of having the rendering outright fail.

Error boundaries work with both synchronous and asynchronous components. But the `onError` handler should never return an asynchronous component.

### Example

```tsx
import { ErrorBoundary, renderToHtml } from "jsxte";

class Boundary extends ErrorBoundary {
  render(props: JSXTE.ElementProps, componentApi: ComponentApi) {
    return <>{props.children}</>;
  }

  onError(
    error: unknown,
    originalProps: JSXTE.ElementProps,
    componentApi: ComponentApi,
  ) {
    return <h1>Something went wrong!</h1>;
  }
}

const FailingComponent: JSXTE.Component = () => {
  throw new Error("Unexpected failure!");
};

const html = renderToHtml(
  <div>
    <Boundary>
      <FailingComponent />
    </Boundary>
  </div>,
);

// html:
// <div>
//   <h1>Something went wrong!</h1>
// </div>
```

## toHtmlTag symbol

`Symobl.toHtmlTag` is a special symbol that allows to determine how an object should be stringified when used as a child of a JSX element.

### Example

```tsx
class User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
  ) {}

  [Symbol.toHtmlTag]() {
    return `User: ${this.username}`;
  }
}

const user = new User("001", "Johny", "johny0169@gmail.com");

renderToHtml(<div>{user}</div>);
```

Result:

```html
<div>User: Johny</div>
```

## Extending the typings

JSXTE should be able to parse any html attributes you put in, as well as custom web component tags, although you may see type errors if you use anything that is not defined in the library typings. If you wish to use them it is recommended you extend the typings to disable said errors.

### Adding custom web component tags

To add a typing for a custom web component simply add a declare block in one of your project `.ts` or `.tsx` files, like this one:

```tsx
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "my-custom-web-component": {
        /* here include the attributes your component can take */
        "data-example-attribute"?: string;
      };
    }
  }
}

// with it it's possible to use this without type errors:
const MyComponent: JSXTE.Component = () => (
  <my-custom-web-component data-example-attribute="Hello"></my-custom-web-component>
);
```

### Adding a global html attribute

There is a dictionary of html attributes that are available for every default html tag, that dictionary can be extended like so:

```tsx
declare global {
  namespace JSXTE {
    interface BaseHTMLTagProps {
      "new-attribute"?: string;
    }
  }
}

// with it it's possible to use this without type errors:
const MyComponent = () => <div new-attribute="Hello"></div>;
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
  </div>,
);
```

If the string tag template function uses non standard html attribute names (ex. `className` instead of `class` or `@click` instead of `onclick`) you can map the attribute names render by this method by specifying mapping for those:

```tsx
const result = renderToStringTemplateTag(
  html,
  <div>
    <button
      class="my-class"
      onclick={handler}
    >
      Click Me
    </button>
  </div>,
  {
    attributeMap: {
      onclick: "@click",
      class: "className",
    },
  },
);
```

## Monkey-Patching type definitions

It is possible to monkey-patch type definition of all HTML tags and add new attributes to them.

#### Extend prop types of a specific tag

The following adds a new attribute to the `<div />` tag - `data-my-attr`:

```tsx
declare global {
  namespace JSXTE {
    interface DivTagProps {
      "data-my-attr"?: string;
    }
  }
}
```

#### Extends prop of all html tags

The following adds a new attribute to all html tags - `hx-post`:

```tsx
declare global {
  namespace JSXTE {
    interface BaseHTMLTagProps {
      "hx-post"?: string;
    }
  }
}
```

#### Change the accepted type for a specific attribute

The following adds a `Function` type to the `onclick` attribute of all html tags:

```tsx
declare global {
  namespace JSXTE {
    interface AttributeAcceptedTypes {
      onclick?: Function;
    }
  }
}
```

## Contributing

If you want to contribute please See [CONTRIBUTING.md](./CONTRIBUTING.md)
