============================
element.js
============================

element.js - Javascript class which facilitates work with the DOM

Basic usage
============================

.. _create:
element.create
----------------------------

Creates new dom element and returns it.

Takes three arguments. 
First two arguments are required: tag name and element parameters as object::
If tag name is not string or empty it will created as text node::
Last argument, if given, will be passed to element.appendChild as second parameter
with created element as first parameter::

    var select = element.create('select', {id: 'show', onchange: function(){alert();}});
    var select2 = element.create('select', {id: 'show2'});
    var text = element.create(null, {textContent: 'Hello world!'});
    var temp = element.create('div', {className: 'example'}, ['p', [{'span': {className: 'span'}}, text]])

Result::

    <select id="show"></select>
    <select id="show2"></select>
    Hello World!
    <div class="example">
        <p>
            <span class="span"></span>
            Hello World!
        </p>
    </div>

Special parameters of second argument:

:style:      Object that will be passed to Node style property.
:choices:    List that will be processed as list of options, and passed to
             options, i.e. its contents will be passed to addOption_
             function with created Node as first, content of `choises` as
             second and content of `value` as third parameter.
:childNodes: Array or Object with child nodes of current element, will be
             passed to appendChild_ function.


.. _createMany:
element.createMany
----------------------------

Creates array of elements.
Takes one argument - object where keys - created Node tags and values is Node
parameters::

    var elements = element.createMany({'p': {name: 'p'}, 'span': {name: 'span'}});

Result::

    [<p name="p"></p>, <span name="span"></span>]


`_order` object parameter can be passed to specify order of elements creation.


.. _createCount:
element.createCount
----------------------------

Like create_, but creates array of similar elements. Takes four arguments.
First three arguments passed to create_ function, last argument is count
of new elements must be created::

    var options = element.createMany('option', {className: 'opt'}, [{'', textContent: 'Hello World'}], 3);

Result::

    [<option className="opt">Hello World</option>,
     <option className="opt">Hello World</option>,
     <option className="opt">Hello World</option>]


.. _appendChild:
element.appendChild
----------------------------

Append nodes to element.

Takes two arguments: DOM Node as first and interpretable structure as
second. Returns inserted structure converted to DOM Nodes.
If second argument is function it will be evaluated and result
will be treated as children elements (based on returned content). If
second argument is string it will be treated as tag name.
Object as second argument (or as result of pervious two evaluations)
will be passed to createMany_.
Array will be processed as sibling Nodes. Function will be recursivelly
called for each array element with this element as second argument and
pervious element as first argument. Complex structures can be used in
dynamic tree generation::

    var div = element.create('div');
    element.appendChild(div, [
        {'p': {textContent: 'New text.'}},
        'ul', [
            {'li': {textContent: 'First list element.'}},
            'li', [text],
        ],
        select2,
        {'span': {className: 'spanclass', textContent: idx}}
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


.. _appendChildCopy:
element.appendChildCopy
----------------------------

Similar to appendChild_ but do deep copy of input structure before
passing it to appendChild. Returns new structure with DOM Nodes,
structure passed as second argument will not be changed.


.. _addOption:
element.addOption
----------------------------

Add options to the select element.

Takes three arguments: dom element, array/object with options and
optional array of selected options keys, which marks coincident
options as `selected`.

If second argument is array it will create options with the same
value and text. If second argument is object, it will create options
with the value equal object keys and text equal object values::

    var array_opts = [1,2,3];
    var obj_opts = {1: 'one', 2: 'two', 3: 'three'};
    element.addOption(select, opts, [2]);
    element.addOption(select2, opts);

Result::

    <select id="show">
        <option value="1">1</option>
        <option value="2" selected="selected">2</option>
        <option value="3">3</option>
    </select>
    <select id="show2">
        <option value="1">one</option>
        <option value="2">two</option>
        <option value="3">three</option>
    </select>


.. _getSelected:
element.getSelected
----------------------------

Returns index of selected option or -1 if none.
If Node is select-multiple tag, then array with selected values
will be returned instead of index.

Takes one argument - select element::

    select2.childNodes[1].selected = true;
    element.getSelected(select2) == 1;


.. _getSelectedValues:
element.getSelectedValues
----------------------------

Returns value of selected option.
If Node is select-multiple tag, then array of values will be returned.


.. _insert:
element.insert
----------------------------

Insert element before/after DOM Node.

Takes three arguments: base DOM Node, structure which must be
inserted before/afer base element and optional boolean parameter which
indicates that element must be inserted after base element.
Returns inserted elements structure.
If second argument is string it will be treated as Node tag.
If second argument is object it will be passed to createMany_ before
inserting.
If second argument is array it will be recursivelly converted to DOM
Nodes tree and top nodes will be inserted in order.::


    element.insert(select2, {'p': {textContent: 'New text before select.'}});
    element.insert(select2, text, true); // Move text node from li to div

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


.. _removeChildren:
element.removeChildren
----------------------------

Removes all child nodes of element.
Takes one argument: DOM Node. Returns array of children removed::

    element.removeChildren(select);

Result::

    <select id="show"></select>


.. _remove:
element.remove
----------------------------

Removes DOM Node and its children from parent.
Takes two arguments: first required argument is DOM Node to remove,
second optional argument specify if tree must be expanded (i.e.
children must be removed from Node and placed to array next to Node).
If array is passed as first argument remove operation will be done
for each element.
Returns array with removed elements and children (if second argument
specified)::

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


.. _mapTree:
element.mapTree
----------------------------

Bypass child nodes and calling argument function with the Node as the
first argument.

Takes two arguments: function to call and DOM Node which nodes will
be mapped.

Returns array with result of function call::

    //Function that return object with form data.
    function getFormData(form){
        var formData = {};
        var tags = ['INPUT', 'TEXTAREA', 'SELECT'];
        element.mapTree(function _f(elm){
            if (tags.indexOf(elm.tagName)>=0){
                if (elm.type == "checkbox")
                    formData[elm.name] = elm.checked;
                else if (elm.type == "select-multiple")
                    formData[elm.name] = element.getSelectedValues(elm);
                else if (elm.type != "button")
                    formData[elm.name] = elm.value;
            } else
                element.mapTree(_f, elm);
        }, form);
        return formData;
    }


.. _getOffset:
element.getOffset
----------------------------

Get offset between two DOM Nodes

Takes two arguments: both DOM Nodes between which offset is calculated.
Returns: object with two parameters: top and left which are first Node
offset.
In case second parameter is not passed, offset is calculated relative
to body element.


.. _addition: Additions
----------------------------

Additional utility functions is available:

isElement, isArray, isObject, isHash, isNodeList, isFunction, isString,
isNumber, isError, isUndef

This functions takes one argument and returns true if this variable has
a specific type.
