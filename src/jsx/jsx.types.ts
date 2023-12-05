/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./prop-types/a-jsx-props.ts" />
/// <reference path="./prop-types/area-jsx-props.ts" />
/// <reference path="./prop-types/audio-jsx-props.ts" />
/// <reference path="./prop-types/base-jsx-props.ts" />
/// <reference path="./prop-types/bdo-jsx-props.ts" />
/// <reference path="./prop-types/blockquote-jsx-props.ts" />
/// <reference path="./prop-types/button-jsx-props.ts" />
/// <reference path="./prop-types/canvas-jsx-props.ts" />
/// <reference path="./prop-types/col-jsx-props.ts" />
/// <reference path="./prop-types/colgroup-jsx-props.ts" />
/// <reference path="./prop-types/data-jsx-props.ts" />
/// <reference path="./prop-types/del-jsx-props.ts" />
/// <reference path="./prop-types/details-jsx-props.ts" />
/// <reference path="./prop-types/dialog-jsx-props.ts" />
/// <reference path="./prop-types/embed-jsx-props.ts" />
/// <reference path="./prop-types/form-jsx-props.ts" />
/// <reference path="./prop-types/html-jsx-props.ts" />
/// <reference path="./prop-types/iframe-jsx-props.ts" />
/// <reference path="./prop-types/img-jsx-props.ts" />
/// <reference path="./prop-types/input-jsx-props.ts" />
/// <reference path="./prop-types/ins-jsx-props.ts" />
/// <reference path="./prop-types/label-jsx-props.ts" />
/// <reference path="./prop-types/li-jsx.props.ts" />
/// <reference path="./prop-types/link-jsx-props.ts" />
/// <reference path="./prop-types/map-jsx-props.ts" />
/// <reference path="./prop-types/meta-jsx-props.ts" />
/// <reference path="./prop-types/meter-jsx-props.ts" />
/// <reference path="./prop-types/object-jsx-props.ts" />
/// <reference path="./prop-types/ol-jsx-props.ts" />
/// <reference path="./prop-types/optgroup-jsx-props.ts" />
/// <reference path="./prop-types/option-jsx-props.ts" />
/// <reference path="./prop-types/output-jsx-props.ts" />
/// <reference path="./prop-types/param-jsx-props.ts" />
/// <reference path="./prop-types/progress-jsx-props.ts" />
/// <reference path="./prop-types/q-jsx-props.ts" />
/// <reference path="./prop-types/script-jsx-props.ts" />
/// <reference path="./prop-types/select-jsx-props.ts" />
/// <reference path="./prop-types/source-jsx-props.ts" />
/// <reference path="./prop-types/style-jsx-props.ts" />
/// <reference path="./prop-types/td-jsx-props.ts" />
/// <reference path="./prop-types/textarea-jsx-props.ts" />
/// <reference path="./prop-types/th-jsx-props.ts" />
/// <reference path="./prop-types/time-jsx-props.ts" />
/// <reference path="./prop-types/track-jsx-props.ts" />
/// <reference path="./prop-types/video-jsx-props.ts" />

import type { HTMLProps } from "./base-html-tag-props";

declare global {
  namespace JSX {
    type AsyncElement = Promise<
      | JSXTE.TagElement
      | JSXTE.TextNodeElement
      | null
      | undefined
      | boolean
      | string
      | number
    >;
    type SyncElement =
      | JSXTE.TagElement
      | JSXTE.TextNodeElement
      | null
      | undefined
      | boolean
      | string
      | number;

    type Element = SyncElement | AsyncElement;

    interface IntrinsicElements {
      a: HTMLProps<JSXTE.AnchorTagProps>;
      abbr: HTMLProps<JSXTE.AbbrTagProps>;
      address: HTMLProps<JSXTE.AddressTagProps>;
      area: HTMLProps<JSXTE.AreaTagProps>;
      article: HTMLProps<JSXTE.ArticleTagProps>;
      aside: HTMLProps<JSXTE.AsideTagProps>;
      audio: HTMLProps<JSXTE.AudioTagProps>;
      b: HTMLProps<JSXTE.BTagProps>;
      base: HTMLProps<JSXTE.BaseTagProps>;
      bdi: HTMLProps<JSXTE.BdiTagProps>;
      bdo: HTMLProps<JSXTE.BdoTagProps>;
      big: HTMLProps<JSXTE.BigTagProps>;
      blockquote: HTMLProps<JSXTE.BlockquoteTagProps>;
      body: HTMLProps<JSXTE.BodyTagProps>;
      br: HTMLProps<JSXTE.BrTagProps>;
      button: HTMLProps<JSXTE.ButtonTagProps>;
      canvas: HTMLProps<JSXTE.CanvasTagProps>;
      caption: HTMLProps<JSXTE.CaptionTagProps>;
      cite: HTMLProps<JSXTE.CiteTagProps>;
      code: HTMLProps<JSXTE.CodeTagProps>;
      col: HTMLProps<JSXTE.ColTagProps>;
      colgroup: HTMLProps<JSXTE.ColgroupTagProps>;
      data: HTMLProps<JSXTE.DataTagProps>;
      datalist: HTMLProps<JSXTE.DatalistTagProps>;
      dd: HTMLProps<JSXTE.DdTagProps>;
      del: HTMLProps<JSXTE.DelTagProps>;
      details: HTMLProps<JSXTE.DetailsTagProps>;
      dfn: HTMLProps<JSXTE.DfnTagProps>;
      dialog: HTMLProps<JSXTE.DialogTagProps>;
      div: HTMLProps<JSXTE.DivTagProps>;
      dl: HTMLProps<JSXTE.DlTagProps>;
      dt: HTMLProps<JSXTE.DtTagProps>;
      em: HTMLProps<JSXTE.EmTagProps>;
      embed: HTMLProps<JSXTE.EmbedTagProps>;
      fieldset: HTMLProps<JSXTE.FieldsetTagProps>;
      figcaption: HTMLProps<JSXTE.FigcaptionTagProps>;
      figure: HTMLProps<JSXTE.FigureTagProps>;
      footer: HTMLProps<JSXTE.FooterTagProps>;
      form: HTMLProps<JSXTE.FormTagProps>;
      h1: HTMLProps<JSXTE.H1TagProps>;
      h2: HTMLProps<JSXTE.H2TagProps>;
      h3: HTMLProps<JSXTE.H3TagProps>;
      h4: HTMLProps<JSXTE.H4TagProps>;
      h5: HTMLProps<JSXTE.H5TagProps>;
      h6: HTMLProps<JSXTE.H6TagProps>;
      head: HTMLProps<JSXTE.HeadTagProps>;
      header: HTMLProps<JSXTE.HeaderTagProps>;
      hgroup: HTMLProps<JSXTE.HgroupTagProps>;
      hr: HTMLProps<JSXTE.HrTagProps>;
      html: HTMLProps<JSXTE.HtmlTagProps>;
      i: HTMLProps<JSXTE.ITagProps>;
      iframe: HTMLProps<JSXTE.IframeTagProps>;
      img: HTMLProps<JSXTE.ImgTagProps>;
      input: HTMLProps<JSXTE.InputTagProps>;
      ins: HTMLProps<JSXTE.InsTagProps>;
      kbd: HTMLProps<JSXTE.KbdTagProps>;
      keygen: HTMLProps<JSXTE.KeygenTagProps>;
      label: HTMLProps<JSXTE.LabelTagProps>;
      legend: HTMLProps<JSXTE.LegendTagProps>;
      li: HTMLProps<JSXTE.LiTagProps>;
      link: HTMLProps<JSXTE.LinkTagProps>;
      main: HTMLProps<JSXTE.MainTagProps>;
      map: HTMLProps<JSXTE.MapTagProps>;
      mark: HTMLProps<JSXTE.MarkTagProps>;
      menu: HTMLProps<JSXTE.MenuTagProps>;
      menuitem: HTMLProps<JSXTE.MenuitemTagProps>;
      meta: HTMLProps<JSXTE.MetaTagProps>;
      meter: HTMLProps<JSXTE.MeterTagProps>;
      nav: HTMLProps<JSXTE.NavTagProps>;
      noindex: HTMLProps<JSXTE.NoindexTagProps>;
      noscript: HTMLProps<JSXTE.NoscriptTagProps>;
      object: HTMLProps<JSXTE.ObjectTagProps>;
      ol: HTMLProps<JSXTE.OlTagProps>;
      optgroup: HTMLProps<JSXTE.OptgroupTagProps>;
      option: HTMLProps<JSXTE.OptionTagProps>;
      output: HTMLProps<JSXTE.OutputTagProps>;
      p: HTMLProps<JSXTE.ParagraphTagProps>;
      param: HTMLProps<JSXTE.ParamTagProps>;
      picture: HTMLProps<JSXTE.PictureTagProps>;
      pre: HTMLProps<JSXTE.PreTagProps>;
      progress: HTMLProps<JSXTE.ProgressTagProps>;
      q: HTMLProps<JSXTE.QTagProps>;
      rp: HTMLProps<JSXTE.RpTagProps>;
      rt: HTMLProps<JSXTE.RtTagProps>;
      ruby: HTMLProps<JSXTE.RubyTagProps>;
      s: HTMLProps<JSXTE.STagProps>;
      samp: HTMLProps<JSXTE.SampTagProps>;
      search: HTMLProps<JSXTE.SearchTagProps>;
      script: HTMLProps<JSXTE.ScriptTagProps>;
      section: HTMLProps<JSXTE.SectionTagProps>;
      select: HTMLProps<JSXTE.SelectTagProps>;
      slot: HTMLProps<JSXTE.SlotTagProps>;
      small: HTMLProps<JSXTE.SmallTagProps>;
      source: HTMLProps<JSXTE.SourceTagProps>;
      span: HTMLProps<JSXTE.SpanTagProps>;
      strong: HTMLProps<JSXTE.StrongTagProps>;
      style: HTMLProps<JSXTE.StyleTagProps>;
      sub: HTMLProps<JSXTE.SubTagProps>;
      summary: HTMLProps<JSXTE.SummaryTagProps>;
      sup: HTMLProps<JSXTE.SupTagProps>;
      table: HTMLProps<JSXTE.TableTagProps>;
      tbody: HTMLProps<JSXTE.TbodyTagProps>;
      td: HTMLProps<JSXTE.TdTagProps>;
      template: HTMLProps<JSXTE.TemplateTagProps>;
      textarea: HTMLProps<JSXTE.TextareaTagProps>;
      tfoot: HTMLProps<JSXTE.TfootTagProps>;
      th: HTMLProps<JSXTE.ThTagProps>;
      thead: HTMLProps<JSXTE.TheadTagProps>;
      time: HTMLProps<JSXTE.TimeTagProps>;
      title: HTMLProps<JSXTE.TitleTagProps>;
      tr: HTMLProps<JSXTE.TrTagProps>;
      track: HTMLProps<JSXTE.TrackTagProps>;
      u: HTMLProps<JSXTE.UTagProps>;
      ul: HTMLProps<JSXTE.UlTagProps>;
      var: HTMLProps<JSXTE.VarTagProps>;
      video: HTMLProps<JSXTE.VideoTagProps>;
      wbr: HTMLProps<JSXTE.WbrTagProps>;
      webview: HTMLProps<JSXTE.WebviewTagProps>;

      // SVG
      svg: HTMLProps<JSXTE.SvgTagProps>;

      // web components
    }
  }

  // Interfaces for HTML tags that do not have any additional attributes defined
  namespace JSXTE {
    interface AbbrTagProps {}
    interface AddressTagProps {}
    interface ArticleTagProps {}
    interface AsideTagProps {}
    interface BdiTagProps {}
    interface BigTagProps {}
    interface BodyTagProps {}
    interface BrTagProps {}
    interface BTagProps {}
    interface CaptionTagProps {}
    interface CiteTagProps {}
    interface CodeTagProps {}
    interface DatalistTagProps {}
    interface DdTagProps {}
    interface DfnTagProps {}
    interface DivTagProps {}
    interface DlTagProps {}
    interface DtTagProps {}
    interface EmTagProps {}
    interface FigcaptionTagProps {}
    interface FigureTagProps {}
    interface FooterTagProps {}
    interface H1TagProps {}
    interface H2TagProps {}
    interface H3TagProps {}
    interface H4TagProps {}
    interface H5TagProps {}
    interface H6TagProps {}
    interface HeaderTagProps {}
    interface HeadTagProps {}
    interface HgroupTagProps {}
    interface HrTagProps {}
    interface ITagProps {}
    interface KbdTagProps {}
    interface KeygenTagProps {}
    interface LegendTagProps {}
    interface MainTagProps {}
    interface MarkTagProps {}
    interface MenuitemTagProps {}
    interface MenuTagProps {}
    interface NavTagProps {}
    interface NoindexTagProps {}
    interface NoscriptTagProps {}
    interface ParagraphTagProps {}
    interface PictureTagProps {}
    interface PreTagProps {}
    interface RpTagProps {}
    interface RtTagProps {}
    interface RubyTagProps {}
    interface SampTagProps {}
    interface SearchTagProps {}
    interface SectionTagProps {}
    interface SlotTagProps {}
    interface SmallTagProps {}
    interface SpanTagProps {}
    interface STagProps {}
    interface StrongTagProps {}
    interface SubTagProps {}
    interface SummaryTagProps {}
    interface SupTagProps {}
    interface SvgTagProps {}
    interface TableTagProps {}
    interface TbodyTagProps {}
    interface TemplateTagProps {}
    interface TfootTagProps {}
    interface TheadTagProps {}
    interface TitleTagProps {}
    interface TrTagProps {}
    interface UlTagProps {}
    interface UTagProps {}
    interface VarTagProps {}
    interface WbrTagProps {}
    interface WebviewTagProps {}
  }
}
