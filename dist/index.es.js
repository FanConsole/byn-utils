const roundNumber = (num, decimal = 2, opt) => {
  const n = Number(num);
  if (isNaN(n)) {
    return 0;
  }
  const { floor } = opt || {};
  const p1 = Math.pow(10, decimal + 1);
  const p2 = Math.pow(10, decimal);
  return (!floor ? Math.round(n * p1 / 10) : Math.floor(n * p1 / 10)) / p2;
};
const floorNumber = (num, decimal = 2) => roundNumber(num, decimal);
const isSSR = typeof window === "undefined";
function setStorage(k, data, options) {
  if (!k || isSSR)
    return;
  const { expired, runTime } = { ...options };
  const d = JSON.stringify({ t: Date.now(), expired, data });
  runTime ? sessionStorage.setItem(k, d) : localStorage.setItem(k, d);
}
function getStorage(k, options) {
  if (!k || isSSR)
    return null;
  const { runTime, expired } = { ...options };
  let d = runTime ? sessionStorage.getItem(k) : localStorage.getItem(k);
  if (!d)
    return d;
  d = JSON.parse(d);
  const exp = expired || d.expired;
  if (exp && Date.now() - d.t > exp)
    return null;
  return d.data;
}
function removeStorage(k, options) {
  if (isSSR)
    return;
  const { runTime } = { ...options };
  runTime ? sessionStorage.removeItem(k) : localStorage.removeItem(k);
}
function clearStorage(options) {
  if (isSSR)
    return;
  const { runTime } = { ...options };
  runTime ? sessionStorage.clear() : localStorage.clear();
}
function getSystemInfo() {
  if (typeof window === "undefined")
    return {};
  const ua = navigator.userAgent;
  const isMac = /macintosh|mac os x/i.test(ua);
  return {
    devicePixelRatio: window.devicePixelRatio,
    language: navigator.language,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    isMac,
    isIos: /(iPhone|iPad|iPod|iOS)/i.test(ua) || isMac,
    isWeixin: /micromessenger/.test(ua.toLowerCase()),
    isAlipay: /alipay/.test(ua.toLowerCase())
  };
}
function makingCall(phone) {
  location.href = "tel:" + phone;
}
function camelize(str, pascal = false) {
  const s = str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return !pascal ? s : `${s[0].toUpperCase()}${s.substring(1)}`;
}
function kebabCase(str) {
  return str.replace(/[A-Z]/g, (matched) => {
    return "-" + matched.toLowerCase();
  });
}
function throttle(fn, wait = 150) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last > wait) {
      fn.apply(this, args);
      last = now;
    }
  };
}
function debounce(fn, wait = 200, immediate = false) {
  let timer;
  return function(...args) {
    if (timer)
      clearTimeout(timer);
    if (immediate) {
      timer = null;
      return fn.apply(this, args);
    }
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
function colorRgba(color, opacity = 1) {
  if (!color)
    return;
  let str = color.toLowerCase();
  const reg = /^#([0-9a-f]{3}|[0-9a-f]{6})$/;
  if (reg.test(str)) {
    if (str.length === 4) {
      let s = "#";
      for (let i = 1; i < 4; i += 1) {
        s += str[i] + str[i];
      }
      str = s;
    }
    const rgbArr = [];
    for (let i = 1; i < 7; i += 2) {
      rgbArr.push(parseInt("0x" + str.substring(i, i + 2), 16));
    }
    return `rgba(${rgbArr.join(",")},${opacity})`;
  }
  if (str.startsWith("rgba")) {
    const arr = str.split(",");
    arr[3] = `${opacity})`;
    return arr.join(",");
  }
  if (str.startsWith("rgb")) {
    return (str.substring(0, str.length - 1) + `,${opacity})`).replace("rgb", "rgba");
  }
  return str;
}
function dateFromString(datetimeStr) {
  if (datetimeStr.length > 19)
    datetimeStr = datetimeStr.substring(0, 19).replace("T", " ");
  return new Date(datetimeStr.replace(/-/g, "/"));
}
function padNumber(n, width = 2, opt) {
  const { right, sign = "0" } = opt || {};
  const nStr = String(n);
  let padStr = "";
  const padN = width - nStr.length;
  if (padN > 0) {
    for (let i = 0; i < padN; i++) {
      padStr += sign;
    }
  }
  return !right ? `${padStr}${nStr}` : `${nStr}${padStr}`;
}
function formatDate(date, opt) {
  const { format = "YYYY-MM-DD HH:mm:ss" } = opt || {};
  const YY = date.getFullYear();
  const MM = padNumber(date.getMonth() + 1, 2);
  const DD = padNumber(date.getDate(), 2);
  const HH = padNumber(date.getHours(), 2);
  const mm = padNumber(date.getMinutes(), 2);
  const ss = padNumber(date.getSeconds(), 2);
  return format.replace("YYYY", `${YY}`).replace("MM", MM).replace("DD", DD).replace("HH", HH).replace("mm", mm).replace("ss", ss);
}
const partNumber = (n) => Number(n).toLocaleString();
const parseTimeData = (time, hasDays = true) => {
  const SECOND = 1e3;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  time = time || 0;
  let days = "00";
  let hours = "00";
  if (hasDays) {
    days = padNumber(Math.floor(time / DAY));
    hours = padNumber(Math.floor(time % DAY / HOUR));
  } else {
    hours = padNumber(Math.floor(time / HOUR));
  }
  const minutes = padNumber(Math.floor(time % HOUR / MINUTE));
  const seconds = padNumber(Math.floor(time % MINUTE / SECOND));
  const milliseconds = Math.floor(Math.floor(time % SECOND) / 100);
  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  };
};
function isPromiseLike(it) {
  return it instanceof Promise || typeof (it == null ? void 0 : it.then) === "function";
}
function validatePhoneNumber(phone) {
  const reg = /^1[3-9]{1}\d{9}$/;
  return reg.test(phone);
}
const inBrowser = typeof window !== "undefined";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var clipboard = { exports: {} };
/*!
 * clipboard.js v2.0.11
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */
(function(module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
    module.exports = factory();
  })(commonjsGlobal, function() {
    return function() {
      var __webpack_modules__ = {
        686: function(__unused_webpack_module, __webpack_exports__, __webpack_require__2) {
          __webpack_require__2.d(__webpack_exports__, {
            "default": function() {
              return clipboard2;
            }
          });
          var tiny_emitter = __webpack_require__2(279);
          var tiny_emitter_default = /* @__PURE__ */ __webpack_require__2.n(tiny_emitter);
          var listen = __webpack_require__2(370);
          var listen_default = /* @__PURE__ */ __webpack_require__2.n(listen);
          var src_select = __webpack_require__2(817);
          var select_default = /* @__PURE__ */ __webpack_require__2.n(src_select);
          function command(type) {
            try {
              return document.execCommand(type);
            } catch (err) {
              return false;
            }
          }
          var ClipboardActionCut = function ClipboardActionCut2(target) {
            var selectedText = select_default()(target);
            command("cut");
            return selectedText;
          };
          var actions_cut = ClipboardActionCut;
          function createFakeElement(value) {
            var isRTL = document.documentElement.getAttribute("dir") === "rtl";
            var fakeElement = document.createElement("textarea");
            fakeElement.style.fontSize = "12pt";
            fakeElement.style.border = "0";
            fakeElement.style.padding = "0";
            fakeElement.style.margin = "0";
            fakeElement.style.position = "absolute";
            fakeElement.style[isRTL ? "right" : "left"] = "-9999px";
            var yPosition = window.pageYOffset || document.documentElement.scrollTop;
            fakeElement.style.top = "".concat(yPosition, "px");
            fakeElement.setAttribute("readonly", "");
            fakeElement.value = value;
            return fakeElement;
          }
          var fakeCopyAction = function fakeCopyAction2(value, options) {
            var fakeElement = createFakeElement(value);
            options.container.appendChild(fakeElement);
            var selectedText = select_default()(fakeElement);
            command("copy");
            fakeElement.remove();
            return selectedText;
          };
          var ClipboardActionCopy = function ClipboardActionCopy2(target) {
            var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
              container: document.body
            };
            var selectedText = "";
            if (typeof target === "string") {
              selectedText = fakeCopyAction(target, options);
            } else if (target instanceof HTMLInputElement && !["text", "search", "url", "tel", "password"].includes(target === null || target === void 0 ? void 0 : target.type)) {
              selectedText = fakeCopyAction(target.value, options);
            } else {
              selectedText = select_default()(target);
              command("copy");
            }
            return selectedText;
          };
          var actions_copy = ClipboardActionCopy;
          function _typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          var ClipboardActionDefault = function ClipboardActionDefault2() {
            var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            var _options$action = options.action, action = _options$action === void 0 ? "copy" : _options$action, container = options.container, target = options.target, text = options.text;
            if (action !== "copy" && action !== "cut") {
              throw new Error('Invalid "action" value, use either "copy" or "cut"');
            }
            if (target !== void 0) {
              if (target && _typeof(target) === "object" && target.nodeType === 1) {
                if (action === "copy" && target.hasAttribute("disabled")) {
                  throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                }
                if (action === "cut" && (target.hasAttribute("readonly") || target.hasAttribute("disabled"))) {
                  throw new Error(`Invalid "target" attribute. You can't cut text from elements with "readonly" or "disabled" attributes`);
                }
              } else {
                throw new Error('Invalid "target" value, use a valid Element');
              }
            }
            if (text) {
              return actions_copy(text, {
                container
              });
            }
            if (target) {
              return action === "cut" ? actions_cut(target) : actions_copy(target, {
                container
              });
            }
          };
          var actions_default = ClipboardActionDefault;
          function clipboard_typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              clipboard_typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              clipboard_typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return clipboard_typeof(obj);
          }
          function _classCallCheck(instance2, Constructor) {
            if (!(instance2 instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _setPrototypeOf(o, p) {
            _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
              o2.__proto__ = p2;
              return o2;
            };
            return _setPrototypeOf(o, p);
          }
          function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
              var Super = _getPrototypeOf(Derived), result;
              if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
              } else {
                result = Super.apply(this, arguments);
              }
              return _possibleConstructorReturn(this, result);
            };
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (clipboard_typeof(call) === "object" || typeof call === "function")) {
              return call;
            }
            return _assertThisInitialized(self2);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct)
              return false;
            if (Reflect.construct.sham)
              return false;
            if (typeof Proxy === "function")
              return true;
            try {
              Date.prototype.toString.call(Reflect.construct(Date, [], function() {
              }));
              return true;
            } catch (e) {
              return false;
            }
          }
          function _getPrototypeOf(o) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
              return o2.__proto__ || Object.getPrototypeOf(o2);
            };
            return _getPrototypeOf(o);
          }
          function getAttributeValue(suffix, element) {
            var attribute = "data-clipboard-".concat(suffix);
            if (!element.hasAttribute(attribute)) {
              return;
            }
            return element.getAttribute(attribute);
          }
          var Clipboard2 = /* @__PURE__ */ function(_Emitter) {
            _inherits(Clipboard3, _Emitter);
            var _super = _createSuper(Clipboard3);
            function Clipboard3(trigger, options) {
              var _this;
              _classCallCheck(this, Clipboard3);
              _this = _super.call(this);
              _this.resolveOptions(options);
              _this.listenClick(trigger);
              return _this;
            }
            _createClass(Clipboard3, [{
              key: "resolveOptions",
              value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                this.action = typeof options.action === "function" ? options.action : this.defaultAction;
                this.target = typeof options.target === "function" ? options.target : this.defaultTarget;
                this.text = typeof options.text === "function" ? options.text : this.defaultText;
                this.container = clipboard_typeof(options.container) === "object" ? options.container : document.body;
              }
            }, {
              key: "listenClick",
              value: function listenClick(trigger) {
                var _this2 = this;
                this.listener = listen_default()(trigger, "click", function(e) {
                  return _this2.onClick(e);
                });
              }
            }, {
              key: "onClick",
              value: function onClick(e) {
                var trigger = e.delegateTarget || e.currentTarget;
                var action = this.action(trigger) || "copy";
                var text = actions_default({
                  action,
                  container: this.container,
                  target: this.target(trigger),
                  text: this.text(trigger)
                });
                this.emit(text ? "success" : "error", {
                  action,
                  text,
                  trigger,
                  clearSelection: function clearSelection() {
                    if (trigger) {
                      trigger.focus();
                    }
                    window.getSelection().removeAllRanges();
                  }
                });
              }
            }, {
              key: "defaultAction",
              value: function defaultAction(trigger) {
                return getAttributeValue("action", trigger);
              }
            }, {
              key: "defaultTarget",
              value: function defaultTarget(trigger) {
                var selector = getAttributeValue("target", trigger);
                if (selector) {
                  return document.querySelector(selector);
                }
              }
            }, {
              key: "defaultText",
              value: function defaultText(trigger) {
                return getAttributeValue("text", trigger);
              }
            }, {
              key: "destroy",
              value: function destroy() {
                this.listener.destroy();
              }
            }], [{
              key: "copy",
              value: function copy(target) {
                var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
                  container: document.body
                };
                return actions_copy(target, options);
              }
            }, {
              key: "cut",
              value: function cut(target) {
                return actions_cut(target);
              }
            }, {
              key: "isSupported",
              value: function isSupported() {
                var action = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ["copy", "cut"];
                var actions = typeof action === "string" ? [action] : action;
                var support = !!document.queryCommandSupported;
                actions.forEach(function(action2) {
                  support = support && !!document.queryCommandSupported(action2);
                });
                return support;
              }
            }]);
            return Clipboard3;
          }(tiny_emitter_default());
          var clipboard2 = Clipboard2;
        },
        828: function(module2) {
          var DOCUMENT_NODE_TYPE = 9;
          if (typeof Element !== "undefined" && !Element.prototype.matches) {
            var proto = Element.prototype;
            proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
          }
          function closest(element, selector) {
            while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
              if (typeof element.matches === "function" && element.matches(selector)) {
                return element;
              }
              element = element.parentNode;
            }
          }
          module2.exports = closest;
        },
        438: function(module2, __unused_webpack_exports, __webpack_require__2) {
          var closest = __webpack_require__2(828);
          function _delegate(element, selector, type, callback, useCapture) {
            var listenerFn = listener.apply(this, arguments);
            element.addEventListener(type, listenerFn, useCapture);
            return {
              destroy: function() {
                element.removeEventListener(type, listenerFn, useCapture);
              }
            };
          }
          function delegate(elements, selector, type, callback, useCapture) {
            if (typeof elements.addEventListener === "function") {
              return _delegate.apply(null, arguments);
            }
            if (typeof type === "function") {
              return _delegate.bind(null, document).apply(null, arguments);
            }
            if (typeof elements === "string") {
              elements = document.querySelectorAll(elements);
            }
            return Array.prototype.map.call(elements, function(element) {
              return _delegate(element, selector, type, callback, useCapture);
            });
          }
          function listener(element, selector, type, callback) {
            return function(e) {
              e.delegateTarget = closest(e.target, selector);
              if (e.delegateTarget) {
                callback.call(element, e);
              }
            };
          }
          module2.exports = delegate;
        },
        879: function(__unused_webpack_module, exports2) {
          exports2.node = function(value) {
            return value !== void 0 && value instanceof HTMLElement && value.nodeType === 1;
          };
          exports2.nodeList = function(value) {
            var type = Object.prototype.toString.call(value);
            return value !== void 0 && (type === "[object NodeList]" || type === "[object HTMLCollection]") && "length" in value && (value.length === 0 || exports2.node(value[0]));
          };
          exports2.string = function(value) {
            return typeof value === "string" || value instanceof String;
          };
          exports2.fn = function(value) {
            var type = Object.prototype.toString.call(value);
            return type === "[object Function]";
          };
        },
        370: function(module2, __unused_webpack_exports, __webpack_require__2) {
          var is = __webpack_require__2(879);
          var delegate = __webpack_require__2(438);
          function listen(target, type, callback) {
            if (!target && !type && !callback) {
              throw new Error("Missing required arguments");
            }
            if (!is.string(type)) {
              throw new TypeError("Second argument must be a String");
            }
            if (!is.fn(callback)) {
              throw new TypeError("Third argument must be a Function");
            }
            if (is.node(target)) {
              return listenNode(target, type, callback);
            } else if (is.nodeList(target)) {
              return listenNodeList(target, type, callback);
            } else if (is.string(target)) {
              return listenSelector(target, type, callback);
            } else {
              throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList");
            }
          }
          function listenNode(node, type, callback) {
            node.addEventListener(type, callback);
            return {
              destroy: function() {
                node.removeEventListener(type, callback);
              }
            };
          }
          function listenNodeList(nodeList, type, callback) {
            Array.prototype.forEach.call(nodeList, function(node) {
              node.addEventListener(type, callback);
            });
            return {
              destroy: function() {
                Array.prototype.forEach.call(nodeList, function(node) {
                  node.removeEventListener(type, callback);
                });
              }
            };
          }
          function listenSelector(selector, type, callback) {
            return delegate(document.body, selector, type, callback);
          }
          module2.exports = listen;
        },
        817: function(module2) {
          function select(element) {
            var selectedText;
            if (element.nodeName === "SELECT") {
              element.focus();
              selectedText = element.value;
            } else if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
              var isReadOnly = element.hasAttribute("readonly");
              if (!isReadOnly) {
                element.setAttribute("readonly", "");
              }
              element.select();
              element.setSelectionRange(0, element.value.length);
              if (!isReadOnly) {
                element.removeAttribute("readonly");
              }
              selectedText = element.value;
            } else {
              if (element.hasAttribute("contenteditable")) {
                element.focus();
              }
              var selection = window.getSelection();
              var range = document.createRange();
              range.selectNodeContents(element);
              selection.removeAllRanges();
              selection.addRange(range);
              selectedText = selection.toString();
            }
            return selectedText;
          }
          module2.exports = select;
        },
        279: function(module2) {
          function E() {
          }
          E.prototype = {
            on: function(name, callback, ctx) {
              var e = this.e || (this.e = {});
              (e[name] || (e[name] = [])).push({
                fn: callback,
                ctx
              });
              return this;
            },
            once: function(name, callback, ctx) {
              var self2 = this;
              function listener() {
                self2.off(name, listener);
                callback.apply(ctx, arguments);
              }
              listener._ = callback;
              return this.on(name, listener, ctx);
            },
            emit: function(name) {
              var data = [].slice.call(arguments, 1);
              var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
              var i = 0;
              var len = evtArr.length;
              for (i; i < len; i++) {
                evtArr[i].fn.apply(evtArr[i].ctx, data);
              }
              return this;
            },
            off: function(name, callback) {
              var e = this.e || (this.e = {});
              var evts = e[name];
              var liveEvents = [];
              if (evts && callback) {
                for (var i = 0, len = evts.length; i < len; i++) {
                  if (evts[i].fn !== callback && evts[i].fn._ !== callback)
                    liveEvents.push(evts[i]);
                }
              }
              liveEvents.length ? e[name] = liveEvents : delete e[name];
              return this;
            }
          };
          module2.exports = E;
          module2.exports.TinyEmitter = E;
        }
      };
      var __webpack_module_cache__ = {};
      function __webpack_require__(moduleId) {
        if (__webpack_module_cache__[moduleId]) {
          return __webpack_module_cache__[moduleId].exports;
        }
        var module2 = __webpack_module_cache__[moduleId] = {
          exports: {}
        };
        __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__);
        return module2.exports;
      }
      !function() {
        __webpack_require__.n = function(module2) {
          var getter = module2 && module2.__esModule ? function() {
            return module2["default"];
          } : function() {
            return module2;
          };
          __webpack_require__.d(getter, { a: getter });
          return getter;
        };
      }();
      !function() {
        __webpack_require__.d = function(exports2, definition) {
          for (var key in definition) {
            if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports2, key)) {
              Object.defineProperty(exports2, key, { enumerable: true, get: definition[key] });
            }
          }
        };
      }();
      !function() {
        __webpack_require__.o = function(obj, prop) {
          return Object.prototype.hasOwnProperty.call(obj, prop);
        };
      }();
      return __webpack_require__(686);
    }().default;
  });
})(clipboard);
var Clipboard = /* @__PURE__ */ getDefaultExportFromCjs(clipboard.exports);
var useClipboard = (opts) => {
  const appendToBody = (opts === null || opts === void 0 ? void 0 : opts.appendToBody) === void 0 ? true : opts.appendToBody;
  return {
    toClipboard(text, container) {
      return new Promise((resolve, reject) => {
        const fakeEl = document.createElement("button");
        const clipboard2 = new Clipboard(fakeEl, {
          text: () => text,
          action: () => "copy",
          container: container !== void 0 ? container : document.body
        });
        clipboard2.on("success", (e) => {
          clipboard2.destroy();
          resolve(e);
        });
        clipboard2.on("error", (e) => {
          clipboard2.destroy();
          reject(e);
        });
        if (appendToBody)
          document.body.appendChild(fakeEl);
        fakeEl.click();
        if (appendToBody)
          document.body.removeChild(fakeEl);
      });
    }
  };
};
const { toClipboard } = useClipboard();
const setClipboard = (txt) => {
  return new Promise(async (resolve, reject) => {
    try {
      await toClipboard(txt);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
const jsSdkId = "wxJsSdk";
const jsSdkUrl = "//res.wx.qq.com/open/js/jweixin-1.6.0.js";
const loadJs = (url, props) => {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    if (props) {
      for (let k in props) {
        el.setAttribute(k, props[k]);
      }
    }
    el.src = url;
    el.onload = resolve;
    el.onerror = (e) => {
      document.head.removeChild(el);
      reject(e);
    };
    document.head.appendChild(el);
  });
};
const envData = { configData: null };
const initEnv = () => {
  if (!inBrowser)
    return;
  const ua = navigator.userAgent;
  const isMac = /macintosh|mac os x/i.test(ua);
  Object.assign(envData, {
    isIos: /(iPhone|iPad|iPod|iOS)/i.test(ua) || isMac,
    isWeixin: /micromessenger/.test(ua.toLowerCase()),
    launchedUrl: location.href
  });
};
initEnv();
const readyStatus = /* @__PURE__ */ new Map();
const readyCallback = /* @__PURE__ */ new Map();
const addCallback = (url, fn) => {
  const arr = readyCallback.get(url) || [];
  arr.push(fn);
  readyCallback.set(url, arr);
};
const removeCallback = (url, fn) => {
  if (fn && readyCallback.has(url)) {
    const arr = readyCallback.get(url);
    if (!arr)
      return;
    const i = arr.findIndex((cb) => cb === fn);
    if (i !== -1)
      arr.splice(i, 1);
    readyCallback.set(url, arr);
  } else {
    readyCallback.delete(url);
  }
};
const distributeReadyCallback = (url) => {
  const arr = readyCallback.get(url);
  if (!arr)
    return;
  arr.forEach((cb) => cb());
  readyCallback.delete(url);
};
const createInstance = (opt) => {
  const { isIos, isWeixin } = envData;
  let sdkLaunchedUrl = (opt == null ? void 0 : opt.sdkLoadedUrl) || location.href;
  const onConfigReady = (fn, opt2) => {
    const idUrl = (opt2 == null ? void 0 : opt2.url) || location.href;
    if (readyStatus.get(idUrl))
      fn();
    else
      addCallback(idUrl, fn);
  };
  const removeReadyCallback = (fn, opt2) => {
    removeCallback((opt2 == null ? void 0 : opt2.url) || location.href, fn);
  };
  const configWxSdk = async () => {
    if (!isWeixin)
      throw new Error("\u975E\u5FAE\u4FE1\u73AF\u5883\uFF0C\u65E0\u9700\u914D\u7F6E");
    if (!(opt == null ? void 0 : opt.dataGetter))
      throw new Error("\u53C2\u6570\u7F3A\u5931\uFF1AdataGetter");
    const url = location.href;
    if (!window.wx) {
      await loadJs(jsSdkUrl, { id: jsSdkId });
    }
    readyStatus.set(url, false);
    const res = opt.dataGetter({ url, sdkLoadedUrl: isIos && !envData.configData ? sdkLaunchedUrl : false });
    const { config, shareData } = isPromiseLike(res) ? await res : res;
    if (!envData.configData) {
      window.wx.config(config);
      if (isIos) {
        envData.configData = config;
        if (url !== sdkLaunchedUrl) {
          return configWxSdk();
        }
      }
    }
    return new Promise((resolve, reject) => {
      window.wx.ready(() => {
        if (shareData) {
          window.wx.updateTimelineShareData(shareData);
          window.wx.updateAppMessageShareData(shareData);
        }
        resolve({ ready: true });
        readyStatus.set(url, true);
        distributeReadyCallback(url);
      });
      window.wx.error((e) => {
        reject(new Error(e.errMsg));
      });
    });
  };
  return { configWxSdk, onConfigReady, removeReadyCallback };
};
let instance;
const useWxSdk = (opt) => {
  if (!instance)
    instance = createInstance(opt);
  return instance;
};
const supportType = ["png", "jpg", "jpeg"];
const compressImage = (file, damaged = 0.7) => {
  return new Promise((resolve) => {
    let f = file;
    initImage(file, (imageInfo) => {
      if (!supportType.includes(imageInfo.fileType.split("/")[1]))
        resolve({ file });
      const f1 = optImg(imageInfo, damaged);
      if (f1.size < f.size)
        f = f1;
      resolve({ file: f });
    });
  });
};
const initImage = async (file, callback) => {
  const URL = window.URL || window.webkitURL;
  const blob = URL.createObjectURL(new Blob([file]));
  const img = new Image();
  let w, h;
  img.src = blob;
  img.onload = () => {
    w = img.width;
    h = img.height;
    callback({ w, h, fileName: file.name, fileSize: file.size, fileType: file.type, img });
  };
};
const optImg = (imageInfo, damaged) => {
  let { fileName, w, h, img, fileType } = imageInfo;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;
  if (ctx)
    ctx.drawImage(img, 0, 0, w, h);
  const base64 = canvas.toDataURL(fileType, damaged);
  return basetoFile(base64, fileName);
};
const basetoFile = (base, filename) => {
  const arr = base.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
export { camelize, clearStorage, colorRgba, compressImage, dateFromString, debounce, floorNumber, formatDate, getStorage, getSystemInfo, inBrowser, isPromiseLike, kebabCase, makingCall, padNumber, parseTimeData, partNumber, removeStorage, roundNumber, setClipboard, setStorage, throttle, useWxSdk, validatePhoneNumber };
