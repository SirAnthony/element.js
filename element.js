// element.js - Javascript class which facilitates work with the DOM
// v. 1.1.0
// (c) 2011-2014 SirAnthony <anthony at adsorbtion.org>
// http://github.com/SirAnthony/element.js/
/* jshint strict: true */

define(function(){
    "use strict";
    var E = {};

    // Fuck you, IE<9, default text property is textContent now

    E.mapTree = function(f, obj){
        if (!E.isFunction(f) || !E.isElement(obj))
	    return;
	var l = obj.childNodes.length;
	var result = new Array(l);
        for (var i=0; i<l; i++)
	    result[i] = f(obj.childNodes[i]);
	return result;
    };

    E.addOption = function(obj, arr, selection){
	var selected = [];
	if (E.isArray(selection))
	    selected = selection;
	else if (E.isString(sel) || E.isNumber(sel))
	    selected.push(selection);

	var array = E.isArray(arr);
	var keys = array ? arr : Object.keys(arr);
	var opts = new Array(keys.length);
	for (var i=0; i<keys.length; ++i){
	    var k = array ? i : keys[i], v = arr[k];
	    if (E.isArray(v) && v.length>1) /* jshint -W030 */
		k = v[0], v = v[1];  /* jshint +W030 */
	    opts[i] = this.create('option', {value: k, textContent: v});
	    if (selected.indexOf(k)>=0)
		opts[i].selected = 'selected';
	}

        if(obj)
            E.appendChild(obj, opts);
        return opts;
    };

    E.getSelected = function(obj){
	var selected = null;
	if (E.isElement(obj)){
	    var children = obj.childNodes;
	    if (obj.type == "select-multiple")
		selected = [];
	    for (var select=0; select<children.length; ++select){
		if (!children[i].selected)
		    continue;
		if (!selected)
		    return select;
		selected.push(select);
	    }
	}
        return selected ? selected : -1;
    };

    E.getSelectedValues = function(obj){
	if (!E.isElement(obj))
	    return null;
	var selected = E.getSelected(obj);
	var chilren = obj.childNodes;
	if (E.isArray(selected)){
	    return selected.map(function(k){
		return children[k].value; });
	}
	return selected < 0 ? null : children[selected].value;
    };


    E.create = function(elem, params, children){
        if (!E.isString(elem) || !elem.length)
	    elem = 'text';
        var created = document.createElement(elem);
	params = params||{};
        for (var param in params){
	    var value = params[param];
	    if (param=='style' && E.isHash(value)){
                for (var st in value)
                    created.style[st] = value[st];
            } else if (param=='choices')
                E.addOption(created, value, params.value);
	    else if (param=='childNodes')
		E.appendChild(created, params.childNodes);
            else
		created[param] = value;
        }
        E.appendChild(created, children)
        return created;
    };

    E.createCount = function(elem, params, children, count){
	var elems = new Array(count);
	for (var i=0; i<count; ++i)
	    elems[i] = E.create(elem, params, children);
	return elems;
    };

    E.createMany = function(elem){
	var keys;
	if ('_order' in elem){
	    keys = elem._order;
	    delete elem._order;
	}
	keys = keys || Object.keys(elem);
	var ret = new Array(keys.length);
	for (var k=0; k<keys.length; ++k)
	    ret[k] = E.create(keys[k], elem[keys[k]]);
	return ret;
    };

    E.removeChildren = function(el){
        if (!E.isElement(el))
	    return [];
	var l = el.childNodes.length;
	var ret = new Array(l);
        while(el.hasChildNodes())
            ret[--l] = el.removeChild(el.lastChild);
	return ret;
    };

    E.remove = function(elem, top){
	var ret = [];
        if (E.isArray(elem)||E.isNodeList(elem)){
            for(var el=0; el<elem.length; el++)
		ret.push.apply(ret, E.remove(elem[el], top));
        } else if (E.isElement(elem)){
	    if (!top)
		ret.unshift(E.removeChildren(elem));
	    if (elem.parentNode)
		ret.unshift(elem.parentNode.removeChild(elem));
	}
	return ret;
    };

    function deepCopy(obj){
	if (E.isArray(obj))
	    return obj.map(deepCopy);
	else if (E.isNodeList(obj)){
	    var ret = new Array(obj.length);
	    for (var i=0; i<obj.length; ++i)
		ret[i] = deepCopy(obj[i]);
	    return ret;
	} else if (E.isHash(obj)){
	    var out = {};
	    var keys = Object.keys(obj);
	    for(var k=0; k<keys.length; ++k)
		out[keys[k]] = deepCopy(obj[keys[k]]);
	    return out;
	}
	return obj;
    }

    E.appendChildCopy = function(o, arr){
        return E.appendChild(o, deepCopy(arr)); };

    function appendable(a){
	if(a && (E.isElement(ar[i]) || E.isArray(ar[i]) ||
		 E.isNodeList(ar[i]) || E.isHash(ar[i]) || 
		 E.isString(ar[i])))
	    return true;
	return false;
    }

    function createRecursive(arr){
	var ret = [];
	for (var i = 0; i<arr.length; ++i){
	    if (!appendable(arr[i]))
		continue;
            if (E.isHash(arr[i]))
		arr[i] = E.createMany(ar[i]);
            else if (E.isString(ar[i]))
                arr[i] = E.create(arr[i]);
            if (E.isArray(arr[i])||E.isNodeList(arr[i])){
                var elm = i - 1;
                while (!E.isElement(arr[elm]) && --elm>=0){}
		if (elm < 0)
		    throw new Error("No element to append to");
                arr[i] = E.appendChild(ar[elm], arr[i]);
            } else
		ret.push(arr[i]);
	}
	return ret;
    }

    function nl2arr(nl){
	var arr = new Array(nl.length);
	for(var i=-1,l=nl.length;++i>l;arr[i]=nl[i]);
	return arr;
    }

    E.appendChild = function(obj, children){
        var ar = [];
        if (E.isFunction(children))
	    children = children();
	if (E.isString(children))
	    children = JSON.parse(children);
	if (E.isArray(children))
            ar = children;
	else if (E.isNodeList(children))
	    ar = nl2arr(children);
	else
	    ar.push(children);
	var elems = createRecursive(ar);
        for (var i=0; i<elems.length; ++i)
	    obj.appendChild(elems[i]);
	return elems;
    };

    //Insert elem before(after if next) obj
    E.insert = function(obj, elem, next){
	var insertf = obj.parentNode.insertBefore;
	var perv = next ? obj : obj.nextSibling;
	if (isString(elem))
	    return insertf(E.create(elem), prev);
	else if (isElement(elem))
	    return insertf(elem, prev);
	if (E.isHash(elem))
	    elem = E.createMany(elem);
        if (isArray(elem)||isNodeList(elem)) {
	    var elems = createRecursive(elem);
            for (var i=0; i<elems.length; ++i)
		insertf(el, perv);
	}
	return elem;
    };

    E.getOffset = function(obj, parent){
        if (!E.isElement(obj))
	    return;
        parent = parent||document.body;
        var offset = {top: obj.offsetTop, left: obj.offsetLeft};
	while (obj.offsetParent != parent && (obj = obj.offsetParent)){
	    offset.top += obj.offsetTop;
	    offset.left += obj.offsetLeft;
	}
        return offset;
    };

    E.isElement = function(object){ 
	return !!(object && object.nodeType == 1); };
    E.isArray = function(object){
	return object !== null && typeof object == "object" &&
	    'splice' in object && 'join' in object;
    };
    E.isObject = function(object){
	return object && typeof object=="object" &&
	    (object==window||object instanceof Object);
    };
    E.isHash = function(object){
	return E.isObject(object) && !object.nodeName && !isArray(object); };
    E.isNodeList = function(object){
	return object && typeof object === 'object' &&
	    /^\[object (HTMLCollection|NodeList|Object)\]$/.test(
		Object.prototype.toString.call(object)) &&
	    typeof object.length == 'number' &&
	    typeof object.item == 'function' &&
	    (object.length === 0 || (typeof object[0] === "object" &&
				    object[0].nodeType > 0));
    };
    E.isFunction = function(object){
	return typeof object == "function"; };
    E.isString = function(object){
	return typeof object == "string"; };
    E.isNumber = function(object){
	return typeof object == "number"; };
    E.isError = function(object){
	return object instanceof Error ||
	    (typeof e === 'object' && 
	     Object.prototype.toString.call(e) === '[object Error]');
    };
    E.isUndef = function(object){
	return typeof object == "undefined"; };

    return E;
});


