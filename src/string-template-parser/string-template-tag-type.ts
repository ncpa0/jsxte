export type StringTemplateTag<R> = (
  template: TemplateStringsArray,
  ...arg: any[]
) => R;
