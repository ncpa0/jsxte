import { mapAttributeName } from "./map-attribute-name";
import { resolveElement } from "./resolve-element";

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
  attributeMap: Record<string, string>
): TagFunctionArgs => {
  if (!isSyncElem(element)) throw new Error("");

  if (element.type === "textNode") {
    return [["", ""], [element.text]];
  }

  if (typeof element.tag !== "string") {
    const subElem = element.tag(element.props) as any as JSXTE.SyncElement;

    if (subElem instanceof Promise) {
      throw new Error(
        `Encountered an async Component: [${element.tag.name}] Asynchronous Component's cannot be parsed by rendertoHTML. If you wante to use asynchronous components use renderToHtmlAsync instead.`
      );
    }

    return jsxElemToTagFuncArgsSync(subElem, attributeMap);
  } else {
    const { attributes, children } = resolveElement(element);

    if (element.tag === "") {
      const results: TagFunctionArgs = [[], []];

      for (const child of children) {
        const [[first, ...strings], tagParams] = jsxElemToTagFuncArgsSync(
          child,
          attributeMap
        );

        concatToLastStringOrPush(results, first);

        results[0].push(...strings);
        results[1].push(...tagParams);
      }

      return results;
    } else {
      const results: TagFunctionArgs = [[], []];

      const part1 = `<${element.tag}`;
      const part2 = ">";
      const part3 = `</${element.tag}>`;

      results[0].push(part1);

      const attrList = Object.entries(attributes);
      for (const index in attrList) {
        const [attrName, value] = attrList[index]!;

        concatToLastStringOrPush(
          results,
          ` ${mapAttributeName(attrName, attributeMap)}="`
        );

        results[1].push(value);

        results[0].push('"');
      }

      concatToLastStringOrPush(results, part2);

      for (const child of children) {
        const [[first, ...strings], tagParams] = jsxElemToTagFuncArgsSync(
          child,
          attributeMap
        );

        concatToLastStringOrPush(results, first);

        results[0].push(...strings);
        results[1].push(...tagParams);
      }

      concatToLastStringOrPush(results, part3);

      return results;
    }
  }
};
