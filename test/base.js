
define(['element', 'assert'], function(element){
var eq = assert.equal;
var cneq = function(el, c){ return eq(el.childNodes.length, c); };
describe('element', function(done){
    describe('create', function(){
        it('should create element', function(done){
            var s1 = element.create('select', {id: 'show',
                onclick: function(){ done(); }});
            eq(s1.type, 'select-one');
            eq(s1.id, 'show');
            // Must end test
            s1.click();
	});
	it('shold create text', function(){
            var text = element.create(null, {textContent: 'Hello world!'});
            eq(text.tagName, 'TEXT');
            eq(text.textContent, 'Hello world!');
	});
	it('should do styles & choices', function(){
            var el = element.create('select', {style: {'border-width': '10px'},
                choices: ['a', 2]});
            eq(el.style.borderWidth, '10px');
            cneq(el, 2);
            eq(el.firstChild.value, 0);
            eq(el.firstChild.text, 'a');
            eq(el.lastChild.text, 2);
	});
	it('should create children as 3rd parameter', function(){
            var text = element.create(null, {textContent: 'Hello world!'});
            var d1 = element.create('div', {className: 'example'},
                ['p', [{'span': {className: 'span'}}, text]])
            cneq(d1, 1);
            var fc = d1.firstChild;
            eq(fc.tagName, 'P');
            cneq(fc, 2);
            eq(fc.firstChild.tagName, 'SPAN');
            eq(fc.firstChild.className, 'span');
            eq(fc.lastChild, text);
	});
	it('should create children as childNodes', function(){
            var d2 = element.create('div', {childNodes: {'text': {
                textContent: 'd2'}}});
            cneq(d2, 1);
            eq(d2.firstChild.textContent, 'd2');
        });
    });
    describe('createMany', function(){
        var data = {
            'text': {textContent: 'text'},
            'p': {textContent: 'p'},
            'span': {textContent: 'span'},
            '_order': ['p', 'span', 'text'],
        };
        it('should create array of elements', function(){
            var elems = element.createMany(element.t.deepCopy(data));
            eq(elems.length, 3);
            for (var i=0; i<elems.length; ++i)
                eq(elems[i].tagName, elems[i].textContent.toUpperCase());
        });
        it('should care about order', function(){
            var elems = element.createMany(element.t.deepCopy(data));
            for (var i=0; i<data._order.length; ++i)
                eq(elems[i].tagName, data._order[i].toUpperCase());
        });
    });
    describe('createCount', function(){
        it('should create many similar elements', function(){
            var count = 4;
            var elems = element.createCount('option', {className: 'opt'},
                ['text', 'span'], count);
            eq(elems.length, count);
            elems.forEach(function(el){
                eq(el.tagName, 'OPTION');
                eq(el.className, 'opt');
                cneq(el, 2);
            });
        })
    });
    describe('appendChild', function(){
        it('should append to element', function(){
            var el = element.create('div');
            assert.throws(function(){ element.appendChild(null, []); });
            element.appendChild(el, ['span', 'span']);
            cneq(el, 2);
        });
        it('should return created children', function(){
            var el = element.create('div');
            var children = element.appendChild(el, ['p', 'p', 'p']);
            eq(children.length, 3);
            children.forEach(function(ch){ eq(ch.tagName, 'P'); });
        });
        it('should accept complex constructions', function(){
            var el = element.create('div');
            var children = element.appendChild(el, ['div',
                {input: {type: 'text'}, label: {textContent: 'Input'}},
                'p', function(obj){
                    // Must be pervious
                    eq(obj.tagName, 'P');
                    return ['a', [{img: {src: 'url'}}]];
                },
                'span',
            ])
            var html = '<div><input type="text"><label>Input</label></div>'+
                '<p><a><img src="url"></a></p>'+'<span></span>';
            eq(el.innerHTML, html);
        });
    });
    describe('appendChildCopy', function(){
        it('should not change array', function(){
            var el = element.create('div');
            var children = ['p', 'p', 'p'];
            element.appendChildCopy(el, children);
            children.forEach(function(cld){
                eq(typeof cld, 'string'); });
        })
    });
    describe('removeChildren', function(){
        it('should remove all children', function(){
            var el = element.create('div', {}, ['p', 'p']);
            cneq(el, 2);
            element.removeChildren(el);
            assert(!el.childNodes.length);
        });
        it('should return removed nodes', function(){
            var el = element.create('div');
            var children = element.appendChild(el, ['p', 'p']);
            var removed = element.removeChildren(el);
            for (var c=0; c<children.length; ++c)
                eq(children[c], removed[c]);
        });
    });
    describe('remove', function(){
        it('should remove element from tree', function(){
            var el = element.create('div', {}, ['p', 'span']);
            cneq(el, 2);
            var p = element.remove(el.firstChild);
            cneq(el, 1);
            eq(el.firstChild.tagName, 'SPAN');
            eq(p.length, 1);
            eq(p[0].tagName, 'P');
        });
        it('should return removed tree', function(){
            var el = element.create('div', {}, ['p', ['span', 'span']]);
            var removed = element.remove(el.firstChild);
            cneq(el, 0);
            eq(removed.length, 1);
            cneq(removed[0], 2);
        });
        it('should return expanded tree', function(){
            var el = element.create('div', {}, ['p', ['span', 'span']]);
            var removed = element.remove(el.firstChild, true);
            eq(removed.length, 2);
            assert(element.isElement(removed[0])&&element.isArray(removed[1]));
            eq(removed[1].length, 2);
            cneq(removed[0], 0);
        });
        it('should remove array', function(){
            var el = element.create('div', {}, ['p', 'span', 'p']);
            var removed = element.remove([el.firstChild, el.lastChild]);
            cneq(el, 1);
            eq(el.firstChild.tagName, 'SPAN');
            eq(removed.length, 2);
        })
    });
    describe('insert', function(){});
    describe('addOption', function(){});
    describe('getSelected', function(){});
    describe('getSelectedValues', function(){});
    describe('mapTree', function(){});
    describe('getOffset', function(){});
    describe('internal', function(){
        it('deepCopy', function(){
            var data = {x: [1, 2, '3', [3, 2, {3: 'd'}]]};
            var copy = element.t.deepCopy(data);
            assert.notEqual(data, copy);
            assert.deepEqual(data, copy);
        });
        describe('createRecursive', function(){});
        it('appendable', function(){
            var app = element.t.appendable;
            var elems = [document.createElement('span'), function(){},
                {}, [], ''];
            elems.forEach(function(el){
                assert(app(el)); });
            assert(!app(true));
            assert(!app());
        });
    });
});
});
