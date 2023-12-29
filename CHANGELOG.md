## 3.1.9 (December 29, 2023)

### Bug Fixes

- #### fix: missing meta properties and button disabled prop type ([#272](https://github.com/ncpa0/jsxte/pull/272))

  Added the missing `<meta>` tag properties to the prop type definitions (`property` and `media`).

  Fixed the typing on the `<button>` disabled property.

## 3.1.8 (December 5, 2023)

### Features

- #### feat: removed fragments from the render error's component traces ([#258](https://github.com/ncpa0/jsxte/pull/258))

  In the previous version a new feature was added that added component traces to the rendering errors. As a result you would see error messages that looked like this:

  ```
  JsxteRendererError: The below error has occurred in:
    <html>
    <body>
    <div>
    <>
    <span>

    Rendering has failed due to an error...
  ```

  These messages have been updated to omit fragments from these traces, i.e. `<>` tags will no longer appear in the error message traces.

- #### feat: added types for the search tag ([#256](https://github.com/ncpa0/jsxte/pull/256))

  Added a type definition for the newly standardized `<search>` tag.

### Bug Fixes

- #### fix: incorrect function name exported from jsx-dev-runtime ([#257](https://github.com/ncpa0/jsxte/pull/257))

  The `jsx-dev-runtime` export is supposed to provide a named exported function under the name `jsxDEV`, that however was not the case, as it was only exporting functions that were named identically to those from `jsx-runtime`.

- #### fix: meta's name and link's rel attribute types prevented valid values ([#255](https://github.com/ncpa0/jsxte/pull/255))

  Type for the `<meta>`'s `name` attribute was preventing valid values from being used, same for the `<link>`'s `rel` attribute. These attributes will now allow any string to be used.

## 3.1.7 (November 5, 2023)

### Features

- #### feat: added component traces to errors ([#236](https://github.com/ncpa0/jsxte/pull/236))

  Added traces to errors thrown by the renderer to allow easier debugging. This is achieved by catching any errors during rendering and when that happens, throwing custom errors instead. Original errors can still be accessed via the `.cause` property.

  ### Example

  If an error occurs in a component called `MyComponent` you might see an error like this:

  ```
  JsxteRendererError: The below error has occurred in:
  <App>
  <html>
  <body>
  <Layout>
  <div>
  <MyComponent>

  Rendering has failed due to an error: <Actual error message>
  ```

  #### Accessing the original error

  ```tsx
  try {
    const html = renderToHtml(<App />);
  } catch (error) {
    error; // -> JsxteRendererError
    error.cause; // -> original error
  }
  ```

- #### feat: added toHtmlTag symbol ([#235](https://github.com/ncpa0/jsxte/pull/235))

  Added a special symbol that allows to determine how an object should be stringified when used as a child of a JSX element.

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

  The above will produce this result:

  ```html
  <div>User: Johny</div>
  ```

- #### feat: added jsx-dev-runtime to the exported paths ([#234](https://github.com/ncpa0/jsxte/pull/234))

  Added a new export under `jsxte/jsx-dev-runtime`, atm it exports the exact same functions as the `jsxte/jsx-runtime`. This should prevent build errors when the "jsx" build option is set to `jsx-reactdev`. This change specifically targets Bun, which always assumes this settings unless NODE_ENV is set to `production`.

### Bug Fixes

- #### fix: add "canonical" as allowed attribute for link-rel ([#231](https://github.com/ncpa0/jsxte/pull/231))

## 3.1.6 (October 23, 2023)

### Features

- #### feat: Add view-transition as allowed name for meta-tag. ([#225](https://github.com/ncpa0/jsxte/pull/225))

  Updated types for the `<meta>` tag to allow for the `view-transition` as name attribute value.

- #### feat: allow null, undefined, booleans, string and numbers as jsx elements ([#221](https://github.com/ncpa0/jsxte/pull/221))

  It is now possible to return other things from function components than elements created via `createElement` or JSX syntax. Anything that is not an object, string or number will be treated as if `<></>` was returned, returned strings and numbers will be treated as `<>{value}</>`, objects are expected to be elements created via `createElement` or JSX syntax (no change here).

  This means that the following components are now possible:

  ```tsx
  function MyComponent() {
    return !!condition && <div>...</div>;
  }

  function MyComponent() {
    return "Hello";
  }

  function MyComponent() {
    return 2023;
  }

  // ok
  renderToHtml(
    <div>
      <MyComponent />
    </div>,
  );
  ```

## 3.1.5 (October 10, 2023)

### Bug Fixes

- #### fix: types for specific elements were missing ([#218](https://github.com/ncpa0/jsxte/pull/218))

  Types for many elements were missing, this was because types for them were defined as a namespace interfaces in standalone files that were never imported and therefore TypeScript would never load them.

## 3.1.4 (September 16, 2023)

### Bug Fixes

- #### fix: self closing tags ([#203](https://github.com/ncpa0/jsxte/pull/203))

  Fixed the issue with the html renderer always producing a separate closing tag, even in cases where the tag could be self closing.

## 3.1.3 (September 5, 2023)

### BREAKING CHANGES

- #### fix: removed prop types exports ([#193](https://github.com/ncpa0/jsxte/pull/193))

  Exports of all tags prop types were removed, instead those are available via the `JSXTE` global namespace.

### Bug Fixes

- #### fix: as attribute typing for link tag ([#193](https://github.com/ncpa0/jsxte/pull/193))

  Added missing property from the `<link>` tag's prop type, the `as` attribute.

## 3.1.2 (August 27, 2023)

### Bug Fixes

- #### fix: export the InputType type ([#189](https://github.com/ncpa0/jsxte/pull/189))

- #### fix: Add "email" to InputTypes ([#188](https://github.com/ncpa0/jsxte/pull/188))

## 3.1.1 (August 24, 2023)

### Bug Fixes

- #### fix: added `number` as a possible type for input attributes `step` and `value` ([#187](https://github.com/ncpa0/jsxte/pull/187))

  Added `number` as a possible type for input attributes `step` and `value`.

- #### fix: added a few event handler property types that were missing ([#186](https://github.com/ncpa0/jsxte/pull/186))

  Typing for the JSX html elements were missing some of the event handlers attributes (`onpointer` events, `onfocusin` etc.). This is fixed now.

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
