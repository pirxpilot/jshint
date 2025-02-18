// jshint -W001

"use strict";

// Identifiers provided by the ECMAScript standard.

exports.reservedVars = {
  NaN       : false,
  undefined : false
};

exports.ecmaIdentifiers = {
  3: {
    Array              : false,
    Boolean            : false,
    Date               : false,
    decodeURI          : false,
    decodeURIComponent : false,
    encodeURI          : false,
    encodeURIComponent : false,
    Error              : false,
    "eval"             : false,
    EvalError          : false,
    Function           : false,
    hasOwnProperty     : false,
    Infinity           : false,
    isFinite           : false,
    isNaN              : false,
    Math               : false,
    Number             : false,
    Object             : false,
    parseInt           : false,
    parseFloat         : false,
    RangeError         : false,
    ReferenceError     : false,
    RegExp             : false,
    String             : false,
    SyntaxError        : false,
    TypeError          : false,
    URIError           : false
  },
  5: {
    JSON               : false
  },
  6: {
    ArrayBuffer        : false,
    DataView           : false,
    Float32Array       : false,
    Float64Array       : false,
    Int8Array          : false,
    Int16Array         : false,
    Int32Array         : false,
    Map                : false,
    Promise            : false,
    Proxy              : false,
    Reflect            : false,
    Set                : false,
    Symbol             : false,
    Uint8Array         : false,
    Uint16Array        : false,
    Uint32Array        : false,
    Uint8ClampedArray  : false,
    WeakMap            : false,
    WeakSet            : false
  },
  8: {
    Atomics            : false,
    SharedArrayBuffer  : false
  },
  11: {
    BigInt             : false,
    globalThis         : false
  }
};

// Global variables commonly provided by a web browser environment.

exports.browser = {
  Audio                : false,
  Blob                 : false,
  addEventListener     : false, // EventTarget
  applicationCache     : false,
  atob                 : false, // WindowOrWorkerGlobalScope
  blur                 : false,
  btoa                 : false, // WindowOrWorkerGlobalScope
  cancelAnimationFrame : false,
  CanvasGradient       : false,
  CanvasPattern        : false,
  CanvasRenderingContext2D: false,
  CSS                  : false,
  CSSImportRule        : false,
  CSSGroupingRule      : false,
  CSSMarginRule        : false,
  CSSMediaRule         : false,
  CSSNamespaceRule     : false,
  CSSPageRule          : false,
  CSSRule              : false,
  CSSRuleList          : false,
  CSSStyleDeclaration  : false,
  CSSStyleRule         : false,
  CSSStyleSheet        : false,
  clearInterval        : false, // WindowOrWorkerGlobalScope
  clearTimeout         : false, // WindowOrWorkerGlobalScope
  close                : false,
  closed               : false,
  Comment              : false,
  CompositionEvent     : false,
  createImageBitmap    : false, // WindowOrWorkerGlobalScope
  CustomEvent          : false,
  DOMParser            : false,
  defaultStatus        : false,
  dispatchEvent        : false, // EventTarget
  Document             : false,
  document             : false,
  DocumentFragment     : false,
  Element              : false,
  ElementTimeControl   : false,
  Event                : false,
  event                : false,
  fetch                : false,
  File                 : false,
  FileList             : false,
  FileReader           : false,
  FormData             : false,
  focus                : false,
  frames               : false,
  getComputedStyle     : false,
  Headers              : false,
  HTMLAnchorElement    : false,
  HTMLAreaElement      : false,
  HTMLAudioElement     : false,
  HTMLBaseElement      : false,
  HTMLBlockquoteElement: false,
  HTMLBodyElement      : false,
  HTMLBRElement        : false,
  HTMLButtonElement    : false,
  HTMLCanvasElement    : false,
  HTMLCollection       : false,
  HTMLDataElement      : false,
  HTMLDataListElement  : false,
  HTMLDetailsElement   : false,
  HTMLDialogElement    : false,
  HTMLDirectoryElement : false,
  HTMLDivElement       : false,
  HTMLDListElement     : false,
  HTMLElement          : false,
  HTMLEmbedElement     : false,
  HTMLFieldSetElement  : false,
  HTMLFontElement      : false,
  HTMLFormElement      : false,
  HTMLFrameElement     : false,
  HTMLFrameSetElement  : false,
  HTMLHeadElement      : false,
  HTMLHeadingElement   : false,
  HTMLHRElement        : false,
  HTMLHtmlElement      : false,
  HTMLIFrameElement    : false,
  HTMLImageElement     : false,
  HTMLInputElement     : false,
  /* HTMLIsIndexElement was removed from the WHATWG HTML spec;
     see https://github.com/whatwg/html/pull/1095.
     HTMLIsIndexElement has been removed from browsers; see:
     • Chromium Removal: https://codereview.chromium.org/96653004/
     • Gecko Removal: https://bugzilla.mozilla.org/show_bug.cgi?id=1266495
     • WebKit Removal: https://bugs.webkit.org/show_bug.cgi?id=7139.
     See also the discussion at https://github.com/jshint/jshint/pull/3222. */
  HTMLIsIndexElement   : false,
  HTMLLabelElement     : false,
  HTMLLayerElement     : false,
  HTMLLegendElement    : false,
  HTMLLIElement        : false,
  HTMLLinkElement      : false,
  HTMLMapElement       : false,
  HTMLMarqueeElement   : false,
  HTMLMediaElement     : false,
  HTMLMenuElement      : false,
  HTMLMetaElement      : false,
  HTMLMeterElement     : false,
  HTMLModElement       : false,
  HTMLObjectElement    : false,
  HTMLOListElement     : false,
  HTMLOptGroupElement  : false,
  HTMLOptionElement    : false,
  HTMLParagraphElement : false,
  HTMLParamElement     : false,
  HTMLPictureElement   : false,
  HTMLPreElement       : false,
  HTMLProgressElement  : false,
  HTMLQuoteElement     : false,
  HTMLScriptElement    : false,
  HTMLSelectElement    : false,
  HTMLSlotElement      : false,
  HTMLSourceElement    : false,
  HTMLStyleElement     : false,
  HTMLTableCaptionElement: false,
  HTMLTableCellElement : false,
  HTMLTableColElement  : false,
  HTMLTableElement     : false,
  HTMLTableRowElement  : false,
  HTMLTableSectionElement: false,
  HTMLTemplateElement  : false,
  HTMLTextAreaElement  : false,
  HTMLTimeElement      : false,
  HTMLTitleElement     : false,
  HTMLTrackElement     : false,
  HTMLUListElement     : false,
  HTMLVideoElement     : false,
  history              : false,
  Image                : false,
  IntersectionObserver : false,
  Intl                 : false,
  length               : false,
  localStorage         : false,
  location             : false,
  matchMedia           : false,
  MediaList            : false,
  MediaRecorder        : false,
  MessageChannel       : false,
  MessageEvent         : false,
  MessagePort          : false,
  MouseEvent           : false,
  moveBy               : false,
  moveTo               : false,
  MutationObserver     : false,
  name                 : false,
  Node                 : false,
  NodeFilter           : false,
  NodeList             : false,
  Notification         : false,
  navigator            : false,
  onbeforeunload       : true,
  onblur               : true,
  onerror              : true,
  onfocus              : true,
  onload               : true,
  onresize             : true,
  onunload             : true,
  open                 : false,
  openDatabase         : false,
  opener               : false,
  Option               : false,
  origin               : false, // WindowOrWorkerGlobalScope
  parent               : false,
  performance          : false,
  print                : false,
  queueMicrotask       : false, // WindowOrWorkerGlobalScope
  Range                : false,
  requestAnimationFrame : false,
  removeEventListener  : false, // EventTarget
  Request              : false,
  resizeBy             : false,
  resizeTo             : false,
  Response             : false,
  screen               : false,
  scroll               : false,
  scrollBy             : false,
  scrollTo             : false,
  sessionStorage       : false,
  setInterval          : false, // WindowOrWorkerGlobalScope
  setTimeout           : false, // WindowOrWorkerGlobalScope
  SharedWorker         : false,
  status               : false,
  Storage              : false,
  StyleSheet           : false,
  SVGAElement          : false,
  SVGAltGlyphDefElement: false,
  SVGAltGlyphElement   : false,
  SVGAltGlyphItemElement: false,
  SVGAngle             : false,
  SVGAnimateColorElement: false,
  SVGAnimateElement    : false,
  SVGAnimateMotionElement: false,
  SVGAnimateTransformElement: false,
  SVGAnimatedAngle     : false,
  SVGAnimatedBoolean   : false,
  SVGAnimatedEnumeration: false,
  SVGAnimatedInteger   : false,
  SVGAnimatedLength    : false,
  SVGAnimatedLengthList: false,
  SVGAnimatedNumber    : false,
  SVGAnimatedNumberList: false,
  SVGAnimatedPathData  : false,
  SVGAnimatedPoints    : false,
  SVGAnimatedPreserveAspectRatio: false,
  SVGAnimatedRect      : false,
  SVGAnimatedString    : false,
  SVGAnimatedTransformList: false,
  SVGAnimationElement  : false,
  SVGCSSRule           : false,
  SVGCircleElement     : false,
  SVGClipPathElement   : false,
  SVGColor             : false,
  SVGColorProfileElement: false,
  SVGColorProfileRule  : false,
  SVGComponentTransferFunctionElement: false,
  SVGCursorElement     : false,
  SVGDefsElement       : false,
  SVGDescElement       : false,
  SVGDocument          : false,
  SVGElement           : false,
  SVGElementInstance   : false,
  SVGElementInstanceList: false,
  SVGEllipseElement    : false,
  SVGExternalResourcesRequired: false,
  SVGFEBlendElement    : false,
  SVGFEColorMatrixElement: false,
  SVGFEComponentTransferElement: false,
  SVGFECompositeElement: false,
  SVGFEConvolveMatrixElement: false,
  SVGFEDiffuseLightingElement: false,
  SVGFEDisplacementMapElement: false,
  SVGFEDistantLightElement: false,
  SVGFEFloodElement    : false,
  SVGFEFuncAElement    : false,
  SVGFEFuncBElement    : false,
  SVGFEFuncGElement    : false,
  SVGFEFuncRElement    : false,
  SVGFEGaussianBlurElement: false,
  SVGFEImageElement    : false,
  SVGFEMergeElement    : false,
  SVGFEMergeNodeElement: false,
  SVGFEMorphologyElement: false,
  SVGFEOffsetElement   : false,
  SVGFEPointLightElement: false,
  SVGFESpecularLightingElement: false,
  SVGFESpotLightElement: false,
  SVGFETileElement     : false,
  SVGFETurbulenceElement: false,
  SVGFilterElement     : false,
  SVGFilterPrimitiveStandardAttributes: false,
  SVGFitToViewBox      : false,
  SVGFontElement       : false,
  SVGFontFaceElement   : false,
  SVGFontFaceFormatElement: false,
  SVGFontFaceNameElement: false,
  SVGFontFaceSrcElement: false,
  SVGFontFaceUriElement: false,
  SVGForeignObjectElement: false,
  SVGGElement          : false,
  SVGGlyphElement      : false,
  SVGGlyphRefElement   : false,
  SVGGradientElement   : false,
  SVGHKernElement      : false,
  SVGICCColor          : false,
  SVGImageElement      : false,
  SVGLangSpace         : false,
  SVGLength            : false,
  SVGLengthList        : false,
  SVGLineElement       : false,
  SVGLinearGradientElement: false,
  SVGLocatable         : false,
  SVGMPathElement      : false,
  SVGMarkerElement     : false,
  SVGMaskElement       : false,
  SVGMatrix            : false,
  SVGMetadataElement   : false,
  SVGMissingGlyphElement: false,
  SVGNumber            : false,
  SVGNumberList        : false,
  SVGPaint             : false,
  SVGPathElement       : false,
  SVGPathSeg           : false,
  SVGPathSegArcAbs     : false,
  SVGPathSegArcRel     : false,
  SVGPathSegClosePath  : false,
  SVGPathSegCurvetoCubicAbs: false,
  SVGPathSegCurvetoCubicRel: false,
  SVGPathSegCurvetoCubicSmoothAbs: false,
  SVGPathSegCurvetoCubicSmoothRel: false,
  SVGPathSegCurvetoQuadraticAbs: false,
  SVGPathSegCurvetoQuadraticRel: false,
  SVGPathSegCurvetoQuadraticSmoothAbs: false,
  SVGPathSegCurvetoQuadraticSmoothRel: false,
  SVGPathSegLinetoAbs  : false,
  SVGPathSegLinetoHorizontalAbs: false,
  SVGPathSegLinetoHorizontalRel: false,
  SVGPathSegLinetoRel  : false,
  SVGPathSegLinetoVerticalAbs: false,
  SVGPathSegLinetoVerticalRel: false,
  SVGPathSegList       : false,
  SVGPathSegMovetoAbs  : false,
  SVGPathSegMovetoRel  : false,
  SVGPatternElement    : false,
  SVGPoint             : false,
  SVGPointList         : false,
  SVGPolygonElement    : false,
  SVGPolylineElement   : false,
  SVGPreserveAspectRatio: false,
  SVGRadialGradientElement: false,
  SVGRect              : false,
  SVGRectElement       : false,
  SVGRenderingIntent   : false,
  SVGSVGElement        : false,
  SVGScriptElement     : false,
  SVGSetElement        : false,
  SVGStopElement       : false,
  SVGStringList        : false,
  SVGStylable          : false,
  SVGStyleElement      : false,
  SVGSwitchElement     : false,
  SVGSymbolElement     : false,
  SVGTRefElement       : false,
  SVGTSpanElement      : false,
  SVGTests             : false,
  SVGTextContentElement: false,
  SVGTextElement       : false,
  SVGTextPathElement   : false,
  SVGTextPositioningElement: false,
  SVGTitleElement      : false,
  SVGTransform         : false,
  SVGTransformList     : false,
  SVGTransformable     : false,
  SVGURIReference      : false,
  SVGUnitTypes         : false,
  SVGUseElement        : false,
  SVGVKernElement      : false,
  SVGViewElement       : false,
  SVGViewSpec          : false,
  SVGZoomAndPan        : false,
  Text                 : false,
  TextDecoder          : false,
  TextEncoder          : false,
  TimeEvent            : false,
  top                  : false,
  URL                  : false,
  URLSearchParams      : false,
  WebGLActiveInfo      : false,
  WebGLBuffer          : false,
  WebGLContextEvent    : false,
  WebGLFramebuffer     : false,
  WebGLProgram         : false,
  WebGLRenderbuffer    : false,
  WebGLRenderingContext: false,
  WebGLShader          : false,
  WebGLShaderPrecisionFormat: false,
  WebGLTexture         : false,
  WebGLUniformLocation : false,
  WebSocket            : false,
  window               : false,
  Window               : false,
  Worker               : false,
  XDomainRequest       : false,
  XMLDocument          : false,
  XMLHttpRequest       : false,
  XMLSerializer        : false,
  XPathEvaluator       : false,
  XPathException       : false,
  XPathExpression      : false,
  XPathNamespace       : false,
  XPathNSResolver      : false,
  XPathResult          : false
};

exports.devel = {
  alert  : false,
  confirm: false,
  console: false,
  Debug  : false,
  opera  : false,
  prompt : false
};

exports.worker = {
  addEventListener    : true, // EventTarget
  atob                : true, // WindowOrWorkerGlobalScope
  btoa                : true, // WindowOrWorkerGlobalScope
  clearInterval       : true, // WindowOrWorkerGlobalScope
  clearTimeout        : true, // WindowOrWorkerGlobalScope
  createImageBitmap   : true, // WindowOrWorkerGlobalScope
  dispatchEvent       : true, // EventTarget
  importScripts       : true,
  onmessage           : true,
  origin              : true, // WindowOrWorkerGlobalScope
  postMessage         : true,
  queueMicrotask      : true, // WindowOrWorkerGlobalScope
  removeEventListener : true, // EventTarget
  self                : true,
  setInterval         : true, // WindowOrWorkerGlobalScope
  setTimeout          : true, // WindowOrWorkerGlobalScope
  FileReaderSync      : true
};

// Widely adopted global names that are not part of ECMAScript standard
exports.nonstandard = {
  escape  : false,
  unescape: false
};

// Globals provided by popular JavaScript environments.

exports.couch = {
  "require" : false,
  respond   : false,
  getRow    : false,
  emit      : false,
  send      : false,
  start     : false,
  sum       : false,
  log       : false,
  exports   : false,
  module    : false,
  provides  : false
};

exports.node = {
  __filename    : false,
  __dirname     : false,
  arguments     : false,
  GLOBAL        : false,
  global        : false,
  module        : false,
  require       : false,
  Intl          : false,

  // These globals are writeable because Node allows the following
  // usage pattern: var Buffer = require("buffer").Buffer;

  Buffer         : true,
  console        : true,
  exports        : true,
  process        : true,
  setTimeout     : true,
  clearTimeout   : true,
  setInterval    : true,
  clearInterval  : true,
  setImmediate   : true, // v0.9.1+
  clearImmediate : true, // v0.9.1+
  URL            : true, // v10.0.0+
  URLSearchParams: true, // v10.0.0+
  TextDecoder    : true, // v11.0.0+
  TextEncoder    : true, // v11.0.0+
  AbortController: true, // v15.4.0+
  Event          : true, // v15.4.0+
  EventTarget    : true, // v15.4.0+
  atob           : true, // v16.0.0+
  btoa           : true, // v16.0.0+
  structuredClone: true, // v17.0.0+
  Blob           : true, // v18.0.0+
  CompressionStream: true, // v18.0.0+
  DecompressionStream: true, // v18.0.0+
  FormData       : true, // v18.0.0+
  Headers        : true, // v18.0.0+
  ReadableStream : true, // v18.0.0+
  Request        : true, // v18.0.0+
  Response       : true, // v18.0.0+
  TransformStream: true, // v18.0.0+
  WritableStream : true, // v18.0.0+
  fetch          : true, // v18.0.0+
  CustomEvent    : true, // v19.0.0+
  crypto         : true  // v19.0.0+
};

exports.browserify = {
  __filename    : false,
  __dirname     : false,
  global        : false,
  module        : false,
  require       : false,
  Buffer        : true,
  exports       : true,
  process       : true
};

exports.phantom = {
  phantom      : true,
  require      : true,
  WebPage      : true,
  console      : true, // in examples, but undocumented
  exports      : true  // v1.7+
};

exports.qunit = {
  asyncTest      : false,
  deepEqual      : false,
  equal          : false,
  expect         : false,
  module         : false,
  notDeepEqual   : false,
  notEqual       : false,
  notOk          : false,
  notPropEqual   : false,
  notStrictEqual : false,
  ok             : false,
  propEqual      : false,
  QUnit          : false,
  raises         : false,
  start          : false,
  stop           : false,
  strictEqual    : false,
  test           : false,
  "throws"       : false
};

exports.rhino = {
  arguments    : false,
  defineClass  : false,
  deserialize  : false,
  gc           : false,
  help         : false,
  importClass  : false,
  importPackage: false,
  "java"       : false,
  load         : false,
  loadClass    : false,
  Packages     : false,
  print        : false,
  quit         : false,
  readFile     : false,
  readUrl      : false,
  runCommand   : false,
  seal         : false,
  serialize    : false,
  spawn        : false,
  sync         : false,
  toint32      : false,
  version      : false
};

exports.shelljs = {
  target       : false,
  echo         : false,
  exit         : false,
  cd           : false,
  pwd          : false,
  ls           : false,
  find         : false,
  cp           : false,
  rm           : false,
  mv           : false,
  mkdir        : false,
  test         : false,
  cat          : false,
  sed          : false,
  grep         : false,
  which        : false,
  dirs         : false,
  pushd        : false,
  popd         : false,
  env          : false,
  exec         : false,
  chmod        : false,
  config       : false,
  error        : false,
  tempdir      : false
};

exports.typed = {
  ArrayBuffer         : false,
  ArrayBufferView     : false,
  DataView            : false,
  Float32Array        : false,
  Float64Array        : false,
  Int16Array          : false,
  Int32Array          : false,
  Int8Array           : false,
  Uint16Array         : false,
  Uint32Array         : false,
  Uint8Array          : false,
  Uint8ClampedArray   : false
};

exports.wsh = {
  ActiveXObject            : true,
  Enumerator               : true,
  GetObject                : true,
  ScriptEngine             : true,
  ScriptEngineBuildVersion : true,
  ScriptEngineMajorVersion : true,
  ScriptEngineMinorVersion : true,
  VBArray                  : true,
  WSH                      : true,
  WScript                  : true,
  XDomainRequest           : true
};

// Globals provided by popular JavaScript libraries.

exports.dojo = {
  dojo     : false,
  dijit    : false,
  dojox    : false,
  define   : false,
  "require": false
};

exports.jquery = {
  "$"    : false,
  jQuery : false
};

exports.mootools = {
  "$"           : false,
  "$$"          : false,
  Asset         : false,
  Browser       : false,
  Chain         : false,
  Class         : false,
  Color         : false,
  Cookie        : false,
  Core          : false,
  Document      : false,
  DomReady      : false,
  DOMEvent      : false,
  DOMReady      : false,
  Drag          : false,
  Element       : false,
  Elements      : false,
  Event         : false,
  Events        : false,
  Fx            : false,
  Group         : false,
  Hash          : false,
  HtmlTable     : false,
  IFrame        : false,
  IframeShim    : false,
  InputValidator: false,
  instanceOf    : false,
  Keyboard      : false,
  Locale        : false,
  Mask          : false,
  MooTools      : false,
  Native        : false,
  Options       : false,
  OverText      : false,
  Request       : false,
  Scroller      : false,
  Slick         : false,
  Slider        : false,
  Sortables     : false,
  Spinner       : false,
  Swiff         : false,
  Tips          : false,
  Type          : false,
  typeOf        : false,
  URI           : false,
  Window        : false
};

exports.prototypejs = {
  "$"               : false,
  "$$"              : false,
  "$A"              : false,
  "$F"              : false,
  "$H"              : false,
  "$R"              : false,
  "$break"          : false,
  "$continue"       : false,
  "$w"              : false,
  Abstract          : false,
  Ajax              : false,
  Class             : false,
  Enumerable        : false,
  Element           : false,
  Event             : false,
  Field             : false,
  Form              : false,
  Hash              : false,
  Insertion         : false,
  ObjectRange       : false,
  PeriodicalExecuter: false,
  Position          : false,
  Prototype         : false,
  Selector          : false,
  Template          : false,
  Toggle            : false,
  Try               : false,
  Autocompleter     : false,
  Builder           : false,
  Control           : false,
  Draggable         : false,
  Draggables        : false,
  Droppables        : false,
  Effect            : false,
  Sortable          : false,
  SortableObserver  : false,
  Sound             : false,
  Scriptaculous     : false
};

exports.yui = {
  YUI       : false,
  Y         : false,
  YUI_config: false
};

exports.mocha = {
  // Global (for config etc.)
  mocha       : false,
  // BDD
  describe    : false,
  xdescribe   : false,
  context     : false,
  xcontext    : false,
  it          : false,
  xit         : false,
  specify     : false,
  xspecify    : false,
  before      : false,
  after       : false,
  beforeEach  : false,
  afterEach   : false,
  // TDD
  suite         : false,
  test          : false,
  setup         : false,
  teardown      : false,
  suiteSetup    : false,
  suiteTeardown : false
};

exports.jasmine = {
  jasmine     : false,
  describe    : false,
  xdescribe   : false,
  it          : false,
  xit         : false,
  beforeEach  : false,
  afterEach   : false,
  setFixtures : false,
  loadFixtures: false,
  spyOn       : false,
  expect      : false,
  // Jasmine 1.3
  runs        : false,
  waitsFor    : false,
  waits       : false,
  // Jasmine 2.1
  beforeAll   : false,
  afterAll    : false,
  fail        : false,
  fdescribe   : false,
  fit         : false,
  pending     : false,
  // Jasmine 2.6
  spyOnProperty: false
};
