import type { BaseHTMLProps } from "../parser/base-html-parser/base-html-jsx-props";
import type { AnchorProps } from "../parser/html-tag-parsers/a/a-jsx-props";
import type { ButtonProps } from "../parser/html-tag-parsers/button/button-jsx-props";
import type { ColProps } from "../parser/html-tag-parsers/col/col-jsx-props";
import type { ColgroupProps } from "../parser/html-tag-parsers/colgroup/colgroup-jsx-props";
import type { ImgProps } from "../parser/html-tag-parsers/img/img-jsx-props";
import type { InputProps } from "../parser/html-tag-parsers/input/input-jsx-props";
import type { LabelProps } from "../parser/html-tag-parsers/label/label-jsx-props";
import type { LiProps } from "../parser/html-tag-parsers/li/li-jsx.props";
import type { LinkProps } from "../parser/html-tag-parsers/link/link-jsx-props";
import type { MetaProps } from "../parser/html-tag-parsers/meta/meta-jsx-props";
import type { OptionProps } from "../parser/html-tag-parsers/option/option-jsx-props";
import type { ScriptProps } from "../parser/html-tag-parsers/script/script-jsx-props";
import type { SelectProps } from "../parser/html-tag-parsers/select/select-jsx-props";
import type { TdProps } from "../parser/html-tag-parsers/td/td-jsx-props";
import type { ThProps } from "../parser/html-tag-parsers/th/th-jsx-props";

export type JSXTagElem = {
  type: "tag";
  tag:
    | string
    | ((props: JSX.ElementProps) => Element)
    | ((props: JSX.ElementProps) => Promise<Element>);
  props: JSX.ElementProps;
};

export type JSXTextNodeElem = {
  type: "textNode";
  text: string;
};

export type JSXSyncElem = JSXTagElem | JSXTextNodeElem;

declare global {
  namespace JSX {
    type PropsWithChildren<P extends object> = P & {
      children?: JSX.ElementChildren;
    };

    type Component<P extends object = {}> = (
      props: PropsWithChildren<P>
    ) => JSX.Element;

    type AsynComponent<P extends object = {}> = (
      props: PropsWithChildren<P>
    ) => Promise<JSX.Element>;

    type ElementChildren =
      | JSX.Element
      | string
      | number
      | Array<
          JSX.Element | string | number | Array<JSX.Element | string | number>
        >;

    type ElementProps = {
      children?: ElementChildren;
      [k: string]: any;
    };

    type Element =
      | JSXTagElem
      | JSXTextNodeElem
      | Promise<JSXTagElem | JSXTextNodeElem>;

    type LibraryManagedAttributes<T, PropsWithChildren> = PropsWithChildren;

    interface IntrinsicElements {
      a: BaseHTMLProps<AnchorProps>;
      abbr: BaseHTMLProps;
      address: BaseHTMLProps;
      area: BaseHTMLProps;
      article: BaseHTMLProps;
      aside: BaseHTMLProps;
      audio: BaseHTMLProps;
      b: BaseHTMLProps;
      base: BaseHTMLProps;
      bdi: BaseHTMLProps;
      bdo: BaseHTMLProps;
      big: BaseHTMLProps;
      blockquote: BaseHTMLProps;
      body: BaseHTMLProps;
      br: BaseHTMLProps;
      button: BaseHTMLProps<ButtonProps>;
      canvas: BaseHTMLProps;
      caption: BaseHTMLProps;
      cite: BaseHTMLProps;
      code: BaseHTMLProps;
      col: BaseHTMLProps<ColProps>;
      colgroup: BaseHTMLProps<ColgroupProps>;
      data: BaseHTMLProps;
      datalist: BaseHTMLProps;
      dd: BaseHTMLProps;
      del: BaseHTMLProps;
      details: BaseHTMLProps;
      dfn: BaseHTMLProps;
      dialog: BaseHTMLProps;
      div: BaseHTMLProps;
      dl: BaseHTMLProps;
      dt: BaseHTMLProps;
      em: BaseHTMLProps;
      embed: BaseHTMLProps;
      fieldset: BaseHTMLProps;
      figcaption: BaseHTMLProps;
      figure: BaseHTMLProps;
      footer: BaseHTMLProps;
      form: BaseHTMLProps;
      h1: BaseHTMLProps;
      h2: BaseHTMLProps;
      h3: BaseHTMLProps;
      h4: BaseHTMLProps;
      h5: BaseHTMLProps;
      h6: BaseHTMLProps;
      head: BaseHTMLProps;
      header: BaseHTMLProps;
      hgroup: BaseHTMLProps;
      hr: BaseHTMLProps;
      html: BaseHTMLProps;
      i: BaseHTMLProps;
      iframe: BaseHTMLProps;
      img: BaseHTMLProps<ImgProps>;
      input: BaseHTMLProps<InputProps>;
      ins: BaseHTMLProps;
      kbd: BaseHTMLProps;
      keygen: BaseHTMLProps;
      label: BaseHTMLProps<LabelProps>;
      legend: BaseHTMLProps;
      li: BaseHTMLProps<LiProps>;
      link: BaseHTMLProps<LinkProps>;
      main: BaseHTMLProps;
      map: BaseHTMLProps;
      mark: BaseHTMLProps;
      menu: BaseHTMLProps;
      menuitem: BaseHTMLProps;
      meta: BaseHTMLProps<MetaProps>;
      meter: BaseHTMLProps;
      nav: BaseHTMLProps;
      noindex: BaseHTMLProps;
      noscript: BaseHTMLProps;
      object: BaseHTMLProps;
      ol: BaseHTMLProps;
      optgroup: BaseHTMLProps;
      option: BaseHTMLProps<OptionProps>;
      output: BaseHTMLProps;
      p: BaseHTMLProps;
      param: BaseHTMLProps;
      picture: BaseHTMLProps;
      pre: BaseHTMLProps;
      progress: BaseHTMLProps;
      q: BaseHTMLProps;
      rp: BaseHTMLProps;
      rt: BaseHTMLProps;
      ruby: BaseHTMLProps;
      s: BaseHTMLProps;
      samp: BaseHTMLProps;
      slot: BaseHTMLProps;
      script: BaseHTMLProps<ScriptProps>;
      section: BaseHTMLProps;
      select: BaseHTMLProps<SelectProps>;
      small: BaseHTMLProps;
      source: BaseHTMLProps;
      span: BaseHTMLProps;
      strong: BaseHTMLProps;
      style: BaseHTMLProps;
      sub: BaseHTMLProps;
      summary: BaseHTMLProps;
      sup: BaseHTMLProps;
      table: BaseHTMLProps;
      template: BaseHTMLProps;
      tbody: BaseHTMLProps;
      td: BaseHTMLProps<TdProps>;
      textarea: BaseHTMLProps;
      tfoot: BaseHTMLProps;
      th: BaseHTMLProps<ThProps>;
      thead: BaseHTMLProps;
      time: BaseHTMLProps;
      title: BaseHTMLProps;
      tr: BaseHTMLProps;
      track: BaseHTMLProps;
      u: BaseHTMLProps;
      ul: BaseHTMLProps;
      var: BaseHTMLProps;
      video: BaseHTMLProps;
      wbr: BaseHTMLProps;
      webview: BaseHTMLProps;

      // SVG
      svg: BaseHTMLProps;

      // web components
    }
  }
}
