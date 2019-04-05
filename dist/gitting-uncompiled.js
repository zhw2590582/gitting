(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Gitting = factory());
}(this, function () { 'use strict';

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] =
      GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        prototype[method] = function(arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList)
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  var regenerator = runtime_1;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var asyncToGenerator = _asyncToGenerator;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  var i18n = {
    'zh-cn': {
      init: "初始化一个评论",
      counts: "条评论",
      login: "登录",
      logout: "注销",
      leave: "发表评论",
      styling: "支持使用Markdown进行样式设置",
      write: "编写",
      preview: "预览",
      noPreview: "无预览内容",
      submit: "提交",
      reply: "回复",
      loadMore: "加载更多",
      loadEnd: "加载完毕",
      published: "发表于"
    },
    en: {
      init: "Initialize A Issue",
      counts: "comments",
      login: "Login",
      logout: "Logout",
      leave: "Leave a comment",
      styling: "Styling with Markdown is supported",
      write: "Write",
      preview: "Preview",
      noPreview: "Nothing to preview",
      submit: "Submit",
      reply: "Reply",
      loadMore: "Load More",
      loadEnd: "Load completed",
      published: "Published on"
    }
  };
  function i18n$1 (lang) {
    var langObj = i18n[lang] || i18n["zh-cn"];
    return function (key) {
      return langObj[key] || "Unmath key: ".concat(key);
    };
  }

  // 查询url参数
  var getURLParameters = function getURLParameters() {
    var url = window.location.href;
    return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(function (a, v) {
      return a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1), a;
    }, {});
  }; // 从参数生成url

  var queryStringify = function queryStringify(query) {
    var queryString = Object.keys(query).map(function (key) {
      return "".concat(key, "=").concat(encodeURIComponent(query[key] || ''));
    }).join('&');
    return queryString;
  }; // 保存storage

  var setStorage = function setStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }; // 获取storage

  var getStorage = function getStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }; // 删除storage

  var delStorage = function delStorage(key) {
    localStorage.removeItem(key);
  }; // 选择元素

  var query = function query() {
    var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    var selector = arguments.length > 1 ? arguments[1] : undefined;
    return doc.querySelector(selector);
  }; // 删除dom元素

  var removeElement = function removeElement(selector) {
    var el = selector instanceof Element ? selector : document.querySelector(selector);
    el && el.parentNode && el.parentNode.removeChild(el);
  }; // 创建loading

  var loading = function loading(selector) {
    var el = selector instanceof Element ? selector : document.querySelector(selector);
    var loadingEl = document.createElement('div');
    loadingEl.classList.add('gt-loading');
    loadingEl.innerHTML = "\n    <div class=\"lds-ellipsis\">\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n    </div>\n  ";
    el.appendChild(loadingEl);
    return function () {
      return el.removeChild(loadingEl);
    };
  };
  var smoothScroll = function smoothScroll(element) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: element.getBoundingClientRect().top + window.scrollY + offset
    });
  }; // 请求

  var request = function request(method, url, body, header) {
    method = method.toUpperCase();
    body = body && JSON.stringify(body);
    var headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    if (header) {
      headers = Object.assign({}, headers, header);
    }

    var token = getStorage('gitting-token');

    if (token) {
      headers.Authorization = "token ".concat(token);
    }

    return fetch(url, {
      method: method,
      headers: headers,
      body: body
    }).then(function (res) {
      if (res.status === 404) {
        return Promise.reject("Unauthorized.");
      } else if (res.status === 401) {
        delStorage("gitting-token");
        delStorage("gitting-userInfo");
        location.reload();
      } else {
        if (headers.Accept === 'text/html') {
          return res.text();
        } else {
          return res.json();
        }
      }
    });
  };

  function creatApi(option) {
    var issuesApi = "https://api.github.com/repos/".concat(option.owner, "/").concat(option.repo, "/issues");
    var baseQuery = {
      client_id: option.clientID,
      client_secret: option.clientSecret
    };
    return {
      // 获取token
      getToken: function getToken(code) {
        var query = Object.assign({}, baseQuery, {
          code: code,
          redirect_uri: location.href
        });
        return request('get', "".concat(option.proxy, "?").concat(queryStringify(query)));
      },
      // 获取用户信息
      getUserInfo: function getUserInfo(token) {
        return request('get', "https://api.github.com/user?access_token=".concat(token));
      },
      // 通过标签获取issue
      getIssueByLabel: function getIssueByLabel(labels) {
        var query = Object.assign({}, baseQuery, {
          labels: labels,
          t: new Date().getTime()
        });
        return request('get', "".concat(issuesApi, "?").concat(queryStringify(query)));
      },
      // 通过id获取issues
      getIssueById: function getIssueById(id) {
        var query = Object.assign({}, baseQuery, {
          t: new Date().getTime()
        });
        return request('get', "".concat(issuesApi, "/").concat(id, "?").concat(queryStringify(query)));
      },
      // 获取某条issues下的评论
      getComments: function getComments(id, page) {
        var query = Object.assign({}, baseQuery, {
          per_page: option.perPage,
          page: page,
          t: new Date().getTime()
        });
        return request('get', "".concat(issuesApi, "/").concat(id, "/comments?").concat(queryStringify(query)), null, {
          Accept: "application/vnd.github.v3.full+json"
        });
      },
      // 创建一条issues
      creatIssues: function creatIssues(issue) {
        return request('post', issuesApi, issue);
      },
      // 创建一条评论
      creatComments: function creatComments(id, body) {
        return request('post', "".concat(issuesApi, "/").concat(id, "/comments"), {
          body: body
        }, {
          Accept: "application/vnd.github.v3.full+json"
        });
      },
      // 解析markdown
      mdToHtml: function mdToHtml(text) {
        return request('post', "https://api.github.com/markdown", {
          text: text
        }, {
          Accept: "text/html"
        });
      }
    };
  }

  var dayjs_min = createCommonjsModule(function (module, exports) {
  !function(t,n){module.exports=n();}(commonjsGlobal,function(){var t="millisecond",n="second",e="minute",i="hour",r="day",s="week",u="month",a="quarter",o="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,n,e){var i=String(t);return !i||i.length>=n?t:""+Array(n+1-i.length).join(e)+t},d={s:c,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),i=Math.floor(e/60),r=e%60;return (n<=0?"+":"-")+c(i,2,"0")+":"+c(r,2,"0")},m:function(t,n){var e=12*(n.year()-t.year())+(n.month()-t.month()),i=t.clone().add(e,u),r=n-i<0,s=t.clone().add(e+(r?-1:1),u);return Number(-(e+(n-i)/(r?i-s:s-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:o,w:s,d:r,h:i,m:e,s:n,ms:t,Q:a}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof S},M=function(t,n,e){var i;if(!t)return null;if("string"==typeof t)m[t]&&(i=t),n&&(m[t]=n,i=t);else{var r=t.name;m[r]=t,i=r;}return e||(l=i),i},g=function(t,n,e){if(y(t))return t.clone();var i=n?"string"==typeof n?{format:n,pl:e}:n:{};return i.date=t,new S(i)},D=d;D.l=M,D.i=y,D.w=function(t,n){return g(t,{locale:n.$L,utc:n.$u})};var S=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0)||l,this.parse(t);}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(D.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var i=n.match(h);if(i)return e?new Date(Date.UTC(i[1],i[2]-1,i[3]||1,i[4]||0,i[5]||0,i[6]||0,i[7]||0)):new Date(i[1],i[2]-1,i[3]||1,i[4]||0,i[5]||0,i[6]||0,i[7]||0)}return new Date(n)}(t),this.init();},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},d.$utils=function(){return D},d.isValid=function(){return !("Invalid Date"===this.$d.toString())},d.isSame=function(t,n){var e=g(t);return this.startOf(n)<=e&&e<=this.endOf(n)},d.isAfter=function(t,n){return g(t)<this.startOf(n)},d.isBefore=function(t,n){return this.endOf(n)<g(t)},d.$g=function(t,n,e){return D.u(t)?this[n]:this.set(e,t)},d.year=function(t){return this.$g(t,"$y",o)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",r)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",i)},d.minute=function(t){return this.$g(t,"$m",e)},d.second=function(t){return this.$g(t,"$s",n)},d.millisecond=function(n){return this.$g(n,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,a){var h=this,f=!!D.u(a)||a,c=D.p(t),d=function(t,n){var e=D.w(h.$u?Date.UTC(h.$y,n,t):new Date(h.$y,n,t),h);return f?e:e.endOf(r)},$=function(t,n){return D.w(h.toDate()[t].apply(h.toDate(),(f?[0,0,0,0]:[23,59,59,999]).slice(n)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case o:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,S=(l<g?l+7:l)-g;return d(f?y-S:y+(6-S),m);case r:case"date":return $(M+"Hours",0);case i:return $(M+"Minutes",1);case e:return $(M+"Seconds",2);case n:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,a){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[r]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[o]=c+"FullYear",h[i]=c+"Hours",h[e]=c+"Minutes",h[n]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===r?this.$D+(a-this.$W):a;if(f===u||f===o){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate();}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,n){return this.clone().$set(t,n)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,a){var h,f=this;t=Number(t);var c=D.p(a),d=function(n){var e=new Date(f.$d);return e.setDate(e.getDate()+n*t),D.w(e,f)};if(c===u)return this.set(u,this.$M+t);if(c===o)return this.set(o,this.$y+t);if(c===r)return d(1);if(c===s)return d(7);var $=(h={},h[e]=6e4,h[i]=36e5,h[n]=1e3,h)[c]||1,l=this.valueOf()+t*$;return D.w(l,this)},d.subtract=function(t,n){return this.add(-1*t,n)},d.format=function(t){var n=this;if(!this.isValid())return "Invalid Date";var e=t||"YYYY-MM-DDTHH:mm:ssZ",i=D.z(this),r=this.$locale(),s=r.weekdays,u=r.months,a=function(t,n,e,i){return t&&t[n]||e[n].substr(0,i)},o=function(t){return D.s(n.$H%12||12,t,"0")},h={YY:String(this.$y).slice(-2),YYYY:String(this.$y),M:String(this.$M+1),MM:D.s(this.$M+1,2,"0"),MMM:a(r.monthsShort,this.$M,u,3),MMMM:u[this.$M],D:String(this.$D),DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:a(r.weekdaysMin,this.$W,s,2),ddd:a(r.weekdaysShort,this.$W,s,3),dddd:s[this.$W],H:String(this.$H),HH:D.s(this.$H,2,"0"),h:o(1),hh:o(2),a:this.$H<12?"am":"pm",A:this.$H<12?"AM":"PM",m:String(this.$m),mm:D.s(this.$m,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:i};return e.replace(f,function(t,n){return n||h[t]||i.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[o]=y/12,c[u]=y,c[a]=y/3,c[s]=(m-l)/6048e5,c[r]=(m-l)/864e5,c[i]=m/36e5,c[e]=m/6e4,c[n]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,n){if(!t)return this.$L;var e=this.clone();return e.$L=M(t,n,!0),e},d.clone=function(){return D.w(this.toDate(),this)},d.toDate=function(){return new Date(this.$d)},d.toJSON=function(){return this.toISOString()},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=S.prototype,g.extend=function(t,n){return t(n,S,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});
  });

  var relativeTime = createCommonjsModule(function (module, exports) {
  !function(e,r){module.exports=r();}(commonjsGlobal,function(){return function(e,r,t){var n=r.prototype;t.en.relativeTime={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};var o=function(e,r,n,o){for(var d,i,a=n.$locale().relativeTime,u=[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],f=u.length,s=0;s<f;s+=1){var l=u[s];l.d&&(d=o?t(e).diff(n,l.d,!0):n.diff(e,l.d,!0));var m=Math.ceil(Math.abs(d));if(m<=l.r||!l.r){i=a[l.l].replace("%d",m);break}}return r?i:(d>0?a.future:a.past).replace("%s",i)};n.to=function(e,r){return o(e,r,this,!0)},n.from=function(e,r){return o(e,r,this)},n.toNow=function(e){return this.to(t(),e)},n.fromNow=function(e){return this.from(t(),e)};}});
  });

  var zhCn = createCommonjsModule(function (module, exports) {
  !function(_,e){module.exports=e(dayjs_min);}(commonjsGlobal,function(_){_=_&&_.hasOwnProperty("default")?_.default:_;var e={name:"zh-cn",weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),ordinal:function(_,e){switch(e){case"W":return _+"周";default:return _+"日"}},weekStart:1,formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah点mm分",LLLL:"YYYY年M月D日ddddAh点mm分",l:"YYYY/M/D",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日dddd HH:mm"},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"}};return _.locale(e,null,!0),e});
  });

  dayjs_min.extend(relativeTime);

  var Gitting =
  /*#__PURE__*/
  function () {
    function Gitting(option) {
      classCallCheck(this, Gitting);

      this.option = Object.assign({}, Gitting.DEFAULTS, option);
      this.api = creatApi(this.option);
      this.page = 1;
      this.issue = {};
      this.comments = [];
      this.token = getStorage("gitting-token");
      this.userInfo = getStorage("gitting-userInfo");
      this.isLogin = !!this.token && !!this.userInfo;
      this.i = i18n$1(this.option.language);
      this.creatInit = this.creatInit.bind(this);
      this.logout = this.logout.bind(this);
      dayjs_min.locale(this.option.language);
    } // 默认配置


    createClass(Gitting, [{
      key: "render",
      // 挂载
      value: function () {
        var _render = asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee(el) {
          var loadend, _utils$getURLParamete, code, labels;

          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  this.option.initStart && this.option.initStart();
                  this.$container = el instanceof Element ? el : query(document, el);
                  this.$container.innerHTML = ''; // 初始化开始

                  loadend = loading(el); // 检查是否需要登录

                  _utils$getURLParamete = getURLParameters(), code = _utils$getURLParamete.code;

                  if (!code) {
                    _context.next = 8;
                    break;
                  }

                  _context.next = 8;
                  return this.getUserInfo(code);

                case 8:
                  if (!(Number(this.option.number) > 0)) {
                    _context.next = 15;
                    break;
                  }

                  _context.next = 11;
                  return this.api.getIssueById(this.option.number);

                case 11:
                  this.issue = _context.sent;
                  this.errorHandle(!this.issue || !this.issue.number, "Failed to get issue by id [".concat(this.option.number, "] , Do you want to initialize an new issue?"), this.creatInit);
                  _context.next = 20;
                  break;

                case 15:
                  labels = this.option.labels.concat(this.option.id).join(",");
                  _context.next = 18;
                  return this.api.getIssueByLabel(labels);

                case 18:
                  this.issue = _context.sent[0];
                  this.errorHandle(!this.issue || !this.issue.number, "Failed to get issue by labels [".concat(labels, "] , Do you want to initialize an new issue?"), this.creatInit);

                case 20:
                  // 初始化结束
                  loadend(); // 创建结构

                  _context.next = 23;
                  return this.creatGitting();

                case 23:
                  _context.next = 25;
                  return this.creatComment();

                case 25:
                  _context.next = 27;
                  return this.eventBind();

                case 27:
                  this.option.initEnd && this.option.initEnd();

                case 28:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function render(_x) {
          return _render.apply(this, arguments);
        }

        return render;
      }() // 获取并保存用户信息

    }, {
      key: "getUserInfo",
      value: function () {
        var _getUserInfo = asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee2(code) {
          var parameters, newUrl, data, userInfo;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  // 移除code参数
                  parameters = getURLParameters();
                  delete parameters.code;
                  newUrl = location.href.split("?")[0] + (Object.keys(parameters).length > 0 ? "?" + queryStringify(parameters) : "");
                  history.replaceState(null, "", newUrl); // 获取token

                  _context2.next = 6;
                  return this.api.getToken(code);

                case 6:
                  data = _context2.sent;
                  this.errorHandle(!data.access_token, "Can not get token, Please login again!", this.logout);
                  setStorage("gitting-token", data.access_token);
                  this.token = data.access_token; // 获取用户信息

                  _context2.next = 12;
                  return this.api.getUserInfo(data.access_token);

                case 12:
                  userInfo = _context2.sent;
                  this.errorHandle(!userInfo.id, "Can not get user info, Please login again!", this.logout);
                  setStorage("gitting-userInfo", userInfo);
                  this.userInfo = userInfo; // 修改登录状态

                  this.isLogin = true;
                  return _context2.abrupt("return", userInfo);

                case 18:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function getUserInfo(_x2) {
          return _getUserInfo.apply(this, arguments);
        }

        return getUserInfo;
      }() // 初始化评论

    }, {
      key: "creatInit",
      value: function creatInit() {
        var _this = this;

        var query$1 = {
          state: "Gitting",
          client_id: this.option.clientID,
          redirect_uri: location.href,
          scope: "public_repo"
        };
        this.$container.insertAdjacentHTML("beforeend", "\n        <div class=\"gt-init\">\n          ".concat(this.isLogin ? "<a class=\"gt-init-btn\" href=\"#\">".concat(this.i('init'), "</a>") : "<a class=\"gt-login\" href=\"http://github.com/login/oauth/authorize?client_id=".concat(queryStringify(query$1), "\">").concat(this.i('login'), "</a>"), "\n        </div>\n      "));
        if (!this.isLogin) return;
        this.$init = query(this.$container, '.gt-init-btn');
        this.$init.addEventListener('click',
        /*#__PURE__*/
        function () {
          var _ref = asyncToGenerator(
          /*#__PURE__*/
          regenerator.mark(function _callee3(e) {
            return regenerator.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    e.preventDefault();

                    _this.initIssue();

                  case 2:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          return function (_x3) {
            return _ref.apply(this, arguments);
          };
        }());
      } // 初始化接口

    }, {
      key: "initIssue",
      value: function () {
        var _initIssue = asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee4() {
          var option,
              loadend,
              detail,
              issue,
              _args4 = arguments;
          return regenerator.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  option = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
                  this.errorHandle(!this.userInfo.login, "You have not logged in yet");
                  this.errorHandle(!this.option.admin.includes(this.userInfo.login), "You have no permission to initialize this issue");
                  loadend = loading(this.$container);
                  detail = Object.assign({}, {
                    title: this.option.title,
                    body: this.option.body,
                    labels: this.option.labels.concat(this.option.id)
                  }, option);
                  _context4.next = 7;
                  return this.api.creatIssues(detail);

                case 7:
                  issue = _context4.sent;
                  this.errorHandle(!issue || !issue.number, "Initialize issue failed: ".concat(JSON.stringify(detail)), loadend);
                  location.reload();

                case 10:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function initIssue() {
          return _initIssue.apply(this, arguments);
        }

        return initIssue;
      }() // 创建结构

    }, {
      key: "creatGitting",
      value: function creatGitting() {
        var query$1 = {
          state: "Gitting",
          client_id: this.option.clientID,
          redirect_uri: location.href,
          scope: "public_repo"
        };
        this.$container.insertAdjacentHTML("beforeend", "\n      <div class=\"gt-header clearfix\">\n        <a href=\"".concat(this.issue.html_url, "\" class=\"fl\" target=\"_blank\">\n          ").concat(this.issue.comments, " ").concat(this.i("counts"), "\n        </a>\n        <div class=\"gt-mate fr clearfix\">\n          ").concat(this.isLogin ? "<a href=\"".concat(this.userInfo.html_url, "\" class=\"gt-name fl\" target=\"_blank\">").concat(this.userInfo.login, "</a><a href=\"#\" class=\"gt-logout fl\">").concat(this.i("logout"), "</a>") : "<a href=\"http://github.com/login/oauth/authorize?client_id=".concat(queryStringify(query$1), "\" class=\"gt-login fl\">").concat(this.i("login"), "</a>"), "\n          <a href=\"https://github.com/zhw2590582/gitting\" class=\"fl\" target=\"_blank\">Gitting 1.1.4</a>\n        </div>\n      </div>\n      <div class=\"gt-body\">\n        <div class=\"gt-avatar\">\n          <img src=\"").concat(this.isLogin ? this.userInfo.avatar_url : this.option.avatar, "\" alt=\"@").concat(this.isLogin ? this.userInfo.login : 'github', "\">\n        </div>\n        <div class=\"gt-editor\">\n            <div class=\"gt-markdown markdown-body\"></div>\n            <textarea placeholder=\"").concat(this.i("leave"), "\" class=\"gt-textarea\" maxlength=\"").concat(this.option.maxlength, "\"></textarea>\n            <div class=\"gt-tip clearfix\">\n                <a class=\"fl\" href=\"https://guides.github.com/features/mastering-markdown/\" target=\"_blank\">").concat(this.i("styling"), "</a>\n                <div class=\"fr\">\n                  <span class=\"gt-counts\">0</span> / ").concat(this.option.maxlength, "\n                </div>\n            </div>\n            <div class=\"gt-tool clearfix\">\n                <div class=\"gt-switch fl clearfix\">\n                    <span class=\"gt-write gt-btn fl active\">").concat(this.i("write"), "</span>\n                    <span class=\"gt-preview gt-btn fl\">").concat(this.i("preview"), "</span>\n                </div>\n                ").concat(this.isLogin ? "<button class=\"gt-send fr\">".concat(this.i("submit"), "</button>") : "<a class=\"gt-send fr\" href=\"http://github.com/login/oauth/authorize?client_id=".concat(queryStringify(query$1), "\">").concat(this.i("login"), "</a>"), "\n            </div>\n          </div>\n      </div>\n      <div class=\"gt-comments\"></div>\n      <div class=\"gt-comments-load\"></div>\n    "));
        this.$editor = query(this.$container, '.gt-editor');
        this.$markdown = query(this.$container, '.gt-markdown');
        this.$textarea = query(this.$container, '.gt-textarea');
        this.$counts = query(this.$container, '.gt-counts');
        this.$comments = query(this.$container, '.gt-comments');
        this.$commentsLoad = query(this.$container, '.gt-comments-load');
      } // 加载评论

    }, {
      key: "creatComment",
      value: function () {
        var _creatComment = asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee5() {
          var _this$comments,
              _this2 = this;

          var loadend, comments, commentHtml;
          return regenerator.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  this.$commentsLoad.innerHTML = '';
                  loadend = loading(this.$commentsLoad);
                  _context5.next = 4;
                  return this.api.getComments(this.issue.number, this.page++);

                case 4:
                  comments = _context5.sent;

                  (_this$comments = this.comments).push.apply(_this$comments, toConsumableArray(comments));

                  commentHtml = comments.map(function (item) {
                    return _this2.commentTemplate(item);
                  }).join('');
                  this.$comments.insertAdjacentHTML("beforeend", commentHtml);
                  loadend();

                  if (comments.length < this.option.perPage) {
                    this.$commentsLoad.innerHTML = "<div class=\"gt-load-end\">".concat(this.i("loadEnd"), "</div>");
                  } else {
                    this.$commentsLoad.innerHTML = "<a class=\"gt-load-more\" href=\"#\">".concat(this.i("loadMore"), "</a>");
                  }

                  return _context5.abrupt("return", comments);

                case 11:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function creatComment() {
          return _creatComment.apply(this, arguments);
        }

        return creatComment;
      }() // 评论模板

    }, {
      key: "commentTemplate",
      value: function commentTemplate(item) {
        var add = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return "\n      <div class=\"comments-item".concat(add ? ' add' : '', "\" data-id=\"").concat(item.id, "\">\n        <div class=\"gt-avatar\">\n          <img src=\"").concat(item.user.avatar_url, "\" alt=\"@").concat(item.user.login, "\">\n        </div>\n        <div class=\"gt-comment-content caret\">\n          <div class=\"gt-comment-body markdown-body\">\n            ").concat(item.body_html, "\n          </div>\n          <div class=\"gt-comment-mate clearfix\">\n            <a class=\"gt-comment-name fl\" href=\"").concat(item.user.html_url, "\" target=\"_blank\">").concat(item.user.login, "</a>\n            <span class=\"gt-comment-time fl\" data-time=\"").concat(item.created_at, "\">").concat(this.i("published"), " ").concat(dayjs_min(item.created_at).fromNow(), "</span>\n            <a class=\"gt-comment-reply fr\" href=\"#\" target=\"_blank\" data-id=\"").concat(item.id, "\">").concat(this.i("reply"), "</a>\n          </div>\n        </div>\n      </div>\n    ");
      } // 绑定事件

    }, {
      key: "eventBind",
      value: function eventBind() {
        var _this3 = this;

        // change事件
        var inputName = ["propertychange", "change", "click", "keyup", "input", "paste"];

        var inputFn = function inputFn(e) {
          return _this3.$counts.innerHTML = _this3.$textarea.value.length;
        };

        inputName.forEach(function (item) {
          return _this3.$textarea.addEventListener(item, inputFn);
        }); // 点击事件

        var clickFn =
        /*#__PURE__*/
        function () {
          var _ref2 = asyncToGenerator(
          /*#__PURE__*/
          regenerator.mark(function _callee6(e) {
            var target, text, loadend, html, body, _loadend, item, last, id, comment, oldValue, markdowm, newValue, comments, _last;

            return regenerator.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    target = e.target; // 注销

                    if (target.classList.contains('gt-logout')) {
                      e.preventDefault();

                      _this3.logout();
                    } // 编写


                    if (target.classList.contains('gt-write')) {
                      _this3.$editor.classList.remove('gt-mode-preview');

                      _this3.$markdown.innerHTML = '';
                    } // 预览


                    if (!target.classList.contains('gt-preview')) {
                      _context6.next = 16;
                      break;
                    }

                    _this3.$editor.classList.add('gt-mode-preview');

                    text = _this3.$textarea.value;

                    if (!text.trim()) {
                      _context6.next = 15;
                      break;
                    }

                    loadend = loading(_this3.$markdown);
                    _context6.next = 10;
                    return _this3.api.mdToHtml(text);

                  case 10:
                    html = _context6.sent;
                    loadend();
                    _this3.$markdown.innerHTML = html;
                    _context6.next = 16;
                    break;

                  case 15:
                    _this3.$markdown.innerHTML = _this3.i('noPreview');

                  case 16:
                    if (!target.classList.contains('gt-send')) {
                      _context6.next = 30;
                      break;
                    }

                    body = _this3.$textarea.value;

                    if (body.trim()) {
                      _context6.next = 20;
                      break;
                    }

                    return _context6.abrupt("return");

                  case 20:
                    _loadend = loading(_this3.$editor);
                    _context6.next = 23;
                    return _this3.api.creatComments(_this3.issue.number, body);

                  case 23:
                    item = _context6.sent;

                    _loadend();

                    _this3.errorHandle(!item || !item.id, "Comment failed!");

                    _this3.$textarea.value = '';

                    _this3.$comments.insertAdjacentHTML("beforeend", _this3.commentTemplate(item, true));

                    last = query(_this3.$container, "[data-id='".concat(item.id, "']"));
                    smoothScroll(last);

                  case 30:
                    if (!target.classList.contains('gt-comment-reply')) {
                      _context6.next = 43;
                      break;
                    }

                    e.preventDefault();
                    id = target.dataset.id;
                    comment = _this3.comments.find(function (item) {
                      return item.id == id;
                    });
                    oldValue = _this3.$textarea.value;
                    markdowm = "".concat(oldValue ? '\n' : '', "> @").concat(comment.user.login, "\n> ").concat(comment.body, "\n");
                    newValue = oldValue + markdowm;

                    if (!(newValue.length > _this3.option.maxlength)) {
                      _context6.next = 39;
                      break;
                    }

                    return _context6.abrupt("return");

                  case 39:
                    _this3.$textarea.value = newValue;
                    inputFn(e);

                    _this3.$textarea.focus();

                    smoothScroll(_this3.$textarea, -30);

                  case 43:
                    if (!target.classList.contains('gt-load-more')) {
                      _context6.next = 49;
                      break;
                    }

                    e.preventDefault();
                    _context6.next = 47;
                    return _this3.creatComment();

                  case 47:
                    comments = _context6.sent;

                    if (comments.length) {
                      _last = query(_this3.$container, "[data-id='".concat(comments[0].id, "']"));
                      smoothScroll(_last, -100);
                    }

                  case 49:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6);
          }));

          return function clickFn(_x4) {
            return _ref2.apply(this, arguments);
          };
        }();

        this.$container.addEventListener('click', clickFn); // 销毁事件

        this.destroy = function () {
          inputName.forEach(function (item) {
            return _this3.$textarea.removeEventListener(item, inputFn);
          });

          _this3.$container.removeEventListener('click', clickFn);
        };
      } // 登出

    }, {
      key: "logout",
      value: function logout() {
        delStorage("gitting-token");
        delStorage("gitting-userInfo");
        location.reload();
      } // 错误处理

    }, {
      key: "errorHandle",
      value: function errorHandle(condition, err, callback) {
        if (!condition) return;
        removeElement(query(this.$container, ".gt-error"));
        removeElement(query(this.$container, ".gt-loading"));
        this.$container.insertAdjacentHTML("afterbegin", "<div class=\"gt-error\">".concat(err, "</div>"));
        callback && callback();
        throw new TypeError(err);
      }
    }], [{
      key: "DEFAULTS",
      get: function get() {
        return {
          clientID: "",
          clientSecret: "",
          repo: "",
          owner: "",
          admin: [],
          id: location.pathname,
          number: -1,
          labels: ["Gitting"],
          title: document.title,
          body: "".concat(document.title, "\n").concat(location.href),
          language: "zh-cn",
          perPage: 10,
          maxlength: 500,
          avatar: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
          proxy: "https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token"
        };
      }
    }]);

    return Gitting;
  }();

  window.Gitting = Gitting;

  return Gitting;

}));
//# sourceMappingURL=gitting-uncompiled.js.map
