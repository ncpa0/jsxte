/**
 * Only fo use with the `renderToStringTemplateTag` render function.
 *
 * Whatever is passed to this component as children will be
 * interpolated into the template string.
 *
 * Example
 *
 * ```tsx
 *   function someFunction() {}
 *
 *   renderToStringTemplateTag(
 *      html,
 *      <div>
 *          <Interpolate>
 *              {someFunction}
 *          </Interpolate>
 *      </div>
 *   );
 *
 *   // The above is equivalent to:
 *
 *   html`
 *          <div>
 *              ${someFunction}
 *          </div>
 * `;
 * ```
 */
export class Interpolate {
  /**
   * @internal
   */
  static _isInterpolate(o: any): o is typeof Interpolate {
    const canBeClass = typeof o === "function";
    const isNotNull = o !== null;

    if (!canBeClass || !isNotNull) return false;

    const baseName = (o as any as typeof Interpolate)._baseName;
    return baseName === this._baseName;
  }

  private static _baseName = "Interpolate";

  constructor(props: { children?: any }) {}
}

/**
 * Only fo use with the `renderToStringTemplateTag` render function.
 *
 * Whatever is passed to this component as children will be rendered
 * using the tag function and interpolated into the template string.
 *
 * Example
 *
 * ```tsx
 *   renderToStringTemplateTag(
 *      html,
 *      <div>
 *          <InterpolateTag>
 *              <span>Hello World</span>
 *          </InterpolateTag>
 *      </div>
 *   );
 *
 *   // The above is equivalent to:
 *
 *   html`
 *          <div>
 *              ${html`<span>Hello World</span>`}
 *          </div>
 * `;
 * ```
 */
export class InterpolateTag {
  /**
   * @internal
   */
  static _isInterpolateRender(o: any): o is typeof InterpolateTag {
    const canBeClass = typeof o === "function";
    const isNotNull = o !== null;

    if (!canBeClass || !isNotNull) return false;

    const baseName = (o as any as typeof InterpolateTag)._baseName;
    return baseName === this._baseName;
  }

  private static _baseName = "InterpolateTag";

  constructor(props: { children?: any }) {}
}
