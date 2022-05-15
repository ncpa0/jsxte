# JSX Template Engine

A JSX based templating engine for browsers or Node environments.

## Getting started

To use the JSX Template Engine you will have to set up your transpiler to use this package for trnasforming the JSX syntax, if you use typescript for transpiling all you have to do is set these options in the tsconfig:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "jsx-template-engine"
  }
}
```

If you use something else, like babel you will also need to adapt the configuration of that, for example: https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#with-a-configuration-file-recommended

Once you are done with that you can start writing your templates and rendering them.

```tsx
import { renderToHtml } from "jsx-template-engine";

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

const html = renderToHtml(App, { label: "Hello World!" });
```

## Asynchronous Components

In case you use the templates in a server app in a Node environemnt you might want to include some data from the database in the html you serve to the client. To make it easier to fetch what's needed and marry it with the templates you can make your components asynchronous and send async requests from within them.

```tsx
import { renderToHtmlAsync } from "jsx-template-engine";

const Header = () => {
  return <h1>Hello World</h1>;
};

const ToDoList = async () => {
  const todos = await fetchMyTodosFromDB();

  return (
    <table>
        <thenad>
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
const html = await renderToHtmlAsync(App, { label: "Hello World!" });
```
