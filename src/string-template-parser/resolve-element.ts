type GetArrayFromUnion<U> = Exclude<U, Exclude<U, Array<any>>>;
type GetNonArraysFromUnion<U> = Exclude<U, Array<any>>;

type ArrayType<A> = A extends Array<infer T> ? T : never;

type AsArray<T> = [GetArrayFromUnion<T>] extends [never]
  ? GetNonArraysFromUnion<T>[]
  : Array<ArrayType<GetArrayFromUnion<T>> | GetNonArraysFromUnion<T>>;

function asArray<T>(v: T): AsArray<T> {
  if (Array.isArray(v)) {
    return v;
  } else {
    return [v] as AsArray<T>;
  }
}

export const resolveElement = (element: JSXTE.TagElement) => {
  const { children, ...attributes } = element.props;

  return {
    attributes,
    children: asArray(children ?? []).flat() as JSX.Element[],
  };
};
