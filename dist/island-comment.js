(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global['island-comment'] = factory());
}(this, (function () { 'use strict';

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

    /*!
     * isobject <https://github.com/jonschlinkert/isobject>
     *
     * Copyright (c) 2014-2017, Jon Schlinkert.
     * Released under the MIT License.
     */

    // 请求

    var Comment = function () {
        function Comment(option) {
            classCallCheck(this, Comment);

            this.option = Object.assign({}, Comment.DEFAULTS, option);
            console.log(true);
        }

        createClass(Comment, [{
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
        return Comment;
    }();

    window.Comment = Comment;

    return Comment;

})));
