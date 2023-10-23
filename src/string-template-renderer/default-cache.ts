import type { TemplateLiteralCache } from "./render-to-string-template-tag";

const arrIsEqual = (
  a: TemplateStringsArray,
  b: TemplateStringsArray,
) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};

export class DefaultTemplateArrayCache
  implements TemplateLiteralCache
{
  private entries: Array<TemplateStringsArray> = [];

  set(templateArray: TemplateStringsArray) {
    this.entries.push(templateArray);
  }

  get(
    templateArray: TemplateStringsArray,
  ): TemplateStringsArray | undefined {
    for (let i = 0; i < this.entries.length; i++) {
      if (arrIsEqual(this.entries[i]!, templateArray)) {
        return this.entries[i];
      }
    }

    return undefined;
  }

  clear() {
    this.entries = [];
  }
}
