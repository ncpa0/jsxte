import type { JSXSyncElem } from "../jsx/jsx.types";
import { HTMLElement } from "./base-html-parser/base-html-parser";
import { AHTMLParser } from "./html-tag-parsers/a/a-html-parser";
import { AbbrHTMLParser } from "./html-tag-parsers/abbr/abbr-html-parser";
import { AddressHTMLParser } from "./html-tag-parsers/address/address-html-parser";
import { AreaHTMLParser } from "./html-tag-parsers/area/area-html-parser";
import { ArticleHTMLParser } from "./html-tag-parsers/article/article-html-parser";
import { AsideHTMLParser } from "./html-tag-parsers/aside/aside-html-parser";
import { AudioHTMLParser } from "./html-tag-parsers/audio/audio-html-parser";
import { BHTMLParser } from "./html-tag-parsers/b/b-html-parser";
import { BaseTagHTMLParser } from "./html-tag-parsers/base/base-html-parser";
import { BdiHTMLParser } from "./html-tag-parsers/bdi/bdi-html-parser";
import { BdoHTMLParser } from "./html-tag-parsers/bdo/bdo-html-parser";
import { BigHTMLParser } from "./html-tag-parsers/big/big-html-parser";
import { BlockquoteHTMLParser } from "./html-tag-parsers/blockquote/blockquote-html-parser";
import { BodyHTMLParser } from "./html-tag-parsers/body/body-html-parser";
import { BrHTMLParser } from "./html-tag-parsers/br/br-html-parser";
import { ButtonHTMLParser } from "./html-tag-parsers/button/button-html-parser";
import { CanvasHTMLParser } from "./html-tag-parsers/canvas/canvas-html-parser";
import { CaptionHTMLParser } from "./html-tag-parsers/caption/caption-html-parser";
import { CiteHTMLParser } from "./html-tag-parsers/cite/cite-html-parser";
import { CodeHTMLParser } from "./html-tag-parsers/code/code-html-parser";
import { ColHTMLParser } from "./html-tag-parsers/col/col-html-parser";
import { ColgroupHTMLParser } from "./html-tag-parsers/colgroup/colgroup-html-parser";
import { DataHTMLParser } from "./html-tag-parsers/data/data-html-parser";
import { DatalistHTMLParser } from "./html-tag-parsers/datalist/datalist-html-parser";
import { DdHTMLParser } from "./html-tag-parsers/dd/dd-html-parser";
import { DelHTMLParser } from "./html-tag-parsers/del/del-html-parser";
import { DetailsHTMLParser } from "./html-tag-parsers/details/details-html-parser";
import { DfnHTMLParser } from "./html-tag-parsers/dfn/dfn-html-parser";
import { DialogHTMLParser } from "./html-tag-parsers/dialog/dialog-html-parser";
import { DivHTMLParser } from "./html-tag-parsers/div/div-html-parser";
import { DlHTMLParser } from "./html-tag-parsers/dl/dl-html-parser";
import { DtHTMLParser } from "./html-tag-parsers/dt/dt-html-parser";
import { EmHTMLParser } from "./html-tag-parsers/em/em-html-parser";
import { EmbedHTMLParser } from "./html-tag-parsers/embed/embed-html-parser";
import { FieldsetHTMLParser } from "./html-tag-parsers/fieldset/fieldset-html-parser";
import { FigcaptionHTMLParser } from "./html-tag-parsers/figcaption/figcaption-html-parser";
import { FigureHTMLParser } from "./html-tag-parsers/figure/figure-html-parser";
import { FooterHTMLParser } from "./html-tag-parsers/footer/footer-html-parser";
import { FormHTMLParser } from "./html-tag-parsers/form/form-html-parser";
import { H1HTMLParser } from "./html-tag-parsers/h1/h1-html-parser";
import { H2HTMLParser } from "./html-tag-parsers/h2/h2-html-parser";
import { H3HTMLParser } from "./html-tag-parsers/h3/h3-html-parser";
import { H4HTMLParser } from "./html-tag-parsers/h4/h4-html-parser";
import { H5HTMLParser } from "./html-tag-parsers/h5/h5-html-parser";
import { H6HTMLParser } from "./html-tag-parsers/h6/h6-html-parser";
import { HeadHTMLParser } from "./html-tag-parsers/head/head-html-parser";
import { HeaderHTMLParser } from "./html-tag-parsers/header/header-html-parser";
import { HgroupHTMLParser } from "./html-tag-parsers/hgroup/hgroup-html-parser";
import { HrHTMLParser } from "./html-tag-parsers/hr/hr-html-parser";
import { HtmlHTMLParser } from "./html-tag-parsers/html/html-html-parser";
import { IHTMLParser } from "./html-tag-parsers/i/i-html-parser";
import { IframeHTMLParser } from "./html-tag-parsers/iframe/iframe-html-parser";
import { ImgHTMLParser } from "./html-tag-parsers/img/img-html-parser";
import { InputHTMLParser } from "./html-tag-parsers/input/input-html-parser";
import { InsHTMLParser } from "./html-tag-parsers/ins/ins-html-parser";
import { KbdHTMLParser } from "./html-tag-parsers/kbd/kbd-html-parser";
import { KeygenHTMLParser } from "./html-tag-parsers/keygen/keygen-html-parser";
import { LabelHTMLParser } from "./html-tag-parsers/label/label-html-parser";
import { LegendHTMLParser } from "./html-tag-parsers/legend/legend-html-parser";
import { LiHTMLParser } from "./html-tag-parsers/li/li-html-parser";
import { LinkHTMLParser } from "./html-tag-parsers/link/link-html-parser";
import { MainHTMLParser } from "./html-tag-parsers/main/main-html-parser";
import { MapHTMLParser } from "./html-tag-parsers/map/map-html-parser";
import { MarkHTMLParser } from "./html-tag-parsers/mark/mark-html-parser";
import { MenuHTMLParser } from "./html-tag-parsers/menu/menu-html-parser";
import { MenuitemHTMLParser } from "./html-tag-parsers/menuitem/menuitem-html-parser";
import { MetaHTMLParser } from "./html-tag-parsers/meta/meta-html-parser";
import { MeterHTMLParser } from "./html-tag-parsers/meter/meter-html-parser";
import { NavHTMLParser } from "./html-tag-parsers/nav/nav-html-parser";
import { NoindexHTMLParser } from "./html-tag-parsers/noindex/noindex-html-parser";
import { NoscriptHTMLParser } from "./html-tag-parsers/noscript/noscript-html-parser";
import { ObjectHTMLParser } from "./html-tag-parsers/object/object-html-parser";
import { OlHTMLParser } from "./html-tag-parsers/ol/ol-html-parser";
import { OptgroupHTMLParser } from "./html-tag-parsers/optgroup/optgroup-html-parser";
import { OptionHTMLParser } from "./html-tag-parsers/option/option-html-parser";
import { OutputHTMLParser } from "./html-tag-parsers/output/output-html-parser";
import { PHTMLParser } from "./html-tag-parsers/p/p-html-parser";
import { ParamHTMLParser } from "./html-tag-parsers/param/param-html-parser";
import { PictureHTMLParser } from "./html-tag-parsers/picture/picture-html-parser";
import { PreHTMLParser } from "./html-tag-parsers/pre/pre-html-parser";
import { ProgressHTMLParser } from "./html-tag-parsers/progress/progress-html-parser";
import { QHTMLParser } from "./html-tag-parsers/q/q-html-parser";
import { RpHTMLParser } from "./html-tag-parsers/rp/rp-html-parser";
import { RtHTMLParser } from "./html-tag-parsers/rt/rt-html-parser";
import { RubyHTMLParser } from "./html-tag-parsers/ruby/ruby-html-parser";
import { SHTMLParser } from "./html-tag-parsers/s/s-html-parser";
import { SampHTMLParser } from "./html-tag-parsers/samp/samp-html-parser";
import { ScriptHTMLParser } from "./html-tag-parsers/script/script-html-parser";
import { SectionHTMLParser } from "./html-tag-parsers/section/section-html-parser";
import { SelectHTMLParser } from "./html-tag-parsers/select/select-html-parser";
import { SlotHTMLParser } from "./html-tag-parsers/slot/slot-html-parser";
import { SmallHTMLParser } from "./html-tag-parsers/small/small-html-parser";
import { SourceHTMLParser } from "./html-tag-parsers/source/source-html-parser";
import { SpanHTMLParser } from "./html-tag-parsers/span/span-html-parser";
import { StrongHTMLParser } from "./html-tag-parsers/strong/strong-html-parser";
import { StyleHTMLParser } from "./html-tag-parsers/style/style-html-parser";
import { SubHTMLParser } from "./html-tag-parsers/sub/sub-html-parser";
import { SummaryHTMLParser } from "./html-tag-parsers/summary/summary-html-parser";
import { SupHTMLParser } from "./html-tag-parsers/sup/sup-html-parser";
import { SvgHTMLParser } from "./html-tag-parsers/svg/svg-html-parser";
import { TableHTMLParser } from "./html-tag-parsers/table/table-html-parser";
import { TbodyHTMLParser } from "./html-tag-parsers/tbody/tbody-html-parser";
import { TdHTMLParser } from "./html-tag-parsers/td/td-html-parser";
import { TemplateHTMLParser } from "./html-tag-parsers/template/template-html-parser";
import { TextareaHTMLParser } from "./html-tag-parsers/textarea/textarea-html-parser";
import { TfootHTMLParser } from "./html-tag-parsers/tfoot/tfoot-html-parser";
import { ThHTMLParser } from "./html-tag-parsers/th/th-html-parser";
import { TheadHTMLParser } from "./html-tag-parsers/thead/thead-html-parser";
import { TimeHTMLParser } from "./html-tag-parsers/time/time-html-parser";
import { TitleHTMLParser } from "./html-tag-parsers/title/title-html-parser";
import { TrHTMLParser } from "./html-tag-parsers/tr/tr-html-parser";
import { TrackHTMLParser } from "./html-tag-parsers/track/track-html-parser";
import { UHTMLParser } from "./html-tag-parsers/u/u-html-parser";
import { UlHTMLParser } from "./html-tag-parsers/ul/ul-html-parser";
import { VarHTMLParser } from "./html-tag-parsers/var/var-html-parser";
import { VideoHTMLParser } from "./html-tag-parsers/video/video-html-parser";
import { WbrHTMLParser } from "./html-tag-parsers/wbr/wbr-html-parser";
import { WebviewHTMLParser } from "./html-tag-parsers/webview/webview-html-parser";
import type { HTMLElementStruct } from "./types";

export type HTMLStructFactory = {
  tag: string;
  toStruct(template: JSX.Element): HTMLElementStruct;
};

export const HTMLParsers: HTMLStructFactory[] = [
  AHTMLParser,
  AbbrHTMLParser,
  AddressHTMLParser,
  AreaHTMLParser,
  ArticleHTMLParser,
  AsideHTMLParser,
  AudioHTMLParser,
  BHTMLParser,
  BaseTagHTMLParser,
  BdiHTMLParser,
  BdoHTMLParser,
  BigHTMLParser,
  BlockquoteHTMLParser,
  BodyHTMLParser,
  BrHTMLParser,
  ButtonHTMLParser,
  CanvasHTMLParser,
  CaptionHTMLParser,
  CiteHTMLParser,
  CodeHTMLParser,
  ColHTMLParser,
  ColgroupHTMLParser,
  DataHTMLParser,
  DatalistHTMLParser,
  DdHTMLParser,
  DelHTMLParser,
  DetailsHTMLParser,
  DfnHTMLParser,
  DialogHTMLParser,
  DivHTMLParser,
  DlHTMLParser,
  DtHTMLParser,
  EmHTMLParser,
  EmbedHTMLParser,
  FieldsetHTMLParser,
  FigcaptionHTMLParser,
  FigureHTMLParser,
  FooterHTMLParser,
  FormHTMLParser,
  H1HTMLParser,
  H2HTMLParser,
  H3HTMLParser,
  H4HTMLParser,
  H5HTMLParser,
  H6HTMLParser,
  HeadHTMLParser,
  HeaderHTMLParser,
  HgroupHTMLParser,
  HrHTMLParser,
  HtmlHTMLParser,
  IHTMLParser,
  IframeHTMLParser,
  ImgHTMLParser,
  InputHTMLParser,
  InsHTMLParser,
  KbdHTMLParser,
  KeygenHTMLParser,
  LabelHTMLParser,
  LegendHTMLParser,
  LiHTMLParser,
  LinkHTMLParser,
  MainHTMLParser,
  MapHTMLParser,
  MarkHTMLParser,
  MenuHTMLParser,
  MenuitemHTMLParser,
  MetaHTMLParser,
  MeterHTMLParser,
  NavHTMLParser,
  NoindexHTMLParser,
  NoscriptHTMLParser,
  ObjectHTMLParser,
  OlHTMLParser,
  OptgroupHTMLParser,
  OptionHTMLParser,
  OutputHTMLParser,
  PHTMLParser,
  ParamHTMLParser,
  PictureHTMLParser,
  PreHTMLParser,
  ProgressHTMLParser,
  QHTMLParser,
  RpHTMLParser,
  RtHTMLParser,
  RubyHTMLParser,
  SHTMLParser,
  SampHTMLParser,
  SlotHTMLParser,
  ScriptHTMLParser,
  SectionHTMLParser,
  SelectHTMLParser,
  SmallHTMLParser,
  SourceHTMLParser,
  SpanHTMLParser,
  StrongHTMLParser,
  StyleHTMLParser,
  SubHTMLParser,
  SummaryHTMLParser,
  SupHTMLParser,
  TableHTMLParser,
  TemplateHTMLParser,
  TbodyHTMLParser,
  TdHTMLParser,
  TextareaHTMLParser,
  TfootHTMLParser,
  ThHTMLParser,
  TheadHTMLParser,
  TimeHTMLParser,
  TitleHTMLParser,
  TrHTMLParser,
  TrackHTMLParser,
  UHTMLParser,
  UlHTMLParser,
  VarHTMLParser,
  VideoHTMLParser,
  WbrHTMLParser,
  WebviewHTMLParser,
  SvgHTMLParser,
];

export const getHTMLStruct = (element: JSXSyncElem): HTMLElementStruct => {
  if (
    element.type === "tag" &&
    typeof element.tag === "string" &&
    element.tag.includes("-")
  ) {
    return HTMLElement.resolveWebComponentElement(element);
  }

  const parser = HTMLParsers.find(
    (p) => element.type === "tag" && element.tag === p.tag
  );

  if (parser) {
    return parser.toStruct(element);
  }

  return HTMLElement.resolveElement(element);
};
