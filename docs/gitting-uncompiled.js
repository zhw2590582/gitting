(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Gitting = factory());
}(this, function () { 'use strict';

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

  var VNode = function VNode() {};

  var options = {};

  var stack = [];

  var EMPTY_CHILDREN = [];

  function h(nodeName, attributes) {
  	var children = EMPTY_CHILDREN,
  	    lastSimple,
  	    child,
  	    simple,
  	    i;
  	for (i = arguments.length; i-- > 2;) {
  		stack.push(arguments[i]);
  	}
  	if (attributes && attributes.children != null) {
  		if (!stack.length) stack.push(attributes.children);
  		delete attributes.children;
  	}
  	while (stack.length) {
  		if ((child = stack.pop()) && child.pop !== undefined) {
  			for (i = child.length; i--;) {
  				stack.push(child[i]);
  			}
  		} else {
  			if (typeof child === 'boolean') child = null;

  			if (simple = typeof nodeName !== 'function') {
  				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
  			}

  			if (simple && lastSimple) {
  				children[children.length - 1] += child;
  			} else if (children === EMPTY_CHILDREN) {
  				children = [child];
  			} else {
  				children.push(child);
  			}

  			lastSimple = simple;
  		}
  	}

  	var p = new VNode();
  	p.nodeName = nodeName;
  	p.children = children;
  	p.attributes = attributes == null ? undefined : attributes;
  	p.key = attributes == null ? undefined : attributes.key;

  	if (options.vnode !== undefined) options.vnode(p);

  	return p;
  }

  function extend(obj, props) {
    for (var i in props) {
      obj[i] = props[i];
    }return obj;
  }

  function applyRef(ref, value) {
    if (ref != null) {
      if (typeof ref == 'function') ref(value);else ref.current = value;
    }
  }

  var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

  function cloneElement(vnode, props) {
    return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
  }

  var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

  var items = [];

  function enqueueRender(component) {
  	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
  		(options.debounceRendering || defer)(rerender);
  	}
  }

  function rerender() {
  	var p;
  	while (p = items.pop()) {
  		if (p._dirty) renderComponent(p);
  	}
  }

  function isSameNodeType(node, vnode, hydrating) {
  	if (typeof vnode === 'string' || typeof vnode === 'number') {
  		return node.splitText !== undefined;
  	}
  	if (typeof vnode.nodeName === 'string') {
  		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
  	}
  	return hydrating || node._componentConstructor === vnode.nodeName;
  }

  function isNamedNode(node, nodeName) {
  	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
  }

  function getNodeProps(vnode) {
  	var props = extend({}, vnode.attributes);
  	props.children = vnode.children;

  	var defaultProps = vnode.nodeName.defaultProps;
  	if (defaultProps !== undefined) {
  		for (var i in defaultProps) {
  			if (props[i] === undefined) {
  				props[i] = defaultProps[i];
  			}
  		}
  	}

  	return props;
  }

  function createNode(nodeName, isSvg) {
  	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
  	node.normalizedNodeName = nodeName;
  	return node;
  }

  function removeNode(node) {
  	var parentNode = node.parentNode;
  	if (parentNode) parentNode.removeChild(node);
  }

  function setAccessor(node, name, old, value, isSvg) {
  	if (name === 'className') name = 'class';

  	if (name === 'key') ; else if (name === 'ref') {
  		applyRef(old, null);
  		applyRef(value, node);
  	} else if (name === 'class' && !isSvg) {
  		node.className = value || '';
  	} else if (name === 'style') {
  		if (!value || typeof value === 'string' || typeof old === 'string') {
  			node.style.cssText = value || '';
  		}
  		if (value && typeof value === 'object') {
  			if (typeof old !== 'string') {
  				for (var i in old) {
  					if (!(i in value)) node.style[i] = '';
  				}
  			}
  			for (var i in value) {
  				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
  			}
  		}
  	} else if (name === 'dangerouslySetInnerHTML') {
  		if (value) node.innerHTML = value.__html || '';
  	} else if (name[0] == 'o' && name[1] == 'n') {
  		var useCapture = name !== (name = name.replace(/Capture$/, ''));
  		name = name.toLowerCase().substring(2);
  		if (value) {
  			if (!old) node.addEventListener(name, eventProxy, useCapture);
  		} else {
  			node.removeEventListener(name, eventProxy, useCapture);
  		}
  		(node._listeners || (node._listeners = {}))[name] = value;
  	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
  		try {
  			node[name] = value == null ? '' : value;
  		} catch (e) {}
  		if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
  	} else {
  		var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

  		if (value == null || value === false) {
  			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
  		} else if (typeof value !== 'function') {
  			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
  		}
  	}
  }

  function eventProxy(e) {
  	return this._listeners[e.type](options.event && options.event(e) || e);
  }

  var mounts = [];

  var diffLevel = 0;

  var isSvgMode = false;

  var hydrating = false;

  function flushMounts() {
  	var c;
  	while (c = mounts.shift()) {
  		if (options.afterMount) options.afterMount(c);
  		if (c.componentDidMount) c.componentDidMount();
  	}
  }

  function diff(dom, vnode, context, mountAll, parent, componentRoot) {
  	if (!diffLevel++) {
  		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

  		hydrating = dom != null && !('__preactattr_' in dom);
  	}

  	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

  	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

  	if (! --diffLevel) {
  		hydrating = false;

  		if (!componentRoot) flushMounts();
  	}

  	return ret;
  }

  function idiff(dom, vnode, context, mountAll, componentRoot) {
  	var out = dom,
  	    prevSvgMode = isSvgMode;

  	if (vnode == null || typeof vnode === 'boolean') vnode = '';

  	if (typeof vnode === 'string' || typeof vnode === 'number') {
  		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
  			if (dom.nodeValue != vnode) {
  				dom.nodeValue = vnode;
  			}
  		} else {
  			out = document.createTextNode(vnode);
  			if (dom) {
  				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
  				recollectNodeTree(dom, true);
  			}
  		}

  		out['__preactattr_'] = true;

  		return out;
  	}

  	var vnodeName = vnode.nodeName;
  	if (typeof vnodeName === 'function') {
  		return buildComponentFromVNode(dom, vnode, context, mountAll);
  	}

  	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

  	vnodeName = String(vnodeName);
  	if (!dom || !isNamedNode(dom, vnodeName)) {
  		out = createNode(vnodeName, isSvgMode);

  		if (dom) {
  			while (dom.firstChild) {
  				out.appendChild(dom.firstChild);
  			}
  			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

  			recollectNodeTree(dom, true);
  		}
  	}

  	var fc = out.firstChild,
  	    props = out['__preactattr_'],
  	    vchildren = vnode.children;

  	if (props == null) {
  		props = out['__preactattr_'] = {};
  		for (var a = out.attributes, i = a.length; i--;) {
  			props[a[i].name] = a[i].value;
  		}
  	}

  	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
  		if (fc.nodeValue != vchildren[0]) {
  			fc.nodeValue = vchildren[0];
  		}
  	} else if (vchildren && vchildren.length || fc != null) {
  			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
  		}

  	diffAttributes(out, vnode.attributes, props);

  	isSvgMode = prevSvgMode;

  	return out;
  }

  function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
  	var originalChildren = dom.childNodes,
  	    children = [],
  	    keyed = {},
  	    keyedLen = 0,
  	    min = 0,
  	    len = originalChildren.length,
  	    childrenLen = 0,
  	    vlen = vchildren ? vchildren.length : 0,
  	    j,
  	    c,
  	    f,
  	    vchild,
  	    child;

  	if (len !== 0) {
  		for (var i = 0; i < len; i++) {
  			var _child = originalChildren[i],
  			    props = _child['__preactattr_'],
  			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
  			if (key != null) {
  				keyedLen++;
  				keyed[key] = _child;
  			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
  				children[childrenLen++] = _child;
  			}
  		}
  	}

  	if (vlen !== 0) {
  		for (var i = 0; i < vlen; i++) {
  			vchild = vchildren[i];
  			child = null;

  			var key = vchild.key;
  			if (key != null) {
  				if (keyedLen && keyed[key] !== undefined) {
  					child = keyed[key];
  					keyed[key] = undefined;
  					keyedLen--;
  				}
  			} else if (min < childrenLen) {
  					for (j = min; j < childrenLen; j++) {
  						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
  							child = c;
  							children[j] = undefined;
  							if (j === childrenLen - 1) childrenLen--;
  							if (j === min) min++;
  							break;
  						}
  					}
  				}

  			child = idiff(child, vchild, context, mountAll);

  			f = originalChildren[i];
  			if (child && child !== dom && child !== f) {
  				if (f == null) {
  					dom.appendChild(child);
  				} else if (child === f.nextSibling) {
  					removeNode(f);
  				} else {
  					dom.insertBefore(child, f);
  				}
  			}
  		}
  	}

  	if (keyedLen) {
  		for (var i in keyed) {
  			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
  		}
  	}

  	while (min <= childrenLen) {
  		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
  	}
  }

  function recollectNodeTree(node, unmountOnly) {
  	var component = node._component;
  	if (component) {
  		unmountComponent(component);
  	} else {
  		if (node['__preactattr_'] != null) applyRef(node['__preactattr_'].ref, null);

  		if (unmountOnly === false || node['__preactattr_'] == null) {
  			removeNode(node);
  		}

  		removeChildren(node);
  	}
  }

  function removeChildren(node) {
  	node = node.lastChild;
  	while (node) {
  		var next = node.previousSibling;
  		recollectNodeTree(node, true);
  		node = next;
  	}
  }

  function diffAttributes(dom, attrs, old) {
  	var name;

  	for (name in old) {
  		if (!(attrs && attrs[name] != null) && old[name] != null) {
  			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
  		}
  	}

  	for (name in attrs) {
  		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
  			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
  		}
  	}
  }

  var recyclerComponents = [];

  function createComponent(Ctor, props, context) {
  	var inst,
  	    i = recyclerComponents.length;

  	if (Ctor.prototype && Ctor.prototype.render) {
  		inst = new Ctor(props, context);
  		Component.call(inst, props, context);
  	} else {
  		inst = new Component(props, context);
  		inst.constructor = Ctor;
  		inst.render = doRender;
  	}

  	while (i--) {
  		if (recyclerComponents[i].constructor === Ctor) {
  			inst.nextBase = recyclerComponents[i].nextBase;
  			recyclerComponents.splice(i, 1);
  			return inst;
  		}
  	}

  	return inst;
  }

  function doRender(props, state, context) {
  	return this.constructor(props, context);
  }

  function setComponentProps(component, props, renderMode, context, mountAll) {
  	if (component._disable) return;
  	component._disable = true;

  	component.__ref = props.ref;
  	component.__key = props.key;
  	delete props.ref;
  	delete props.key;

  	if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
  		if (!component.base || mountAll) {
  			if (component.componentWillMount) component.componentWillMount();
  		} else if (component.componentWillReceiveProps) {
  			component.componentWillReceiveProps(props, context);
  		}
  	}

  	if (context && context !== component.context) {
  		if (!component.prevContext) component.prevContext = component.context;
  		component.context = context;
  	}

  	if (!component.prevProps) component.prevProps = component.props;
  	component.props = props;

  	component._disable = false;

  	if (renderMode !== 0) {
  		if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
  			renderComponent(component, 1, mountAll);
  		} else {
  			enqueueRender(component);
  		}
  	}

  	applyRef(component.__ref, component);
  }

  function renderComponent(component, renderMode, mountAll, isChild) {
  	if (component._disable) return;

  	var props = component.props,
  	    state = component.state,
  	    context = component.context,
  	    previousProps = component.prevProps || props,
  	    previousState = component.prevState || state,
  	    previousContext = component.prevContext || context,
  	    isUpdate = component.base,
  	    nextBase = component.nextBase,
  	    initialBase = isUpdate || nextBase,
  	    initialChildComponent = component._component,
  	    skip = false,
  	    snapshot = previousContext,
  	    rendered,
  	    inst,
  	    cbase;

  	if (component.constructor.getDerivedStateFromProps) {
  		state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
  		component.state = state;
  	}

  	if (isUpdate) {
  		component.props = previousProps;
  		component.state = previousState;
  		component.context = previousContext;
  		if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
  			skip = true;
  		} else if (component.componentWillUpdate) {
  			component.componentWillUpdate(props, state, context);
  		}
  		component.props = props;
  		component.state = state;
  		component.context = context;
  	}

  	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
  	component._dirty = false;

  	if (!skip) {
  		rendered = component.render(props, state, context);

  		if (component.getChildContext) {
  			context = extend(extend({}, context), component.getChildContext());
  		}

  		if (isUpdate && component.getSnapshotBeforeUpdate) {
  			snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
  		}

  		var childComponent = rendered && rendered.nodeName,
  		    toUnmount,
  		    base;

  		if (typeof childComponent === 'function') {

  			var childProps = getNodeProps(rendered);
  			inst = initialChildComponent;

  			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
  				setComponentProps(inst, childProps, 1, context, false);
  			} else {
  				toUnmount = inst;

  				component._component = inst = createComponent(childComponent, childProps, context);
  				inst.nextBase = inst.nextBase || nextBase;
  				inst._parentComponent = component;
  				setComponentProps(inst, childProps, 0, context, false);
  				renderComponent(inst, 1, mountAll, true);
  			}

  			base = inst.base;
  		} else {
  			cbase = initialBase;

  			toUnmount = initialChildComponent;
  			if (toUnmount) {
  				cbase = component._component = null;
  			}

  			if (initialBase || renderMode === 1) {
  				if (cbase) cbase._component = null;
  				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
  			}
  		}

  		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
  			var baseParent = initialBase.parentNode;
  			if (baseParent && base !== baseParent) {
  				baseParent.replaceChild(base, initialBase);

  				if (!toUnmount) {
  					initialBase._component = null;
  					recollectNodeTree(initialBase, false);
  				}
  			}
  		}

  		if (toUnmount) {
  			unmountComponent(toUnmount);
  		}

  		component.base = base;
  		if (base && !isChild) {
  			var componentRef = component,
  			    t = component;
  			while (t = t._parentComponent) {
  				(componentRef = t).base = base;
  			}
  			base._component = componentRef;
  			base._componentConstructor = componentRef.constructor;
  		}
  	}

  	if (!isUpdate || mountAll) {
  		mounts.push(component);
  	} else if (!skip) {

  		if (component.componentDidUpdate) {
  			component.componentDidUpdate(previousProps, previousState, snapshot);
  		}
  		if (options.afterUpdate) options.afterUpdate(component);
  	}

  	while (component._renderCallbacks.length) {
  		component._renderCallbacks.pop().call(component);
  	}if (!diffLevel && !isChild) flushMounts();
  }

  function buildComponentFromVNode(dom, vnode, context, mountAll) {
  	var c = dom && dom._component,
  	    originalComponent = c,
  	    oldDom = dom,
  	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
  	    isOwner = isDirectOwner,
  	    props = getNodeProps(vnode);
  	while (c && !isOwner && (c = c._parentComponent)) {
  		isOwner = c.constructor === vnode.nodeName;
  	}

  	if (c && isOwner && (!mountAll || c._component)) {
  		setComponentProps(c, props, 3, context, mountAll);
  		dom = c.base;
  	} else {
  		if (originalComponent && !isDirectOwner) {
  			unmountComponent(originalComponent);
  			dom = oldDom = null;
  		}

  		c = createComponent(vnode.nodeName, props, context);
  		if (dom && !c.nextBase) {
  			c.nextBase = dom;

  			oldDom = null;
  		}
  		setComponentProps(c, props, 1, context, mountAll);
  		dom = c.base;

  		if (oldDom && dom !== oldDom) {
  			oldDom._component = null;
  			recollectNodeTree(oldDom, false);
  		}
  	}

  	return dom;
  }

  function unmountComponent(component) {
  	if (options.beforeUnmount) options.beforeUnmount(component);

  	var base = component.base;

  	component._disable = true;

  	if (component.componentWillUnmount) component.componentWillUnmount();

  	component.base = null;

  	var inner = component._component;
  	if (inner) {
  		unmountComponent(inner);
  	} else if (base) {
  		if (base['__preactattr_'] != null) applyRef(base['__preactattr_'].ref, null);

  		component.nextBase = base;

  		removeNode(base);
  		recyclerComponents.push(component);

  		removeChildren(base);
  	}

  	applyRef(component.__ref, null);
  }

  function Component(props, context) {
  	this._dirty = true;

  	this.context = context;

  	this.props = props;

  	this.state = this.state || {};

  	this._renderCallbacks = [];
  }

  extend(Component.prototype, {
  	setState: function setState(state, callback) {
  		if (!this.prevState) this.prevState = this.state;
  		this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
  		if (callback) this._renderCallbacks.push(callback);
  		enqueueRender(this);
  	},
  	forceUpdate: function forceUpdate(callback) {
  		if (callback) this._renderCallbacks.push(callback);
  		renderComponent(this, 2);
  	},
  	render: function render() {}
  });

  function render(vnode, parent, merge) {
    return diff(merge, vnode, {}, false, parent, false);
  }

  function createRef() {
  	return {};
  }

  var preact = {
  	h: h,
  	createElement: h,
  	cloneElement: cloneElement,
  	createRef: createRef,
  	Component: Component,
  	render: render,
  	rerender: rerender,
  	options: options
  };
  //# sourceMappingURL=preact.mjs.map

  var preact$1 = /*#__PURE__*/Object.freeze({
    default: preact,
    h: h,
    createElement: h,
    cloneElement: cloneElement,
    createRef: createRef,
    Component: Component,
    render: render,
    rerender: rerender,
    options: options
  });

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var assertThisInitialized = _assertThisInitialized;

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
      return call;
    }

    return assertThisInitialized(self);
  }

  var possibleConstructorReturn = _possibleConstructorReturn;

  var getPrototypeOf = createCommonjsModule(function (module) {
  function _getPrototypeOf(o) {
    module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  module.exports = _getPrototypeOf;
  });

  var setPrototypeOf = createCommonjsModule(function (module) {
  function _setPrototypeOf(o, p) {
    module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  module.exports = _setPrototypeOf;
  });

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) setPrototypeOf(subClass, superClass);
  }

  var inherits = _inherits;

  var require$$0 = getCjsExportFromNamespace(preact$1);

  var preact$2 = createCommonjsModule(function (module, exports) {
  var t=require$$0;function n(t,n){for(var r in n)t[r]=n[r];return t}function r(t){this.getChildContext=function(){return {store:t.store}};}r.prototype.render=function(t){return t.children&&t.children[0]||t.children},exports.connect=function(r,e){var o;return "function"!=typeof r&&("string"==typeof(o=r||{})&&(o=o.split(/\s*,\s*/)),r=function(t){for(var n={},r=0;r<o.length;r++)n[o[r]]=t[o[r]];return n}),function(o){function i(i,u){var c=this,f=u.store,s=r(f?f.getState():{},i),a=e?function(t,n){"function"==typeof t&&(t=t(n));var r={};for(var e in t)r[e]=n.action(t[e]);return r}(e,f):{store:f},p=function(){var t=r(f?f.getState():{},i);for(var n in t)if(t[n]!==s[n])return s=t,c.setState({});for(var e in s)if(!(e in t))return s=t,c.setState({})};this.componentWillReceiveProps=function(t){i=t,p();},this.componentDidMount=function(){f.subscribe(p);},this.componentWillUnmount=function(){f.unsubscribe(p);},this.render=function(r){return t.h(o,n(n(n({},a),r),s))};}return (i.prototype=new t.Component).constructor=i}},exports.Provider=r;
  //# sourceMappingURL=preact.js.map
  });
  var preact_1 = preact$2.connect;
  var preact_2 = preact$2.Provider;

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

  function n(n,t){for(var r in t)n[r]=t[r];return n}function createStore(t){var r=[];function u(n){for(var t=[],u=0;u<r.length;u++)r[u]===n?n=null:t.push(r[u]);r=t;}function e(u,e,f){t=e?u:n(n({},t),u);for(var i=r,o=0;o<i.length;o++)i[o](t,f);}return t=t||{},{action:function(n){function r(t){e(t,!1,n);}return function(){for(var u=arguments,e=[t],f=0;f<arguments.length;f++)e.push(u[f]);var i=n.apply(this,e);if(null!=i)return i.then?i.then(r):r(i)}},setState:e,subscribe:function(n){return r.push(n),function(){u(n);}},unsubscribe:u,getState:function(){return t}}}
  //# sourceMappingURL=unistore.es.js.map

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  var storageName = "gitting_settings";
  function getStorage(key) {
    var storage = JSON.parse(window.localStorage.getItem(storageName)) || {};
    return key ? storage[key] : storage;
  }
  function setStorage(key, value) {
    var storage = Object.assign({}, getStorage(), defineProperty({}, key, value));
    return window.localStorage.setItem(storageName, JSON.stringify(storage));
  }
  function cleanStorage() {
    return window.localStorage.removeItem(storageName);
  }
  function queryStringify(query) {
    var queryString = Object.keys(query).map(function (key) {
      return "".concat(key, "=").concat(window.encodeURIComponent(query[key] || ""));
    }).join("&");
    return queryString;
  }
  function getURLParameters() {
    var url = window.location.href;
    return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(function (a, v) {
      return a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1), a;
    }, {});
  }
  function smoothScroll(element) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    window.scroll({
      behavior: "smooth",
      left: 0,
      top: element.getBoundingClientRect().top + window.scrollY + offset
    });
    return element;
  }

  var state = {
    isLogin: function isLogin() {
      return !!getStorage('token') && !!getStorage('userInfo');
    },
    userInfo: {},
    issue: {},
    comments: [],
    error: '',
    input: ''
  };
  var store = createStore(state);
  var actions = function actions(store) {
    return {
      throwError: function throwError(state, condition, msg) {
        return {
          error: !condition ? '' : msg
        };
      },
      setUserInfo: function setUserInfo(state, info) {
        return {
          userInfo: info
        };
      },
      setIssue: function setIssue(state, issue) {
        return {
          issue: issue
        };
      },
      setComments: function setComments(state) {
        var comments = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var retult = toConsumableArray(state.comments);

        comments.forEach(function (comment) {
          if (!retult.find(function (item) {
            return item.id === comment.id;
          })) {
            retult.push(comment);
          }
        });
        return {
          comments: retult
        };
      },
      setInput: function setInput(state, input) {
        return {
          input: input
        };
      },
      logout: function logout(state, e) {
        e && e.preventDefault();
        cleanStorage();
        window.location.reload();
      },
      login: function login(state, options, e) {
        e && e.preventDefault();
        setStorage('redirect_uri', window.location.href);
        window.location.href = "http://github.com/login/oauth/authorize?".concat(queryStringify({
          state: 'Gitting',
          client_id: options.clientID,
          redirect_uri: window.location.href,
          scope: 'public_repo'
        }));
      }
    };
  };

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

  function Enhanced(WrappedComponent) {
    return preact_1(Object.keys(state).join(','), actions)(
    /*#__PURE__*/
    function (_Component) {
      inherits(_class, _Component);

      function _class() {
        classCallCheck(this, _class);

        return possibleConstructorReturn(this, getPrototypeOf(_class).apply(this, arguments));
      }

      createClass(_class, [{
        key: "render",
        value: function render(props) {
          return h(WrappedComponent, props);
        }
      }]);

      return _class;
    }(Component));
  }

  var ErrorInfo =
  /*#__PURE__*/
  function (_Component) {
    inherits(ErrorInfo, _Component);

    function ErrorInfo() {
      classCallCheck(this, ErrorInfo);

      return possibleConstructorReturn(this, getPrototypeOf(ErrorInfo).apply(this, arguments));
    }

    createClass(ErrorInfo, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (this.props.error) {
          throw new Error(this.props.error);
        }
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        if (this.props.error) {
          throw new Error(this.props.error);
        }
      }
    }, {
      key: "render",
      value: function render(props) {
        var error = props.error;

        if (!error) {
          return null;
        }

        return h("div", {
          "class": "gitting-error"
        }, error);
      }
    }]);

    return ErrorInfo;
  }(Component);

  var ErrorInfo$1 = Enhanced(ErrorInfo);

  var Header =
  /*#__PURE__*/
  function (_Component) {
    inherits(Header, _Component);

    function Header() {
      classCallCheck(this, Header);

      return possibleConstructorReturn(this, getPrototypeOf(Header).apply(this, arguments));
    }

    createClass(Header, [{
      key: "render",
      value: function render(props) {
        var issue = props.issue,
            options = props.options,
            config = props.config,
            userInfo = props.userInfo,
            isLogin = props.isLogin,
            logout = props.logout,
            login = props.login;
        return issue ? h("header", {
          "class": "gitting-header"
        }, h("a", {
          href: "https://github.com/".concat(options.owner, "/").concat(options.repo, "/issues/").concat(issue.number),
          target: "_blank",
          "class": "gitting-number"
        }, issue.comments || 0, " ", config.i18n('counts')), h("div", {
          "class": "gitting-mate"
        }, isLogin() ? h("span", null, h("a", {
          href: "#"
        }, userInfo.login), h("a", {
          href: "#",
          onClick: function onClick(e) {
            return logout(e);
          }
        }, config.i18n('logout'))) : h("a", {
          href: "#",
          onClick: function onClick(e) {
            return login(options, e);
          }
        }, config.i18n('login')), h("a", {
          href: "https://github.com/zhw2590582/gitting",
          target: "_blank"
        }, "Gitting 2.0.5"))) : null;
      }
    }]);

    return Header;
  }(Component);

  var Header$1 = Enhanced(Header);

  var Loading =
  /*#__PURE__*/
  function (_Component) {
    inherits(Loading, _Component);

    function Loading() {
      classCallCheck(this, Loading);

      return possibleConstructorReturn(this, getPrototypeOf(Loading).apply(this, arguments));
    }

    createClass(Loading, [{
      key: "render",
      value: function render(_ref) {
        var loading = _ref.loading;
        return loading ? h("div", {
          "class": "gitting-loading"
        }, h("div", {
          "class": "lds-ellipsis"
        }, h("div", null), h("div", null), h("div", null), h("div", null))) : null;
      }
    }]);

    return Loading;
  }(Component);

  var Loading$1 = Enhanced(Loading);

  var Editor =
  /*#__PURE__*/
  function (_Component) {
    inherits(Editor, _Component);

    function Editor(props) {
      var _this;

      classCallCheck(this, Editor);

      _this = possibleConstructorReturn(this, getPrototypeOf(Editor).call(this, props));
      _this.state = {
        loading: false,
        preview: false,
        markdown: ''
      };
      return _this;
    }

    createClass(Editor, [{
      key: "onWrite",
      value: function onWrite(e) {
        this.setState(function () {
          return {
            preview: false
          };
        });
      }
    }, {
      key: "onPreview",
      value: function () {
        var _onPreview = asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee(e) {
          var _this$props, config, input, value, markdown;

          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _this$props = this.props, config = _this$props.config, input = _this$props.input;
                  value = input.trim();
                  this.setState(function () {
                    return {
                      preview: true,
                      markdown: ''
                    };
                  });
                  markdown = '';

                  if (!value) {
                    _context.next = 12;
                    break;
                  }

                  this.setState(function () {
                    return {
                      loading: true
                    };
                  });
                  _context.next = 8;
                  return config.api.mdToHtml(value);

                case 8:
                  markdown = _context.sent;
                  this.setState(function () {
                    return {
                      loading: false
                    };
                  });
                  _context.next = 13;
                  break;

                case 12:
                  markdown = config.i18n('noPreview');

                case 13:
                  this.setState(function () {
                    return {
                      markdown: markdown
                    };
                  });

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function onPreview(_x) {
          return _onPreview.apply(this, arguments);
        }

        return onPreview;
      }()
    }, {
      key: "onSubmit",
      value: function () {
        var _onSubmit = asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee2(e) {
          var _this$props2, options, input, config, issue, throwError, setInput, value, item;

          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _this$props2 = this.props, options = _this$props2.options, input = _this$props2.input, config = _this$props2.config, issue = _this$props2.issue, throwError = _this$props2.throwError, setInput = _this$props2.setInput;
                  value = input.trim();

                  if (value) {
                    _context2.next = 4;
                    break;
                  }

                  return _context2.abrupt("return");

                case 4:
                  throwError(value.length > options.maxlength, "Word count exceeds limit: ".concat(value.length, " / ").concat(options.maxlength));
                  this.setState(function () {
                    return {
                      loading: true
                    };
                  });
                  _context2.next = 8;
                  return config.api.creatComments(issue.number, value);

                case 8:
                  item = _context2.sent;
                  throwError(!item || !item.id, "Comment failed!");
                  this.setState(function () {
                    return {
                      loading: false,
                      markdown: ''
                    };
                  });

                  if (item.id) {
                    setInput('');
                    setTimeout(function () {
                      smoothScroll(config.$container.querySelector('.gitting-load')).click();
                    }, 100);
                  }

                case 12:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function onSubmit(_x2) {
          return _onSubmit.apply(this, arguments);
        }

        return onSubmit;
      }()
    }, {
      key: "render",
      value: function render(props, state) {
        var _this2 = this;

        var options = props.options,
            input = props.input,
            setInput = props.setInput,
            config = props.config,
            userInfo = props.userInfo,
            login = props.login,
            isLogin = props.isLogin;
        var preview = state.preview,
            markdown = state.markdown,
            loading = state.loading;
        return h("div", {
          "class": "gitting-body"
        }, h("div", {
          "class": "gitting-avatar"
        }, h("img", {
          src: isLogin() ? userInfo.avatar_url : options.avatar,
          alt: "@".concat(isLogin() ? userInfo.login : 'github')
        })), h("div", {
          "class": "gitting-editor"
        }, h("div", {
          style: {
            display: preview ? '' : 'none'
          },
          "class": "gitting-markdown markdown-body",
          dangerouslySetInnerHTML: {
            __html: markdown
          }
        }), h("textarea", {
          style: {
            display: preview ? 'none' : ''
          },
          "class": "gitting-textarea",
          placeholder: config.i18n('leave'),
          maxlength: options.maxlength,
          spellcheck: false,
          value: input,
          onInput: function onInput(e) {
            return setInput(e.target.value);
          }
        }), h("div", {
          "class": "gitting-tip",
          style: {
            display: preview ? 'none' : ''
          }
        }, h("a", {
          href: "https://guides.github.com/features/mastering-markdown/",
          target: "_blank"
        }, config.i18n('styling')), h("span", {
          "class": "gitting-counts"
        }, options.maxlength - input.length, " / ", options.maxlength)), h("div", {
          "class": "gitting-tool"
        }, h("div", {
          "class": "gitting-switch"
        }, h("span", {
          "class": preview ? '' : 'active',
          onClick: function onClick(e) {
            return _this2.onWrite(e);
          }
        }, config.i18n('write')), h("span", {
          "class": preview ? 'active' : '',
          onClick: function onClick(e) {
            return _this2.onPreview(e);
          }
        }, config.i18n('preview'))), isLogin() ? h("button", {
          "class": "gitting-send",
          onClick: function onClick(e) {
            return _this2.onSubmit(e);
          }
        }, config.i18n('submit')) : h("a", {
          "class": "gitting-send",
          href: "#",
          onClick: function onClick(e) {
            return login(options, e);
          }
        }, config.i18n('login')))), h(Loading$1, {
          loading: loading
        }));
      }
    }]);

    return Editor;
  }(Component);

  var Editor$1 = Enhanced(Editor);

  var dayjs_min = createCommonjsModule(function (module, exports) {
  !function(t,n){module.exports=n();}(commonjsGlobal,function(){var t="millisecond",n="second",e="minute",i="hour",r="day",s="week",u="month",a="quarter",o="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,n,e){var i=String(t);return !i||i.length>=n?t:""+Array(n+1-i.length).join(e)+t},d={s:c,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),i=Math.floor(e/60),r=e%60;return (n<=0?"+":"-")+c(i,2,"0")+":"+c(r,2,"0")},m:function(t,n){var e=12*(n.year()-t.year())+(n.month()-t.month()),i=t.clone().add(e,u),r=n-i<0,s=t.clone().add(e+(r?-1:1),u);return Number(-(e+(n-i)/(r?i-s:s-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:o,w:s,d:r,h:i,m:e,s:n,ms:t,Q:a}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof S},M=function(t,n,e){var i;if(!t)return null;if("string"==typeof t)m[t]&&(i=t),n&&(m[t]=n,i=t);else{var r=t.name;m[r]=t,i=r;}return e||(l=i),i},g=function(t,n,e){if(y(t))return t.clone();var i=n?"string"==typeof n?{format:n,pl:e}:n:{};return i.date=t,new S(i)},D=d;D.l=M,D.i=y,D.w=function(t,n){return g(t,{locale:n.$L,utc:n.$u})};var S=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0)||l,this.parse(t);}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(D.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var i=n.match(h);if(i)return e?new Date(Date.UTC(i[1],i[2]-1,i[3]||1,i[4]||0,i[5]||0,i[6]||0,i[7]||0)):new Date(i[1],i[2]-1,i[3]||1,i[4]||0,i[5]||0,i[6]||0,i[7]||0)}return new Date(n)}(t),this.init();},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},d.$utils=function(){return D},d.isValid=function(){return !("Invalid Date"===this.$d.toString())},d.isSame=function(t,n){var e=g(t);return this.startOf(n)<=e&&e<=this.endOf(n)},d.isAfter=function(t,n){return g(t)<this.startOf(n)},d.isBefore=function(t,n){return this.endOf(n)<g(t)},d.$g=function(t,n,e){return D.u(t)?this[n]:this.set(e,t)},d.year=function(t){return this.$g(t,"$y",o)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",r)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",i)},d.minute=function(t){return this.$g(t,"$m",e)},d.second=function(t){return this.$g(t,"$s",n)},d.millisecond=function(n){return this.$g(n,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,a){var h=this,f=!!D.u(a)||a,c=D.p(t),d=function(t,n){var e=D.w(h.$u?Date.UTC(h.$y,n,t):new Date(h.$y,n,t),h);return f?e:e.endOf(r)},$=function(t,n){return D.w(h.toDate()[t].apply(h.toDate(),(f?[0,0,0,0]:[23,59,59,999]).slice(n)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case o:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,S=(l<g?l+7:l)-g;return d(f?y-S:y+(6-S),m);case r:case"date":return $(M+"Hours",0);case i:return $(M+"Minutes",1);case e:return $(M+"Seconds",2);case n:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,a){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[r]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[o]=c+"FullYear",h[i]=c+"Hours",h[e]=c+"Minutes",h[n]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===r?this.$D+(a-this.$W):a;if(f===u||f===o){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate();}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,n){return this.clone().$set(t,n)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,a){var h,f=this;t=Number(t);var c=D.p(a),d=function(n){var e=new Date(f.$d);return e.setDate(e.getDate()+n*t),D.w(e,f)};if(c===u)return this.set(u,this.$M+t);if(c===o)return this.set(o,this.$y+t);if(c===r)return d(1);if(c===s)return d(7);var $=(h={},h[e]=6e4,h[i]=36e5,h[n]=1e3,h)[c]||1,l=this.valueOf()+t*$;return D.w(l,this)},d.subtract=function(t,n){return this.add(-1*t,n)},d.format=function(t){var n=this;if(!this.isValid())return "Invalid Date";var e=t||"YYYY-MM-DDTHH:mm:ssZ",i=D.z(this),r=this.$locale(),s=r.weekdays,u=r.months,a=function(t,n,e,i){return t&&t[n]||e[n].substr(0,i)},o=function(t){return D.s(n.$H%12||12,t,"0")},h={YY:String(this.$y).slice(-2),YYYY:String(this.$y),M:String(this.$M+1),MM:D.s(this.$M+1,2,"0"),MMM:a(r.monthsShort,this.$M,u,3),MMMM:u[this.$M],D:String(this.$D),DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:a(r.weekdaysMin,this.$W,s,2),ddd:a(r.weekdaysShort,this.$W,s,3),dddd:s[this.$W],H:String(this.$H),HH:D.s(this.$H,2,"0"),h:o(1),hh:o(2),a:this.$H<12?"am":"pm",A:this.$H<12?"AM":"PM",m:String(this.$m),mm:D.s(this.$m,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:i};return e.replace(f,function(t,n){return n||h[t]||i.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[o]=y/12,c[u]=y,c[a]=y/3,c[s]=(m-l)/6048e5,c[r]=(m-l)/864e5,c[i]=m/36e5,c[e]=m/6e4,c[n]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,n){if(!t)return this.$L;var e=this.clone();return e.$L=M(t,n,!0),e},d.clone=function(){return D.w(this.toDate(),this)},d.toDate=function(){return new Date(this.$d)},d.toJSON=function(){return this.toISOString()},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=S.prototype,g.extend=function(t,n){return t(n,S,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});
  });

  var relativeTime = createCommonjsModule(function (module, exports) {
  !function(e,r){module.exports=r();}(commonjsGlobal,function(){return function(e,r,t){var n=r.prototype;t.en.relativeTime={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};var o=function(e,r,n,o){for(var d,i,a=n.$locale().relativeTime,u=[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],f=u.length,s=0;s<f;s+=1){var l=u[s];l.d&&(d=o?t(e).diff(n,l.d,!0):n.diff(e,l.d,!0));var m=Math.ceil(Math.abs(d));if(m<=l.r||!l.r){i=a[l.l].replace("%d",m);break}}return r?i:(d>0?a.future:a.past).replace("%s",i)};n.to=function(e,r){return o(e,r,this,!0)},n.from=function(e,r){return o(e,r,this)},n.toNow=function(e){return this.to(t(),e)},n.fromNow=function(e){return this.from(t(),e)};}});
  });

  var zhCn = createCommonjsModule(function (module, exports) {
  !function(_,e){module.exports=e(dayjs_min);}(commonjsGlobal,function(_){_=_&&_.hasOwnProperty("default")?_.default:_;var e={name:"zh-cn",weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),ordinal:function(_,e){switch(e){case"W":return _+"周";default:return _+"日"}},weekStart:1,formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah点mm分",LLLL:"YYYY年M月D日ddddAh点mm分",l:"YYYY/M/D",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日dddd HH:mm"},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"}};return _.locale(e,null,!0),e});
  });

  var en = createCommonjsModule(function (module, exports) {
  !function(e,n){module.exports=n();}(commonjsGlobal,function(){return {name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")}});
  });

  dayjs_min.extend(relativeTime);
  var CommentItem = Enhanced(function (_ref) {
    var options = _ref.options,
        config = _ref.config,
        item = _ref.item,
        reply = _ref.reply;
    return h("div", {
      className: "gitting-comment-item",
      key: item.id,
      "data-id": item.id
    }, h("div", {
      className: "gitting-avatar"
    }, h("a", {
      href: item.user.html_url,
      target: "_blank"
    }, h("img", {
      src: item.user.avatar_url,
      alt: "@".concat(item.user.login)
    }))), h("div", {
      className: "gitting-content gitting-caret"
    }, h("div", {
      className: "gitting-content-body markdown-body",
      dangerouslySetInnerHTML: {
        __html: item.body_html
      }
    }), h("div", {
      className: "gitting-content-mate"
    }, h("span", null, h("a", {
      className: "gitting-content-name",
      href: item.user.html_url,
      target: "_blank"
    }, item.user.login), h("span", {
      className: "gitting-content-time",
      "data-time": item.created_at
    }, config.i18n('published'), " ", dayjs_min(item.created_at).fromNow())), h("a", {
      className: "gitting-content-reply",
      href: "#",
      onClick: function onClick(e) {
        return reply(item, e);
      }
    }, config.i18n('reply')))));
  });

  var Comments =
  /*#__PURE__*/
  function (_Component) {
    inherits(Comments, _Component);

    function Comments(props) {
      var _this;

      classCallCheck(this, Comments);

      _this = possibleConstructorReturn(this, getPrototypeOf(Comments).call(this, props));
      dayjs_min.locale(props.options.language);
      _this.state = {
        loading: false,
        loadMore: false,
        page: 1
      };
      _this.reply = _this.reply.bind(assertThisInitialized(_this));
      return _this;
    }

    createClass(Comments, [{
      key: "componentDidMount",
      value: function () {
        var _componentDidMount = asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee() {
          var _this$props, options, config, setComments, issue, page, comments;

          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  this.setState(function () {
                    return {
                      loading: true
                    };
                  });
                  _this$props = this.props, options = _this$props.options, config = _this$props.config, setComments = _this$props.setComments, issue = _this$props.issue;
                  page = this.state.page;

                  if (!issue.number) {
                    _context.next = 9;
                    break;
                  }

                  _context.next = 6;
                  return config.api.getComments(issue.number, page);

                case 6:
                  comments = _context.sent;
                  setComments(comments);

                  if (options.perPage === comments.length) {
                    this.setState(function () {
                      return {
                        page: page + 1
                      };
                    });
                  }

                case 9:
                  this.setState(function () {
                    return {
                      loading: false
                    };
                  });

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function componentDidMount() {
          return _componentDidMount.apply(this, arguments);
        }

        return componentDidMount;
      }()
    }, {
      key: "reply",
      value: function reply(comment, e) {
        e.preventDefault();
        var _this$props2 = this.props,
            input = _this$props2.input,
            setInput = _this$props2.setInput,
            config = _this$props2.config;
        var markdowm = "".concat(input ? '\n' : '', "> @").concat(comment.user.login, "\n> ").concat(comment.body, "\n");
        setInput(input + markdowm);
        smoothScroll(config.$container);
      }
    }, {
      key: "loadMore",
      value: function () {
        var _loadMore = asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee2(e) {
          var _this$props3, options, config, setComments, issue, page, comments;

          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  e.preventDefault();
                  this.setState(function () {
                    return {
                      loadMore: true
                    };
                  });
                  _this$props3 = this.props, options = _this$props3.options, config = _this$props3.config, setComments = _this$props3.setComments, issue = _this$props3.issue;
                  page = this.state.page;

                  if (!issue.number) {
                    _context2.next = 10;
                    break;
                  }

                  _context2.next = 7;
                  return config.api.getComments(issue.number, page);

                case 7:
                  comments = _context2.sent;
                  setComments(comments);

                  if (options.perPage === comments.length) {
                    this.setState(function () {
                      return {
                        page: page + 1
                      };
                    });
                  }

                case 10:
                  this.setState(function () {
                    return {
                      loadMore: false
                    };
                  });

                case 11:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function loadMore(_x) {
          return _loadMore.apply(this, arguments);
        }

        return loadMore;
      }()
    }, {
      key: "render",
      value: function render(_ref2, _ref3) {
        var _this2 = this;

        var options = _ref2.options,
            config = _ref2.config,
            comments = _ref2.comments;
        var loading = _ref3.loading,
            loadMore = _ref3.loadMore;
        return h("div", {
          className: "gitting-comments"
        }, loading ? h(Loading$1, {
          loading: loading
        }) : comments.map(function (item) {
          return h(CommentItem, {
            options: options,
            config: config,
            item: item,
            key: item.id,
            reply: _this2.reply
          });
        }), loadMore ? h("span", {
          "class": "gitting-load"
        }, config.i18n('loading')) : h("a", {
          href: "#",
          "class": "gitting-load",
          onClick: function onClick(e) {
            return _this2.loadMore(e);
          }
        }, config.i18n('loadMore')));
      }
    }]);

    return Comments;
  }(Component);

  var Comments$1 = Enhanced(Comments);

  var App =
  /*#__PURE__*/
  function (_Component) {
    inherits(App, _Component);

    function App(props) {
      var _this;

      classCallCheck(this, App);

      _this = possibleConstructorReturn(this, getPrototypeOf(App).call(this, props));
      _this.state = {
        loading: false,
        init: false
      };
      return _this;
    }

    createClass(App, [{
      key: "componentDidMount",
      value: function () {
        var _componentDidMount = asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee() {
          var _this$props, options, config, throwError, setUserInfo, setIssue, _getURLParameters, code, data, userInfo, redirect_uri, issue, labels;

          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  this.setState(function () {
                    return {
                      loading: true
                    };
                  });
                  _this$props = this.props, options = _this$props.options, config = _this$props.config, throwError = _this$props.throwError, setUserInfo = _this$props.setUserInfo, setIssue = _this$props.setIssue;
                  _getURLParameters = getURLParameters(), code = _getURLParameters.code;

                  if (!code) {
                    _context.next = 17;
                    break;
                  }

                  _context.next = 6;
                  return config.api.getToken(code);

                case 6:
                  data = _context.sent;
                  throwError(!data.access_token, 'Can not get token, Please login again!');
                  setStorage('token', data.access_token);
                  _context.next = 11;
                  return config.api.getUserInfo(data.access_token);

                case 11:
                  userInfo = _context.sent;
                  throwError(!userInfo.id, 'Can not get user info, Please login again!');
                  setStorage('userInfo', userInfo);
                  redirect_uri = getStorage('redirect_uri');
                  throwError(!redirect_uri, 'Can not get redirect url, Please login again!');
                  window.history.replaceState(null, '', redirect_uri);

                case 17:
                  setUserInfo(getStorage('userInfo'));
                  issue = null;

                  if (!(Number(options.number) > 0)) {
                    _context.next = 32;
                    break;
                  }

                  _context.prev = 20;
                  _context.next = 23;
                  return config.api.getIssueById(options.number);

                case 23:
                  issue = _context.sent;
                  setIssue(issue);
                  _context.next = 30;
                  break;

                case 27:
                  _context.prev = 27;
                  _context.t0 = _context["catch"](20);

                  if (!issue || !issue.number) {
                    this.setState(function () {
                      return {
                        init: true
                      };
                    });
                    throwError(true, "Failed to get issue by number: ".concat(options.number, ", Do you want to initialize an new issue?"));
                  }

                case 30:
                  _context.next = 38;
                  break;

                case 32:
                  labels = options.labels.concat(options.id).join(',');
                  _context.next = 35;
                  return config.api.getIssueByLabel(labels);

                case 35:
                  issue = _context.sent[0];

                  if (!issue || !issue.number) {
                    this.setState(function () {
                      return {
                        init: true
                      };
                    });
                    throwError(true, "Failed to get issue by labels: ".concat(labels, ", Do you want to initialize an new issue?"));
                  }

                  setIssue(issue);

                case 38:
                  this.setState(function () {
                    return {
                      loading: false
                    };
                  });

                case 39:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[20, 27]]);
        }));

        function componentDidMount() {
          return _componentDidMount.apply(this, arguments);
        }

        return componentDidMount;
      }()
    }, {
      key: "onInit",
      value: function () {
        var _onInit = asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee2() {
          var _this$props2, options, config, userInfo, isLogin, throwError, login, detail, issue;

          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _this$props2 = this.props, options = _this$props2.options, config = _this$props2.config, userInfo = _this$props2.userInfo, isLogin = _this$props2.isLogin, throwError = _this$props2.throwError, login = _this$props2.login;

                  if (isLogin()) {
                    _context2.next = 4;
                    break;
                  }

                  login(options);
                  return _context2.abrupt("return");

                case 4:
                  throwError(!options.admin.includes(userInfo.login), "You have no permission to initialize this issue");
                  detail = {
                    title: document.title,
                    body: "".concat(document.title, "\n").concat(window.location.href),
                    labels: options.labels.concat(options.id)
                  };
                  _context2.next = 8;
                  return config.api.creatIssues(detail);

                case 8:
                  issue = _context2.sent;
                  throwError(!issue || !issue.number, "Initialize issue failed: ".concat(JSON.stringify(detail)));
                  window.location.reload();

                case 11:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function onInit() {
          return _onInit.apply(this, arguments);
        }

        return onInit;
      }()
    }, {
      key: "render",
      value: function render(_ref, _ref2) {
        var _this2 = this;

        var options = _ref.options,
            config = _ref.config;
        var loading = _ref2.loading,
            init = _ref2.init;
        return h("div", {
          "class": "gitting-container gitting-theme-".concat(options.theme)
        }, loading ? h(Loading$1, {
          loading: loading
        }) : h("div", null, h(ErrorInfo$1, {
          options: options,
          config: config
        }), init ? h("button", {
          className: "gitting-init",
          onClick: function onClick(e) {
            return _this2.onInit(e);
          }
        }, config.i18n('init')) : h("div", null, h(Header$1, {
          options: options,
          config: config
        }), h(Editor$1, {
          options: options,
          config: config
        }), h(Comments$1, {
          options: options,
          config: config
        }))));
      }
    }]);

    return App;
  }(Component);

  var App$1 = Enhanced(App);

  var _default =
  /*#__PURE__*/
  function (_Component) {
    inherits(_default, _Component);

    function _default() {
      classCallCheck(this, _default);

      return possibleConstructorReturn(this, getPrototypeOf(_default).apply(this, arguments));
    }

    createClass(_default, [{
      key: "render",
      value: function render(_ref) {
        var options = _ref.options,
            config = _ref.config;
        return h(preact_2, {
          store: store
        }, h(App$1, {
          options: options,
          config: config
        }));
      }
    }]);

    return _default;
  }(Component);

  function creatRequest(controller) {
    return function request(method, url, body, header) {
      method = method.toUpperCase();
      body = body && JSON.stringify(body);
      var headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };

      if (header) {
        headers = Object.assign({}, headers, header);
      }

      var token = getStorage('token');

      if (token) {
        headers.Authorization = "token ".concat(token);
      }

      return fetch(url, {
        method: method,
        headers: headers,
        body: body,
        signal: controller.signal
      }).then(function (res) {
        if (res.status === 404) {
          return Promise.reject('Unauthorized.');
        } else if (res.status === 401) {
          cleanStorage();
          window.location.reload();
        } else {
          if (headers.Accept === 'text/html') {
            return res.text();
          } else {
            return res.json();
          }
        }
      });
    };
  }

  function creatApi(option) {
    var controller = new AbortController();
    var request = creatRequest(controller);
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
          Accept: 'application/vnd.github.v3.full+json'
        });
      },
      // 创建一条issues
      creatIssues: function creatIssues(issue) {
        return request('post', issuesApi, Object.assign({}, issue, baseQuery));
      },
      // 创建一条评论
      creatComments: function creatComments(id, body) {
        return request('post', "".concat(issuesApi, "/").concat(id, "/comments"), {
          body: body
        }, {
          Accept: 'application/vnd.github.v3.full+json'
        });
      },
      // 解析markdown
      mdToHtml: function mdToHtml(text) {
        return request('post', "https://api.github.com/markdown", {
          text: text
        }, {
          Accept: 'text/html'
        });
      },
      // 销毁
      destroy: function destroy() {
        controller && controller.abort && controller.abort();
      }
    };
  }

  var i18n = {
    'zh-cn': {
      init: "登录以初始化一个评论",
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
      loading: "加载中...",
      loadEnd: "加载完毕",
      published: "发表于"
    },
    en: {
      init: "Login then initialize a issue",
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
      loading: "loading...",
      loadEnd: "Load completed",
      published: "Published on"
    }
  };
  function creatI18n (lang) {
    var langObj = i18n[lang] || i18n["zh-cn"];
    return function (key) {
      return langObj[key] || "Unmath key: ".concat(key);
    };
  }

  var Gitting =
  /*#__PURE__*/
  function () {
    function Gitting() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      classCallCheck(this, Gitting);

      this.options = Object.assign({}, Gitting.DEFAULT, options);
      ['clientID', 'clientSecret', 'repo', 'owner'].forEach(function (item) {
        if (!_this.options[item].trim()) {
          throw new Error("The options.".concat(item, " can not be empty"));
        }
      });
      this.config = {
        $root: null,
        $container: null,
        api: creatApi(this.options),
        i18n: creatI18n(this.options.language)
      };
    }

    createClass(Gitting, [{
      key: "render",
      value: function render$1(el) {
        this.config.$container = el instanceof Element ? el : document.querySelector(el);
        this.config.$root = render(h(_default, {
          options: this.options,
          config: this.config
        }), this.config.$container);
        return this;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        render(null, this.config.$container, this.config.$root);

        this.config.api.destroy();
      }
    }], [{
      key: "DEFAULT",
      get: function get() {
        return {
          clientID: "",
          clientSecret: "",
          repo: "",
          owner: "",
          admin: [],
          theme: "white",
          id: window.location.pathname,
          number: -1,
          labels: ["Gitting"],
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

  return Gitting;

}));
//# sourceMappingURL=gitting-uncompiled.js.map
