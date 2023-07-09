## 3.0.0 (July 9, 2023)

### Features

- #### feat: ContextMap replaced with ComponentApi ([#160](https://github.com/ncpa0cpl/jsxte/pull/160))

  Replaced the `ContextMap` argument that was available to to all components with a new `ComponentApi`. Contexts can still be accessed via the new API, via the `ComponentApi.ctx` property. Additionally the new api provides a `render` method, which can be used similarly to the `renderToHtml`, but the context's data will get forwarded to the rendered components.
