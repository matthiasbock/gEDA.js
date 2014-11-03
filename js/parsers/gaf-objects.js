
/**
 * GAF object prototype
 */

/*
 * Constants: Character defining the object's type
 */
GAF_OBJECT_TYPES = {
    'v': [
        'version',
        'version',
        'fileformat_version'
    ],
    'T': [
        'text',
        'x',
        'y',
        'color',
        'size',
        'visibility',
        'show_name_value',
        'angle',
        'alignment',
        'num_lines'
    ],
    'N': [
        'net',
        'x1',
        'y1',
        'x2',
        'y2',
        'color'
    ],
    'C': [
        'component',
        'x',
        'y',
        'selectable',
        'angle',
        'mirror',
        'basename'
    ]
};

/*
 * "GAF object" object
 * Usually one object per line
 */
GAF_Object = function(s)
{
    s = s.trim();
    console.log('New GAF object: '+s);

    // first character: type
    this.type = s.substr(0,1);
    // rest of the line: parameters
    parameters = s.split(' ');
    // optionally following lines in {}: attributes
    this.attributes = {};
    
    if (this.type in GAF_OBJECT_TYPES)
    {
        // this object is of type:
        objectType = GAF_OBJECT_TYPES[this.type];
        if (objectType.length == parameters.length)
        {
            // assign space separated parameters
            for (var i=0; i<objectType.length; i++)
            {
                this[objectType[i]] = parameters[i];
            }
            console.log(this);
        }
        else {
            console.error('Parameter count mismatch: expected '+objectType.length+', got '+parameters.length);
        }
    }
    else {
        console.log('Unknown GAF object type: '+this.type);
    }
}

/*
 * GAF objects can have additional attributes
 * enclosed in {}.
 *
 * Parse object attributes string.
 */
GAF_Object.prototype.parseAttributes = function(attrs)
{
    console.log('TODO: parse attributes');
    console.log(attrs);
}

/**
 * Export object with all it's parameters as DOM element
 */
GAF_Object.prototype.exportDOM = function()
{
    // create new DOM element using jQuery
    var myType = GAF_OBJECT_TYPES[this.type];
    var dom = $('<'+myType[0]+'/>');
    
    // copy this object's parameters to DOM element
    for (var i=1; i<myType.length; i++)
    {
        dom.attr(myType[i], this[myType[i]]);
    }
    
    return dom;
}
