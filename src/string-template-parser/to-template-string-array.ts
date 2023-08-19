export const toTemplateStringArray = (
  orgArr: string[],
): TemplateStringsArray => {
  const templateStringArray =
    orgArr.slice() as any as TemplateStringsArray;

  Object.defineProperty(templateStringArray, "raw", {
    value: orgArr,
    configurable: false,
    enumerable: false,
    writable: false,
  });
  Object.freeze(templateStringArray);

  return templateStringArray;
};
