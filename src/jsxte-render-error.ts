const mapReverse = <T, U>(arr: T[], fn: (item: T) => U): U[] => {
  const result: U[] = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(fn(arr[i]!));
  }
  return result;
};

export class JsxteRenderError extends Error {
  static is(err: any): err is JsxteRenderError {
    return err instanceof JsxteRenderError;
  }

  private baseMessage: string = "";
  private parentTags: string[] = [];
  public declare cause: any;

  constructor(message: string, insideTag?: string, causedBy?: any) {
    // @ts-expect-error
    super(message, { cause: causedBy });
    this.name = "JsxteRenderError";
    this.baseMessage = message;

    if (insideTag) {
      this.parentTags.push(insideTag);
    }

    if (this.cause == null) {
      Object.defineProperty(this, "cause", {
        value: causedBy,
        enumerable: true,
        writable: true,
      });
    }

    this.message = this.generateMessage();
  }

  pushParent(tag: string) {
    this.parentTags.push(tag);
    this.message = this.generateMessage();
  }

  generateMessage() {
    return `The below error has occurred in:\n${mapReverse(
      this.parentTags,
      (tag) => `<${tag}>`,
    ).join("\n")}\n\n${this.baseMessage}`;
  }
}
