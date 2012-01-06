// element.js - Javascript class which facilitates work with the DOM
// v. 1.0.7
// (c) 2011 SirAnthony <anthony at adsorbtion.org>
// http://github.com/SirAnthony/element.js/

var element = new ( function(){

    this.init = function(){
        var ua = navigator.userAgent.toLowerCase();
        if (! (ua.indexOf("msie") != -1 && ua.indexOf("webtv") == -1) ) {
            if ( !isUndef(Node) && !isUndef(Node.prototype) && isFunction(Node.prototype.__defineGetter__)){
                Node.prototype.__defineGetter__("innerText", function() { return this.textContent; });
                Node.prototype.__defineSetter__("innerText", function(val){this.textContent ="";
                    this.appendChild(document.createTextNode(val));});
            }
        }
    }

    this.downTree = function(funct, obj, er){
        if(!funct || !obj) return;
        for(var i=0; i < obj.childNodes.length; i++){
            var e = funct(obj.childNodes[i]);
            if(e) return e;
        }
        if(er) return true;
    }

    this.addOption = function(obj, arr, sel){
        var opts = new Array();
        var selected = null;
        if(isArray(sel))
            selected = sel;
        else if(isString(sel))
            selected = new Array(sel);

        if(isArray(arr)){ //isArray?
            for(var i=0; i < arr.length; i++){
                if(isArray(arr[i]) && arr[i].length == 2)
                    opts.push(this.create('option', {value: arr[i][0], text: arr[i][1]}));
                else
                    opts.push(this.create('option', {value: arr[i], text: arr[i]}));
            }
        }else{//isHash?
            for(var i in arr)
                opts.push(this.create('option', {value: i, text: arr[i]}));
        }
        if(selected){
            for(var i=0; i < opts.length; i++){
                for(var j=0; j < selected.length; j++){
                    if(opts[i].value == selected[j])
                        opts[i].selected = 'selected';
                }
            }
        }
        if(obj)
            this.appendChild(obj, opts);
        else
            return opts;
    }

    this.getSelected = function(obj){
        var sel = obj.childNodes;
        var select;
        if(sel)
            for(select in sel){ if(sel[select].selected) break; }
        return select;
    }

    this.removeAllChilds = function(el){
        if(!el) return;
        while(el.hasChildNodes()){
            el.removeChild(el.lastChild);
        }
    }

    this.create = function(elem, params, childs){
        if(!elem || elem == '') elem = 'text';
        var elm = document.createElement(elem);
        for(var i in params){
            if(i == 'choices'){
                this.addOption(elm, params[i], params['value']);
            }else if(i == 'style' && isHash(params[i])){
                for(var j in params[i])
                    elm.style[j] = params[i][j];
            }else{
                elm[i] = params[i];
            }
        }
        if(childs)
            this.appendChild(elm, childs);
        return elm;
    }

    this.remove = function(elem){
        if(!elem) return;
        if(isArray(elem)){
            for(var el in elem)
                this.remove(elem[el]);
        }else{
            this.removeAllChilds(elem);
            if(elem.parentNode)
                elem.parentNode.removeChild(elem);
        }
    }

    this.appendChild = function(o, arr){
        function deepCopy(obj){
            if(isArray(obj)){
                var out = [];
                var len = obj.length;
                for(var i = 0 ; i < len; i++)
                    out[i] = arguments.callee(obj[i]);
                return out;
            }
            if(isHash(obj)){
                var out = {};
                for(var i in obj)
                    out[i] = arguments.callee(obj[i]);
                return out;
            }
            return obj;
        }
        this.appendChildNoCopy(o, deepCopy(arr));
    }

    this.appendChildNoCopy = function(obj, arr){
        var ar = new Array();
        if(isArray(arr)){
            ar = arr;
        }else{
            if(isFunction(arr))
                arr = arr();
            if(isString(arr)){
                try{
                    arr = eval(arr);
                }catch(e){}
            }
            ar.push(arr);
        }
        var l = ar.length;
        for(var i=0; i < l; i++){
            if(!ar[i] || (!isElement(ar[i]) && !isArray(ar[i]) && !isHash(ar[i]) && !isString(ar[i]))) continue;
            if(isHash(ar[i])){
                var elems = ar[i];
                for(var key in elems){
                    if(elems[key] && !isHash(elems[key]))
                        continue;
                    ar[i] = this.create(key, elems[key]);
                }
            }else if(isString(ar[i])){
                ar[i] = this.create(ar[i]);
            }
            if(isArray(ar[i])){
                this.appendChildNoCopy(ar[i-1], ar[i]);
            }else{
                obj.appendChild(ar[i]);
            }
        }
    }

    //Insert elem before(after if next) obj
    this.insert = function(obj, elem, next){
        if(isHash(elem)){
            var el;
            for(var key in elem){
                if(!isHash(elem[key])) continue;
                el = this.create(key, elem[key]);
            }
            elem = el;
        }else if(isArray(elem)){
            var el = elem.shift();
            elem = elem.shift();
            if(isElement(el)){
                element.appendChild(el, elem);
                elem = el;
            }else if(isHash(el)){
                for(var i in el)
                    if(el.hasOwnProperty(i)){
                        elem = this.create(i, el[i], elem)
                        break;
                    }
            }else if(isString(el)){
                elem = this.create(el, null, elem)
            }else{
                throw new Error(el + ' is not element.');
            }
        }
        var ins = next ? obj.nextSibling : obj
        obj.parentNode.insertBefore(elem, ins);
    }

    this.getOffset = function(obj, parent){
        if(!obj) return;
        parent = parent ? parent : document.body;
        var el = obj;
        var offset = {top: el.offsetTop, left: el.offsetLeft};
        if((el = el.offsetParent) && el != parent){
            do {
                offset.top += el.offsetTop;
                offset.left += el.offsetLeft;
            } while(el.offsetParent != parent && (el = el.offsetParent));
        }
        return offset;
    }

})();

function isElement(object){return !!(object && object.nodeType == 1);}
function isArray(object){return object != null && typeof object == "object" &&
    'splice' in object && 'join' in object;}
function isHash(object) {
    return object &&
        typeof object=="object" &&
        (object==window||object instanceof Object) &&
        !object.nodeName &&
        !isArray(object);
}
function isFunction(object){return typeof object == "function";}
function isString(object){return typeof object == "string";}
function isNumber(object){return typeof object == "number";}
function isError(object){return object instanceof Error ||
    (typeof e === 'object' && objectToString(e) === '[object Error]');}
function isUndef(object){return typeof object == "undefined";}

element.init();
