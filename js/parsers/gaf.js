
/*
 * JavaScript implementation of the FOSS format GAF.
 * GAF is the schematics and symbols format used by the gEDA suite EDA tools.
 *
 * Specification: http://wiki.geda-project.org/geda:file_format_spec
 *
 * This library only imports GAF from text. No object is created and filled with values.
 */

// Dependencies
$.getScript(PARSER_ROOT+'/gaf-constants.js')
$.getScript(PARSER_ROOT+'/gaf-objects.js')

/**
 * Object GAF: parse string to GAF object
 */
GAF = function(s)
{

    this.objects = [];
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;

    if (typeof s != 'undefined')
        this.fromString(s);
    
};

/**
 * Import GAF object from GAF schematic (string)
 */
GAF.prototype.fromString = function(s)
{
    console.log('Importing GAF from string ...');

    // start with an empty list of objects
    this.objects = [];
    x = [];
    y = [];
    
    /*
     * GAF schematics are text and define one object per line
     * except for attributes blocks, which are enclosed by {}
     * and embedded components, which are enclosed by []
     */
    var lines = s.split('\n');
    for (var i=0; i<lines.length; i++)
    {
        var line = lines[i].trim();
        // don't parse blank lines
        if (line.length > 0)
        {
            // it is an attribute section
            if (line.indexOf('{') > -1)
            {
                // make a string from attributes section and parse it
                var attrs = '';
                // neither include the leading "{"
                i++;
                line = lines[i].trim();
                // nor the trailing "}"
                while (line.indexOf('}') == -1)
                {
                    attrs += line+'\n';
                    i++;
                    line = lines[i].trim();
                }
                // add attribute lines to the existing(!) last created object
                this.objects[this.objects.length-1].parseAttributes(attrs);
            }
            
            // it is an object
            else {
                /* The text object requires special treatment,
                 * because num_lines of text follow
                 * which need also to be imported
                 */
                var text = '';
                if (line.substr(0,1) == 'T')
                {
                    // the last field is num_lines
                    var p = line.split(' ');
                    var num_lines = p[p.length-1];
                    // add num_lines to following string 
                    for (var j=1; j<=num_lines; j++)
                    {
                        // skip one line
                        i++;
                        if (text.length > 0)
                            text += '\n';
                        text += lines[i];
                    }
                }
                
                // create new GAF object from line string and append to objects array
                var obj = new GAF_Object(line, text);
                this.objects.push(obj);

                // object has x1,y1,x2,y2
                if ([GAF_OBJECT_LINE, GAF_OBJECT_NET, GAF_OBJECT_BUS, GAF_OBJECT_PIN].indexOf(obj.type) > -1)
                {
                    x.push(obj.x1); y.push(obj.y1);
                    x.push(obj.x2); y.push(obj.y2);
                }
                
                // object has x,y,width,height
                else if ([GAF_OBJECT_PICTURE,GAF_OBJECT_BOX].indexOf(obj.type) > -1)
                {
                    x.push(obj.x); y.push(obj.y);
                    x.push(obj.x+obj.width); y.push(obj.y+obj.height);
                }
                
                // object has x,y
                else if ([GAF_OBJECT_TEXT,GAF_OBJECT_COMPONENT,GAF_OBJECT_ARC,GAF_OBJECT_CIRCLE].indexOf(obj.type) > -1)
                {
                    x.push(obj.x); y.push(obj.y);
                }
            }
        }
    }
    
    // calculate minimum and maximum coordinates of this component
    this.minX = d3.min(x);
    this.maxX = d3.max(x);
    this.minY = d3.min(y);
    this.maxY = d3.max(y);
};

/*
 * Move model by (deltaX,deltaY)
 */
GAF.prototype.shift = function(deltaX,deltaY)
{
    console.log('Shifting GAF schematic by ('+deltaX+','+deltaY+') ...');
    
    // shift all objects
    for (var i=0; i<this.objects.length; i++)
    {
        var obj = this.objects[i];
        
        // object has x1,y1,x2,y2
        if ([GAF_OBJECT_LINE, GAF_OBJECT_NET, GAF_OBJECT_BUS, GAF_OBJECT_PIN].indexOf(obj.type) > -1)
        {
            obj.x1 += deltaX; obj.y1 += deltaY;
            obj.x2 += deltaX; obj.y2 += deltaY;
        }
        
        // object has x,y
        else if ([GAF_OBJECT_PICTURE,GAF_OBJECT_BOX,GAF_OBJECT_TEXT,GAF_OBJECT_COMPONENT,GAF_OBJECT_ARC,GAF_OBJECT_CIRCLE].indexOf(obj.type) > -1)
        {
            obj.x += deltaX; obj.y += deltaY;
        }

        // invalid object type for shift        
        else {
            console.error('Failed to shfit object:');
            console.error(obj);
        }
    }
    
    // adjust bounding box coordinates according to shift
    this.minX += deltaX;
    this.minY += deltaY;
    this.maxX += deltaX;
    this.maxY += deltaY;
}

/*
 * Use min/max coordinates from import to shift model to (0,0)
 */  
GAF.prototype.crop = function()
{
    this.shift(-this.minX, -this.minY);
}

/*
 * Use jQuery to create an XML-like DOM element from this GAF object
 */
GAF.prototype.exportDOM = function(parent)
{
    // export all objects in this GAF model
    for (var i=0; i<this.objects.length; i++)
    {
        parent.append( this.objects[i].exportDOM() );
    }

    // return DOM object
    return parent;
}

/**
 * Return an array of objects matching the filter object type
 */
GAF.prototype.filterType = function(filter)
{
    var results = [];
    
    for (var i=0; i<this.objects.length; i++)
    {
        if (this.objects[i].type == filter)
            results.push(this.objects[i]);
    }

    return results;
}
