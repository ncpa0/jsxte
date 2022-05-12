import type { BaseHTMLProps } from "../parser/base-html-parser/base-html-jsx-props";
import type { AnchorProps } from "../parser/html-tag-parsers/a/a-jsx-props";
import type { ButtonProps } from "../parser/html-tag-parsers/button/button-jsx-props";
import type { InputProps } from "../parser/html-tag-parsers/input/input-jsx-props";

export type ElemOrList<T> = T | T[];

export type ElementStructChildren = ElemOrList<ElementStruct | string>;

export type ElementStructProps = {
  key?: any;
  children?: ElementStructChildren;
  [k: string]: any;
};

export type ElementStruct = {
  tag: string | ((props: ElementStructProps) => ElementStruct);
  props: ElementStructProps;
};

declare global {
  namespace JSX {
    type Element = ElementStruct;
    type IntrinsicElements = {
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
      col: BaseHTMLProps;
      colgroup: BaseHTMLProps;
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
      img: BaseHTMLProps;
      input: BaseHTMLProps<InputProps>;
      ins: BaseHTMLProps;
      kbd: BaseHTMLProps;
      keygen: BaseHTMLProps;
      label: BaseHTMLProps;
      legend: BaseHTMLProps;
      li: BaseHTMLProps;
      link: BaseHTMLProps;
      main: BaseHTMLProps;
      map: BaseHTMLProps;
      mark: BaseHTMLProps;
      menu: BaseHTMLProps;
      menuitem: BaseHTMLProps;
      meta: BaseHTMLProps;
      meter: BaseHTMLProps;
      nav: BaseHTMLProps;
      noindex: BaseHTMLProps;
      noscript: BaseHTMLProps;
      object: BaseHTMLProps;
      ol: BaseHTMLProps;
      optgroup: BaseHTMLProps;
      option: BaseHTMLProps;
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
      script: BaseHTMLProps;
      section: BaseHTMLProps;
      select: BaseHTMLProps;
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
      td: BaseHTMLProps;
      textarea: BaseHTMLProps;
      tfoot: BaseHTMLProps;
      th: BaseHTMLProps;
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
    };
  }
}
