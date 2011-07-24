// element.js - Javascript class which facilitates work with the DOM
// v. 1.0 
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

	this.addOption = function(obj, arr){
		var opts = new Array();
		if(isArray(arr)){ //isArray?
			for(var i=0; i < arr.length; i++)
				opts.push(this.create('option', {value: arr[i], text: arr[i]}));
		}else{//isHash?
			for(var i in arr)
				opts.push(this.create('option', {value: i, text: arr[i]}));
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
		for (var i in params)
			elm[i] = params[i];
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

	this.appendChild = function(obj, arr){
		var ar = new Array();
		ar = eval(arr);
		var l = ar.length;
		if(!l) l = 0;
		for(var i=0; i < l; i++){
			if(!ar[i] || (!isElement(ar[i]) && !isArray(ar[i]) && !isHash(ar[i]))) continue;
			if(isHash(ar[i])){
				var elems = ar[i];
				for(var key in elems){
					if(elems[key] && !isHash(elems[key]))
						continue;
					ar[i] = this.create(key, elems[key]);
				}
			}
			if(isArray(ar[i])){
				this.appendChild(ar[i-1], ar[i]);
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
function isUndef(object){return typeof object == "undefined";}

element.init();