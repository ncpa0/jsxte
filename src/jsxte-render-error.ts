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
  }

  /**
   * @internal
   */
  pushParent(tag: string) {
    this.parentTags.push(tag);
  }

  /**
   * @internal
   */
  regenerateMessage() {
    this.message = `The below error has occurred in:\n${mapReverse(
      this.parentTags.filter((t) => t !== ""),
      (tag) => `<${tag}>`,
    ).join("\n")}\n\n${this.baseMessage}`;
  }
}
