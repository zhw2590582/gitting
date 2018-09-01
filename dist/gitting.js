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

    // 请求

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
        console.log("production");
      }

      createClass(Gitting, [{
        key: "render",
        value: function render(el) {
          this.container = el instanceof Element ? el : document.querySelector(el);
        }
      }], [{
        key: "DEFAULTS",
        get: function get$$1() {
          return {};
        }
      }]);
      return Gitting;
    }();

    window.Gitting = Gitting;

    return Gitting;

})));
