import { ComponentApi } from "../component-api/component-api";
import { ErrorBoundary } from "../error-boundary/error-boundary";
import { createElement } from "../jsx-runtime";
import { SELF_CLOSING_TAG_LIST } from "../utilities/self-closing-tag-list";
import { Interpolate, InterpolateTag } from "./interpolate";
import { mapAttributeName } from "./map-attribute-name";
import type { StringTemplateParserOptions } from "./render-to-string-template-tag";
import { resolveElement } from "./resolve-element";
import type { StringTemplateTag } from "./string-template-tag-type";
import { toTemplateStringArray } from "./to-template-string-array";

export type StringTemplateParserInternalOptions =
  StringTemplateParserOptions & {
    tag: StringTemplateTag<any>;
  };

const isSyncElem = (e: JSX.Element): e is JSXTE.SyncElement => true;

type TagFunctionArgs = [string[], any[]];

const concatToLastStringOrPush = (a: TagFunctionArgs, s?: string) => {
  if (s) {
    if (a[0][a[0].length - 1] !== undefined) {
      a[0][a[0].length - 1] += s;
    } else {
      a[0].push(s);
    }
  }
};

export const jsxElemToTagFuncArgsSync = (
  element: JSX.Element,
  options: StringTemplateParserInternalOptions,
  _componentApi: ComponentApi = ComponentApi.create(),
): TagFunctionArgs => {
  const { attributeMap = {} } = options;

  const componentApi = _componentApi
    ? ComponentApi.clone(_componentApi)
    : ComponentApi.create({ attributeMap });

  if (!isSyncElem(element)) throw new Error("");

  if (element.type === "textNode") {
    return [["", ""], [element.text]];
  }

  if (typeof element.tag !== "string") {
    if (ErrorBoundary._isErrorBoundary(element.tag)) {
      const boundary = new element.tag(element.props);

      try {
        const subElem = boundary.render(
          element.props,
          componentApi,
        ) as any as JSXTE.SyncElement;

        if (subElem instanceof Promise) {
          throw new Error(
            `Encountered an async Component: [${element.tag.name}.render] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`,
          );
        }

        return jsxElemToTagFuncArgsSync(subElem, options, componentApi);
      } catch (e) {
        const fallbackElem = boundary.onError(
          e,
          element.props,
          componentApi,
        ) as any as JSXTE.SyncElement;

        if (fallbackElem instanceof Promise) {
          throw new Error(
            `Encountered an async Component: [${element.tag.name}.onError] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`,
          );
        }

        return jsxElemToTagFuncArgsSync(fallbackElem, options, componentApi);
      }
    }

    if (Interpolate._isInterpolate(element.tag)) {
      const results: TagFunctionArgs = [[], []];

      results[0].push("", "");
      results[1].push(element.props.children);

      return results;
    }

    if (InterpolateTag._isInterpolateRender(element.tag)) {
      const results: TagFunctionArgs = [[], []];

      const [tmpTsa, params] = jsxElemToTagFuncArgsSync(
        createElement("", element.props),
        options,
      );
      const templateStringArray = toTemplateStringArray(tmpTsa);

      results[0].push("", "");
      results[1].push(options.tag(templateStringArray, ...params));

      return results;
    }

    const subElem = element.tag(
      element.props,
      componentApi,
    ) as any as JSXTE.SyncElement;

    if (subElem instanceof Promise) {
      throw new Error(
        `Encountered an async Component: [${element.tag.name}] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`,
      );
    }

    return jsxElemToTagFuncArgsSync(subElem, options, componentApi);
  } else {
    const { attributes, children } = resolveElement(element);

    if (element.tag === "") {
      const results: TagFunctionArgs = [[], []];

      for (let i = 0; i < children.length; i++) {
        const child = children[i]!;
        const [[first, ...strings], tagParams] = jsxElemToTagFuncArgsSync(
          child,
          options,
          componentApi,
        );

        concatToLastStringOrPush(results, first);

        results[0] = results[0].concat(strings);
        results[1] = results[1].concat(tagParams);
      }

      return results;
    } else {
      const isSelfClosingTag =
        children.length === 0 && SELF_CLOSING_TAG_LIST.includes(element.tag);

      const results: TagFunctionArgs = [[], []];

      results[0].push(`<${element.tag}`);

      const attrList = Object.entries(attributes);
      for (let index = 0; index < attrList.length; index++) {
        const [attrName, value] = attrList[index]!;

        if (value === false || value === null || value === undefined) {
          continue;
        }

        concatToLastStringOrPush(
          results,
          ` ${mapAttributeName(attrName, attributeMap)}="`,
        );

        results[1].push(value === true ? attrName : value);
        results[0].push('"');
      }

      if (isSelfClosingTag) {
        concatToLastStringOrPush(results, "/>");
      } else {
        concatToLastStringOrPush(results, ">");

        for (let i = 0; i < children.length; i++) {
          const child = children[i]!;
          const [[first, ...strings], tagParams] = jsxElemToTagFuncArgsSync(
            child,
            options,
            componentApi,
          );

          concatToLastStringOrPush(results, first);

          results[0] = results[0].concat(strings);
          results[1] = results[1].concat(tagParams);
        }

        concatToLastStringOrPush(results, `</${element.tag}>`);
      }

      return results;
    }
  }
};
