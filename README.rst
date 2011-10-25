============================
element.js
============================

element.js - Javascript class which facilitates work with the DOM

Basic usage
============================

element.create
----------------------------

Creates new dom element and returns it.

Takes three arguments.
First two required arguments: tag name and element parameters as hash::

    var select = element.create('select', {id: 'show', onchange: function(){alert();}});

Result::

    <select id="show"></select>

Second::

    var select2 = element.create('select', {id: 'show2'});

Result::

    <select id="show2"></select>

innerText property can be used as element text.
If tag name is empty string it will creates text node::

    var text = element.create('', {innerText: 'Hello world!'});

Last argument if given passed to element.appendChild as second parameter with created element
as first parameter::

    var temp = element.create('div', {className: 'example'}, ['p', [{'span': {className: 'span'}}, 'span']])

Result::

    <div class="example">
        <p>
            <span class="span"></span>
            <span></span>
        </p>
    </div>

element.addOption
----------------------------

Adds options to the select element.

Takes two arguments: dom element and array/hash.

If second argument is array it creates options with the same value and text::

    var opts = new Array(1,2,3);

    element.addOption(select, opts);

Result::

    <select id="show">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
    </select>

If second argument is hash it creates options with the value equal hash key and text equal hash value::

    var opts = {1: 'one', 2: 'two', 3: 'three'};

    element.addOption(select2, opts);

Result::

    <select id="show2">
        <option value="1">one</option>
        <option value="2">two</option>
        <option value="3">three</option>
    </select>

If first element is False it returns option objects array instead of appending.

element.getSelected
----------------------------

Returns index of selected option.

Takes one argument: select element::

    select2.childNodes[1].selected = true;

    var idx = element.getSelected(select2);

idx is 1 now

element.appendChild
----------------------------

Appends nodes to element.

Takes two arguments: dom element and element or elements array. You can
pass element node name as second argument if you want create element
without parameters. Also you can pass hash to create element with
parametes. If array is passed, it will be processed as siblings. If
array contains another element arrays function will be recursively
called with this arrays as second parameters and previous element as
first parameter. Hash with tag name as key and parameters hash as value
can be used for dynamic element creation::

    var div = element.create('div');
    element.appendChild(div, [
        {'p': {innerText: 'New text.'}},
        'ul', [
            {'li': {innerText: 'First list element.'}},
            'li', [
                text
            ]
        ],
        select2,
        {'span': {className: 'spanclass', innerText: idx}}
    ]);

Result::

    <div>
        <p>New text.</p>
        <ul>
            <li>First list element.</li>
            <li>
                <text>Hello world!</text>
            </li>
        </ul>
        <select id="show2">
            <option value="1">one</option>
            <option value="2" selected>two</option>
            <option value="3">three</option>
        </select>
        <span class="spanclass">1</span>
    </div>

element.insert
----------------------------

Insert element before/after element.

Takes three arguments: base dom element, dom element which must be inserted
before/afer base element and optional boolean parameter which indicates that
element must be inserted after base element.

Second element can be hash which works like in appendChild::

    element.insert(select2, {'p': {innerText: 'New text before select.'}});

Result::

    <div>
        <p>New text.</p>
        <ul>
            <li>First list element.</li>
            <li>
                <text>Hello world!</text>
            </li>
        </ul>
        <p>New text before select.</p>
        <select id="show2">
            <option value="1">one</option>
            <option value="2" selected>two</option>
            <option value="3">three</option>
        </select>
        <span class="spanclass"></span>
    </div>

Now insert after::

    element.insert(select2, text, true); // Move text node from li to div

Result::

    <div>
        <p>New text.</p>
        <ul>
            <li>First list element.</li>
            <li></li>
        </ul>
        <p>New text before select.</p>
        <select id="show2">
            <option value="1">one</option>
            <option value="2" selected>two</option>
            <option value="3">three</option>
        </select>
        <text>Hello world!</text>
        <span class="spanclass">1</span>
    </div>


element.removeAllChilds
----------------------------

Removes all child nodes of element.

Takes one argument: dom element::

    element.removeAllChilds(select);

Result::

    <select id="show"></select>


element.remove
----------------------------

Removes dom element and all its child nodes.

Takes one argument: dom element::

    element.remove(select2);

Result::

    <div>
        <p>New text.</p>
        <ul>
            <li>First list element.</li>
            <li></li>
        </ul>
        <p>New text before select.</p>
        <text>Hello world!</text>
        <span class="spanclass">1</span>
    </div>


element.downTree
----------------------------

Bypasses child nodes and calls argument function with the node as the first argument.

Takes three arguments: function to call, dom element which nodes will be used
and optional boolean parameter which indicates that function must return some value.

Returns first returned value if third parameter passed. If called function not returns
anything returns true after all elements will be processed::

    //Function that return hash with form data.
    function getFormData(form){
        var formData = {};
        var f = function(elm){
        if(elm.tagName == "INPUT" || elm.tagName == "TEXTAREA" || elm.tagName == "SELECT"){
            if(elm.type == "checkbox"){
                formData[elm.name] = elm.checked;
            }else if(elm.type == "select-multiple"){
                var values = new Array();
                element.downTree(function(opt){
                    if(opt.selected) values.push(opt.value);}, elm);
                        formData[elm.name] = values;
                    }else if(elm.type != "button"){
                        formData[elm.name] = elm.value;
                    }
            }else{
                element.downTree(f, elm);
            }
        }
       element.downTree(f, form);
       return formData;
    }

element.getOffset
----------------------------

Takes two arguments: dom element and element on which is calculated offset.
Returns: object with two parameters: top and left which are element offset.
If second parameter not passed offset is calculated relative to body element.


Additions
----------------------------

Along with the class comes additional functions:

isElement, isArray, isHash, isFunction, isString, isNumber, isUndef

This functions takes one argument and returns true if this variable has a specific type.
