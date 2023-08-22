## 3.1.0 (August 22, 2023)

### Features

- #### feat: added a json renderer ([#185](https://github.com/ncpa0/jsxte/pull/185))

  Added a new renderer that can generate a JSON structure instead of html. Api for it looks similar to `renderToHtml` with the only difference being it does not accept any indentation option.

- #### feat: optimized the code (for..let loops over for..of, faster string join algo, etc.) ([#184](https://github.com/ncpa0/jsxte/pull/184))

  Added code optimizations:
  
  1. Instead of `for..of` loops that rely on iterators used the good ol' `for..let i = 0;` loops which are much faster
  2. Replaced all usages of `String.join()` with a much faster custom implementation
  3. Reduced the amount of needless object instantiations, (there were some places where a new object or array was created for convenience reasons, but was not really necessary) - this should slightly reduce the required GC time for cases where a lot of JSX is being processed.
  4. JSX Elements props and children are made immutable up-front via `Object.freeze`

- #### feat: improvements to the `renderToStringTemplateTag` ([#183](https://github.com/ncpa0/jsxte/pull/183))

  Multiple improvements to the render function for string template tags:
  
  - New `<Interpolate>` and `<InterpolateTag>` components. Contents of those will be interpolated into the string template as is for Interpolate, and as a rendered tag for InterpolateTag (see JSDoc comments on those for more details.
  - Falsy values passed to the attributes will prevent those attributes from being added at all, while truthy values will cause those attributes to be added with their names as values.
  - Caching mechanism to allow for the same input to provide the exact same TemplateStringArray reference to the tag on every call.

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
