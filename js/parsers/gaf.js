
/*
 * JavaScript implementation of the FOSS format GAF.
 * GAF is the schematics and symbols format used by the gEDA suite EDA tools.
 *
 * Specification: http://wiki.geda-project.org/geda:file_format_spec
 */

// Dependencies
$.getScript(PARSER_ROOT+'/gaf-objects.js')

/**
 * Object GAF: parse string to GAF object
 */
GAF = function(s) {

    this.objects = [];

    if (typeof s != 'undefined')
        this.importFromString(s);
    
};

/**
 * Import GAF object from GAF schematic (string)
 */
GAF.prototype.importFromString = function(s) {

    // start with an empty list of objects
    this.objects = [];
    
    // GAF is one object per line, except for attributes blocks, which are enclosed by {}
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
                // do not include {}
                i++;
                line = lines[i].trim();
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
                this.objects.push( new GAF_Object(line, text) );
            }
        }
    }
};

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
