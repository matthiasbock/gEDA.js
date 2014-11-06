
/**
 * GAF object
 */


/*
 * "GAF object" object
 * Usually one object per line
 */
GAF_Object = function(s, text)
{
    s = s.trim();
    console.log('Parsing GAF object from string "'+s+'":');

    // first character: type
    this.type = s.substr(0,1);
    // rest of the line: parameters
    parameters = s.split(' ');
    // optionally following lines in {}: attributes
    
    if (this.type in GAF_OBJECT_TYPES)
    {
        // this object is of type:
        objectType = GAF_OBJECT_TYPES[this.type];
        if (objectType.length == parameters.length)
        {
            // assign space separated parameters
            for (var i=0; i<objectType.length; i++)
            {
                try {
                    var p = parseFloat(parameters[i]);
                } catch (e) {
                    var p = parameters[i];
                }
                this[objectType[i]] = isNaN(p) ? parameters[i] : p;
            }
            console.log(this);
        }
        else {
            console.error('Parameter count mismatch: expected '+objectType.length+', got '+parameters.length);
        }
        
        // Text imports following lines
        if (typeof text != 'undefined' && text.length > 0)
        {
            if (this.type != 'T')
                console.log('Weird: Object type is not text, but still the following lines are to be imported.');
            this.text = text;
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
    this.attributes = {};
    var lines = attrs.split('\n');
    var i = 0;
    while (i < lines.length)
    {
        var line = lines[i].trim();
        if (line.length > 0)
        {
            // attributes can only be Text
            if (line.substr(0,1) != 'T')
            {
                console.error('Error: Expected text, got "'+line.substr(0,1)+'".');
                return; // must abort here, because text parsing below will fail
            }
    
            // the last field is num_lines
            var p = line.split(' ');
            var num_lines = p[p.length-1];
            if (num_lines != 1)
            {
                console.error('Warning: Expected one attribute line, got '+num_lines+'.');
                // this will cause errors below, but aborting will not rescue the problem
            }

            // attributes are one line and one line only
            var text = lines[++i], key="", value="";
            // attributes are name=value pairs
            if (text.indexOf('=') == -1)
            {
                console.error('Warning: Attribute name and value not separated by "=" in "'+text+'"');
                key = text;
                value = '';
            }
            else {
                var s = text.split('=');
                key = s[0];
                value = s.length > 1 ? s[1] : '';
            }
    
            // append parsed attribute to dictionary        
            this.attributes[key] = value;
        }
        
        // continue iterating through attributes lines
        i++;
    }
}

/**
 * Export object with all it's parameters as DOM element
 */
GAF_Object.prototype.exportDOM = function()
{
    // create new DOM element using jQuery
    var myType = GAF_OBJECT_TYPES[this.type];
    var dom = $('<'+myType[0]+'/>');
    
    // copy all object parameters to DOM element
    for (var i=1; i<myType.length; i++)
    {
        dom.attr(myType[i], this[myType[i]]);
    }

    // this object has attributes?
    if (typeof this.attributes != 'undefined' && this.attributes != null)
    {
        // append all attributes
        for (var j=0; j<this.attributes.length; j++)
        {
            // new DOM element
            var attr = $('<attribute/>');
//            attr.html(this.attributes[j].text);

            // copy all Text object attributes
            var attrType = GAF_OBJECT_TYPES['attribute'];
            for (var i=1; i<attrType.length; i++)
            {
                //console.log(attrType[i]);
                attr.attr(attrType[i], this.attributes[j][attrType[i]]);
            }
            
            dom.append(attr);
        }
    }
    
    return dom;
}
