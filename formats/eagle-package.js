
/*
 * JavaScript object for Eagle PCB packages (*.pac or several in one *.lbr)
 *
 * <!ELEMENT package (description?, (polygon | wire | text | dimension | circle | rectangle | frame | hole | pad | smd)*)>
 * <!ATTLIST package
 *         name          %String;       #REQUIRED
 *         >
 */
EaglePackage = function(name)
{
    this.name = name ? name : '';
    this.description = '';
    this.components = {
        'polygon':   [],
        'wire':      [],
        'text':      [],
        'dimension': [],
        'circle':    [],
        'rectangle': [],
        'frame':     [],
        'hole':      [],
        'pad':       [],
        'smd':       []
        };
}

EagleViaShape = [
    'round'
];

/*
 * Parse Eagle package from XML using jQuery:
 *
 * <package name="SOIC16">
 * ...
 * </package>
 */
EaglePackage.prototype.importjQuery = function(jElement)
{
    console.log('Importing package: "'+this.name+'"');

    // <package name="...">
    this.name = jElement.attr('name');
    
    /*
     * Browser problem:
     * Eagle XML is not valid HTML. Browsers fail trying to understand the
     * self-closing tags that most of the Eagle elements contain.
     * Accordingly, elements following self-closing elements are falsely
     * interpreted as sub-elements.
     * Fix:
     * Find all sub-elements to element and move them after element
     */
    jElement.find('wire,text,dimension,circle,rectangle,frame,hole,pad,smd,vertex').each(function()
    {
        var self = $(this);
        self.children().insertAfter(self);
    });

    // <description>...</description>
    var e = jElement.find('description');
    if (e.length == 1)
    {
        this.description = e.html();
        console.log('Description: '+this.description);
    } else {
        console.error('Error: '+e.length+' <description/> elements. Must be exactly one.');
    }

    // Which elements shall we parse and how?
    var parserFunctions = {
        // <wire x1="-1.4" y1="-0.8" x2="-1.4" y2="0.8" width="0.127" layer="51"/>
        'wire': function(jElement)
                {
                    return jParse(jElement, ['x1','y1','x2','y2','width','layer']);
                },
        // <pad name="4" x="1.25" y="2.71" drill="0.95" shape="octagon"/>
        'pad':  function(jElement)
                {
                    return jParse(jElement, ['name','x','y','drill','shape']);
                },
        // <smd name="16" x="-4.445" y="2.695" dx="0.635" dy="1.524" layer="1"/>
        'smd':  function(jElement)
                {
                    return jParse(jElement, ['name','x','y','dx','dy','layer']);
                },
        // <text x="-5.08" y="-2.54" size="1.27" layer="25" rot="R90">&gt;NAME</text>
        'text': function(jElement)
                {
                    return jParse(jElement, ['x','y','size','layer','rot']);
                },
        };

    // Parse one by one ...
    for (key in parserFunctions)
    {
        // Find all of this type
        var e = jElement.find(key);
        for (var i=0; i<e.length; i++)
        {
            // invoke specified parser onto element
            // append result to array
            this.components[key].push( parserFunctions[key]($(e[i])) );
        }
        console.log(e.length+' elements of type <'+key+'/>');
    }
    
    return this;
}

/*
 * Add hole to current package
 */
EaglePackage.prototype.addHole = function(x, y, drill)
{
    this.components['hole'].push(
    {
        'x':     x,
        'y':     y,
        'drill': drill
    });
}

EaglePackage.prototype.addPad = function(name, x, y, drill, shape)
{
    this.components['pad'].push(
    {
        'name':  name,
        'x':     x,
        'y':     y,
        'drill': drill,
        'shape': shape
    });
}

/*
 * Export package as XML using jQuery
 */
EaglePackage.prototype.exportjQuery = function()
{
    var result = $('<package name="'+this.name+'">');
    if (this.name == '')
        console.error('Warning: Package has no name');
    
    for (key in this.components)
    {
        for (var i=0; i<this.components[key].length; i++)
        {
            result.append(json2jquery(key, this.components[key][i]));
        }
    }

    return result;
}

/*
 * Export package as string
 */
EaglePackage.prototype.exportString = function(noSelfClosing)
{
    var result = this.exportjQuery()
        .prop('outerHTML')
        .replace(/></g,'>\n<');
    if (!noSelfClosing)
        result = result.replace(/(\<[a-z]* [^>]*)\>[\s]*\<\/[a-z]*\>/g, '$1/>');
    return result;
}

/*
 * How to draw SVG elements for each Eagle package sub-element
 */
EagleRenderSVG = {
    'polygon':  function(polygon) {
                    return '';
                },
    'wire':     function(wire) {
                    return '';
                },
    'text':     function(text) {
                    return '';
                },
    'dimension':function(dimension) {
                    return '';
                },
    'circle':   function(circle) {
                    return '';
                },
    'rectangle':function(rectangle) {
                    return '';
                },
    'frame':    function(frame) {
                    return '';
                },
    'hole':     function(hole) {
                    return '<circle class="hole" cx="'+hole.x+'px" cy="'+hole.y+'px" r="'+(hole.drill/2)+'px"/>';
                },
    'pad':      function(pad) {
                    return '';
                },
    'smd':      function(smd) {
                    return '<rect class="smd" id="smd'+smd.name+'" x="'+(smd.x-(smd.dx/2))+'" y="'+(smd.y-(smd.dy/2))+'" width="'+smd.dx+'" height="'+smd.dy+'" layer="'+smd.layer+'"/>';
                }
};

/*
 * Export package as Scalable Vector Graphic using jQuery
 */
EaglePackage.prototype.exportSVG = function()
{
    var svg = '<svg width="200" height="200">';
    svg += '<g transform="translate(100,100) scale(10)">';

    for (key in this.components)
    {
        for (var i=0; i<this.components[key].length; i++)
        {
            svg += EagleRenderSVG[key]( this.components[key][i] );
        }
    }

    svg += '</g></svg>';
    return svg;
}
