// element.js - Javascript class which facilitates work with the DOM
// v. 1.1.1
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
        var cld = obj.childNodes;
        var l = cld.length;
        var result = new Array(l);
        for (var i=0; i<l; i++){
            if (E.isUndef(result[i] = f(cld[i])))
                 result[i] = E.mapTree(f, cld[i]);
        }
        return result;
    };

    function range(l){
        var arr = new Array(l);
        for (var i=0; i<l; arr[i] = i++);
        return arr;
    }

    E.addOption = function(obj, arr, selection){
        var selected = [];
        if (E.isArray(selection))
            selected = selection;
        else if (E.isString(selection) || E.isNumber(selection))
            selected.push(selection);

        if (E.isFunction(arr))
            arr = arr(obj);
        var keys = E.isArray(arr) ? range(arr.length) : Object.keys(arr);
        var opts = new Array(keys.length);
        for (var i=0; i<keys.length; ++i){
            var k = keys[i], v = arr[k];
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
                if (!children[select].selected)
                    continue;
                if (!selected)
                    return select;
                selected.push(select);
            }
        }
        return selected ? selected : -1;
    };

    E.getSelectedParam = function(obj, param){
        if (!E.isElement(obj))
            return null;
        param = param||'text';
        var selected = E.getSelected(obj);
        var children = obj.childNodes;
        if (E.isArray(selected))
            return selected.map(function(k){ return children[k][param]; });
        return selected < 0 ? null : children[selected][param];
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
        if (children)
            E.appendChild(created, children);
        return created;
    };

    E.createCount = function(elem, params, children, count){
        var elems = new Array(count);
        for (var i=0; i<count; ++i)
            elems[i] = E.create(elem, params, deepCopy(children));
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
            if (top && elem.childNodes)
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
        if(E.isNull(a) || E.isString(a) || (a && (
            E.isElement(a) || E.isArray(a) || E.isNodeList(a) ||
            E.isHash(a) || E.isFunction(a))))
            return true;
        return false;
    }

    function createRecursive(arr){
        var ret = [];
        for (var i = 0; i<arr.length; ++i){
            if (!appendable(arr[i]))
                continue;
            if (E.isHash(arr[i])){
                arr[i] = E.createMany(arr[i]);
                if (arr[i].length==1)
                    arr[i] = arr[i][0];
            } else if (E.isString(arr[i])||E.isNull(arr[i]))
                arr[i] = E.create(arr[i]);
            if (E.isArray(arr[i])||E.isNodeList(arr[i])||E.isFunction(arr[i])){
                if (!ret.length)
                    throw new Error("No element to append to: "+arr[i]);
                arr[i] = E.appendChild(ret[ret.length-1], arr[i]);
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
        if (!E.isElement(obj))
            throw new Error('Can append only to dom nodes');
        var ar = [];
        if (!appendable(children))
            return ar;
        if (E.isFunction(children))
            children = children(obj)||[];
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
        var perv = next ? obj.nextSibling : obj;
        var insertf = function(e, p){
            return obj.parentNode.insertBefore(e, p); };
        if (E.isString(elem))
            return insertf(E.create(elem), perv);
        else if (E.isElement(elem))
            return insertf(elem, perv);
        if (E.isHash(elem))
            elem = E.createMany(elem);
        if (E.isArray(elem)||E.isNodeList(elem)) {
            elem = createRecursive(elem);
            for (var i=0; i<elem.length; ++i)
                insertf(elem[i], perv);
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
        return E.isObject(object) && !object.nodeName &&
            !E.isArray(object);
    };
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
        return object instanceof Error || (typeof e === 'object' &&
                Object.prototype.toString.call(e) === '[object Error]');
    };
    E.isNull = function(object){ return object === null; };
    E.isUndef = function(object){
        return typeof object == "undefined"; };

    E.t = {
        range: range,
        deepCopy: deepCopy,
        appendable: appendable,
        createRecursive: createRecursive,
    };

    return E;
});


