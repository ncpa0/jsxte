## 3.0.1 (August 19, 2023)

### Features

- #### chore: added a sideEffect property to package.json ([#181](https://github.com/ncpa0/jsxte/pull/181))

  Added a sideEffect property to package.json to allow for tree-shaking.

## 3.0.0 (July 9, 2023)

### Features

- #### feat: added helper methods to the context: Provider and Consumer ([#161](https://github.com/ncpa0cpl/jsxte/pull/161))

  Added two helper methods to the Context object. A `Provider` and a `Consumer` are JSXTE Components that provide similar functionality to the React's Context.

  ### Example

  ```tsx
  const myCtx = defineContext<{ foo: string }>;

  const App = () => {
    return (
      <myCtx.Provider value={{ foo: "hello" }}>
        <myCtx.Consumer render={(cv) => <span>{cv.foo}</span>} />
      </myCtx.Provider>
    );
  };
  ```

- #### feat: ContextMap replaced with ComponentApi ([#160](https://github.com/ncpa0cpl/jsxte/pull/160))

  Replaced the `ContextMap` argument that was available to to all components with a new `ComponentApi`. Contexts can still be accessed via the new API, via the `ComponentApi.ctx` property. Additionally the new api provides a `render` method, which can be used similarly to the `renderToHtml`, but the context's data will get forwarded to the rendered components.
