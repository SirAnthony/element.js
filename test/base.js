
define(['element', 'assert'], function(element){

describe('element', function(done){
    describe('create', function(){
        it('should create element', function(done){
            var s1 = element.create('select', {id: 'show',
                onclick: function(){ done(); }});
            assert.equal(s1.type, 'select-one');
            assert.equal(s1.id, 'show');
            // Must end test
            s1.click();

            var text = element.create(null, {textContent: 'Hello world!'});
            assert.equal(text.type, 'text');
            assert.equal(text.textContent, 'Hello world!');

            var d1 = element.create('div', {className: 'example'},
                ['p', [{'span': {className: 'span'}}, text]])
            assert.equal(d1.childNodes.length, 1);
            var fc = d1.firstChild;
            assert.equal(fc.type, 'p');
            assert.equal(fc,childNodes.length, 2);
            assert.equal(fc.firstChild.type, 'span');
            assert.equal(fc.firstChild.className, 'span');
            assert.equal(fs.lastChild, text);

            var d2 = element.create('div', {childNodes: {'text': {
                textContent: 'd2'}}});
            assert.equal(d2.childNodes.length, 1);
            assert.equal(d2.childNodes.firstChild.textContent, 'd2');
        });
    });
});

});
