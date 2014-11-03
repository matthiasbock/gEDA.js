
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

    this.objects = [];
    
    // GAF is one object per line, except for attributes blocks, which are enclosed by {}
    var lines = s.split('\n');
    for (var i=0; i<lines.length; i++)
    {
        var line = lines[i].trim();
        // don't parse blank lines
        if (line.length > 0)
        {
            // beginning of an attribute section
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
            
            // object
            else {
                // create new GAF object from line string and append to objects array
                this.objects.push( new GAF_Object(line) );
            }
        }
    }
};
