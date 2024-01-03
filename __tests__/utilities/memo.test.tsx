import { describe, expect, it } from "vitest";
import {
  type ComponentApi,
  defineContext,
} from "../../src/component-api/component-api";
import {
  renderToHtml,
  renderToHtmlAsync,
} from "../../src/html-renderer/render-to-html";
import { jsx } from "../../src/jsx/jsx-runtime";
import { memo } from "../../src/utilities/memo";

const sleep = (t: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), t));

describe("memo", () => {
  it("should correctly memoize the component", () => {
    let variable = "Hello World";

    const MemoizedComponent = memo(() => {
      return <h1>{variable}</h1>;
    });

    const Root = () => {
      return (
        <div id="root">
          <MemoizedComponent />
        </div>
      );
    };

    const render1 = renderToHtml(<Root />);

    variable = "Bye cruel world";

    const render2 = renderToHtml(<Root />);

    expect(render1).toEqual(render2);
    expect(render1).toMatchSnapshot();
  });

  it("should \"forget\" memoized results that are past expire time", async () => {
    let variable = "Hello World";

    const MemoizedComponent = memo(
      () => {
        return <h1>{variable}</h1>;
      },
      { maxCacheAge: 100 },
    );

    const Root = () => {
      return (
        <div id="root">
          <MemoizedComponent />
        </div>
      );
    };

    const render1 = renderToHtml(<Root />);

    variable = "Bye cruel world";

    const render2 = renderToHtml(<Root />);

    expect(render1).toEqual(render2);

    await sleep(150);

    const render3 = renderToHtml(<Root />);

    expect(render1).not.toEqual(render3);
    expect(render3).toMatchSnapshot();
  });

  it("memoized components should have access to the context of it's parent", () => {
    const Context = defineContext<{ foo: string }>();

    const MemoizedComponent = memo((_: {}, { ctx }) => {
      return <h1>{ctx.getOrFail(Context).foo}</h1>;
    });

    const Root = (_: {}, { ctx }: ComponentApi) => {
      ctx.set(Context, { foo: "Hello" });

      return (
        <div id="root">
          <MemoizedComponent />
        </div>
      );
    };

    const render1 = renderToHtml(<Root />);

    expect(render1).toMatchSnapshot();
  });

  it("children of the memoized components should have access to the top level context", () => {
    const Context = defineContext<{ foo: string }>();

    const MemoChild = (_: {}, { ctx }: ComponentApi) => {
      return <h1>{ctx.getOrFail(Context).foo}</h1>;
    };

    const MemoizedComponent = memo((_: {}, context) => {
      return (
        <div>
          <MemoChild />
        </div>
      );
    });

    const MemoParent = (_: {}, context: ComponentApi) => {
      return (
        <div>
          <MemoizedComponent />
        </div>
      );
    };

    const Root = (_: {}, { ctx }: ComponentApi) => {
      ctx.set(Context, { foo: "Hello" });

      return (
        <div id="root">
          <MemoParent />
        </div>
      );
    };

    const render1 = renderToHtml(<Root />);

    expect(render1).toMatchSnapshot();
  });

  it("asynchronous memoized components should works as expected", async () => {
    let variable = "Hello World";

    const MemoizedComponent = memo(
      async () => {
        await sleep(100);

        return <h1>{variable}</h1>;
      },
      { renderAsynchronously: true },
    );

    const Root = () => {
      return (
        <div id="root">
          <MemoizedComponent />
        </div>
      );
    };

    const render1 = await renderToHtmlAsync(<Root />);

    variable = "Bye cruel world";

    const render2 = await renderToHtmlAsync(<Root />);

    expect(render1).toEqual(render2);
    expect(render1).toMatchSnapshot();
  });

  it("memoized component should still re-render when props change", () => {
    const MemoizedComponent = memo((props: { foo: string }) => {
      return <h1>{props.foo}</h1>;
    });

    const Root = (props: { foo: string }) => {
      return (
        <div id="root">
          <MemoizedComponent foo={props.foo} />
        </div>
      );
    };

    const render1 = renderToHtml(<Root foo="a" />);

    const render2 = renderToHtml(<Root foo="b" />);

    expect(render1).not.toEqual(render2);
  });
});
