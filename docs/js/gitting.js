(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.gitting = factory());
}(this, (function () { 'use strict';

  /*!
   * isobject <https://github.com/jonschlinkert/isobject>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */

  var _isobject_3_0_1_isobject = function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
  };

  /*!
   * get-value <https://github.com/jonschlinkert/get-value>
   *
   * Copyright (c) 2014-2018, Jon Schlinkert.
   * Released under the MIT License.
   */



  var _getValue_3_0_1_getValue = function(target, path, options) {
    if (!_isobject_3_0_1_isobject(options)) {
      options = { default: options };
    }

    if (!isValidObject(target)) {
      return typeof options.default !== 'undefined' ? options.default : target;
    }

    if (typeof path === 'number') {
      path = String(path);
    }

    const isArray = Array.isArray(path);
    const isString = typeof path === 'string';
    const splitChar = options.separator || '.';
    const joinChar = options.joinChar || (typeof splitChar === 'string' ? splitChar : '.');

    if (!isString && !isArray) {
      return target;
    }

    if (isString && path in target) {
      return isValid(path, target, options) ? target[path] : options.default;
    }

    let segs = isArray ? path : split(path, splitChar, options);
    let len = segs.length;
    let idx = 0;

    do {
      let prop = segs[idx];
      if (typeof prop === 'number') {
        prop = String(prop);
      }

      while (prop && prop.slice(-1) === '\\') {
        prop = join([prop.slice(0, -1), segs[++idx] || ''], joinChar, options);
      }

      if (prop in target) {
        if (!isValid(prop, target, options)) {
          return options.default;
        }

        target = target[prop];
      } else {
        let hasProp = false;
        let n = idx + 1;

        while (n < len) {
          prop = join([prop, segs[n++]], joinChar, options);

          if ((hasProp = prop in target)) {
            if (!isValid(prop, target, options)) {
              return options.default;
            }

            target = target[prop];
            idx = n - 1;
            break;
          }
        }

        if (!hasProp) {
          return options.default;
        }
      }
    } while (++idx < len && isValidObject(target));

    if (idx === len) {
      return target;
    }

    return options.default;
  };

  function join(segs, joinChar, options) {
    if (typeof options.join === 'function') {
      return options.join(segs);
    }
    return segs[0] + joinChar + segs[1];
  }

  function split(path, splitChar, options) {
    if (typeof options.split === 'function') {
      return options.split(path);
    }
    return path.split(splitChar);
  }

  function isValid(key, target, options) {
    if (typeof options.isValid === 'function') {
      return options.isValid(key, target);
    }
    return true;
  }

  function isValidObject(val) {
    return _isobject_3_0_1_isobject(val) || Array.isArray(val) || typeof val === 'function';
  }

  function objToString(obj) {
    switch (typeof obj) {
      case "undefined":
          return 'undefined';
      case "object":
          let type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
          switch (type) {
              case "null":
                  return 'null';
              case "array":
                  return '[' + obj.map(key => objToString(key)).join(', ') + ']';
              case 'object':
                  return '{ ' + Object.keys(obj).map(key => key + ': ' + objToString(obj[key])).join(', ') + ' }';
              default:
                  try {
                    return obj.toString();
                  } catch (e) {
                    return '[Unknown type: ' + type + ']';
                  }
          }
      default:
          return obj.toString();
    }
  }

  var _objToString_1_0_1_objToString = objToString;

  var i18n = {
    'zh-CN': {
      init: "初始化一个评论"
    },
    en: {
      init: "Initialize A Comment"
    }
  };

  function i18n$1 (lang) {
    var langObj = i18n[lang] || i18n["zh"];
    return function (key) {
      var val = _getValue_3_0_1_getValue(langObj, key, {
        default: "unmatch: " + key
      });
      return _objToString_1_0_1_objToString(val);
    };
  }

  var _this = undefined;

  // 请求
  var request = function request(method, url, body) {
    method = method.toUpperCase();
    body = body && JSON.stringify(body);
    var headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    return fetch(url, {
      method: method,
      headers: headers,
      body: body
    }).then(function (res) {
      if (res.status === 404) {
        return Promise.reject("Unauthorized.");
      } else {
        return res.json();
      }
    });
  };

  // 查询url参数
  var getQueryString = function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  };

  // 从参数生成url
  var queryStringify = function queryStringify(query) {
    var queryString = Object.keys(query).map(function (key) {
      return key + "=" + encodeURIComponent(query[key] || '');
    }).join('&');
    return queryString;
  };

  var errorHandle = function errorHandle(condition, err, callback) {
    if (!condition) return;
    _this.container.insertAdjacentHTML('afterbegin', "<div class=\"gt-error\">" + err + "</div>");
    callback && callback();
    throw new TypeError(err);
  };

  // 获取token
  function getToken(url) {
      return request('get', url);
  }

  // 获取用户信息
  function getUserInfo(token) {
      return request('get', 'https://api.github.com/user?access_token=' + token);
  }

  var asyncToGenerator = function (fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Gitting = function () {
    function Gitting(option) {
      classCallCheck(this, Gitting);

      this.option = Object.assign({}, Gitting.DEFAULTS, option);
      this.i = i18n$1(this.option.language);
    }

    createClass(Gitting, [{
      key: "render",
      value: function render(el) {
        this.container = el instanceof Element ? el : document.querySelector(el);
        this.creatInit();
      }
    }, {
      key: "getCode",
      value: function getCode() {
        return getQueryString('code');
      }
    }, {
      key: "getUserInfo",
      value: function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(code, callback) {
          var query, data, userInfo;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  query = {
                    client_id: this.option.clientID,
                    client_secret: this.option.clientSecret,
                    code: code,
                    redirect_uri: location.href
                  };
                  _context.next = 3;
                  return getToken(this.option.proxy + "?" + queryStringify(query));

                case 3:
                  data = _context.sent;

                  errorHandle(!data.access_token, 'Can not get token, Please login again!', this.logout);
                  _context.next = 7;
                  return getUserInfo(data.access_token);

                case 7:
                  userInfo = _context.sent;

                  errorHandle(!userInfo.id, 'Can not get user info, Please login again!', this.logout);

                case 9:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function getUserInfo$$1(_x, _x2) {
          return _ref.apply(this, arguments);
        }

        return getUserInfo$$1;
      }()
    }, {
      key: "logout",
      value: function logout() {
        //
      }
    }, {
      key: "creatInit",
      value: function creatInit() {
        var query = {
          state: "Gitting",
          client_id: this.option.clientID,
          redirect_uri: location.href,
          scope: "public_repo"
        };
        this.container.insertAdjacentHTML('beforeend', "\n      <div class=\"gt-init\">\n          <a\n            class=\"gt-init-btn\"\n            href=\"http://github.com/login/oauth/authorize?client_id=" + queryStringify(query) + "\">\n            " + this.i('init') + "\n          </a>\n      </div>\n    ");
      }
    }, {
      key: "creatGitting",
      value: function creatGitting() {}
    }], [{
      key: "DEFAULTS",
      get: function get$$1() {
        return {
          clientID: '',
          clientSecret: '',
          repo: '',
          owner: '',
          admin: [],
          id: location.href,
          number: -1,
          labels: ['Gitting'],
          title: document.title,
          body: '',
          language: 'zh-CN',
          perPage: 10,
          proxy: 'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token'
        };
      }
    }]);
    return Gitting;
  }();

  window.Gitting = Gitting;

  return Gitting;

})));
//# sourceMappingURL=gitting.js.map
