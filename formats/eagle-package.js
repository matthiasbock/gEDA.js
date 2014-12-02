
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

    this.elements = {};
    for (key in EaglePackageElements)
    {
        // empty list of respective component
        this.elements[key] = [];
    } 
}

/*
 * Dictionary of valid package sub-elements
 * with valid sub-element attributes
 */
EaglePackageElements ={
    'polygon':   ['name','width','layer'],

    // <wire x1="-1.4" y1="-0.8" x2="-1.4" y2="0.8" width="0.127" layer="51"/>
    'wire':      ['x1','y1','x2','y2','width','layer'],

    // <text x="-5.08" y="-2.54" size="1.27" layer="25" rot="R90">&gt;NAME</text>
    'text':      ['x','y','size','layer','rot'],

    'dimension': [],
    
    // <circle x="3.59" y="-0.7699" radius="0.4999" width="0.1016" layer="51"/>
    'circle':    ['x','y','radius','width','layer'],

    // <rectangle x1="1" y1="47" x2="13" y2="52" layer="1"/>
    'rectangle': ['x1','y1','x2','y2','layer'],

    'frame':     [],
    'hole':      [],

    // <pad name="4" x="1.25" y="2.71" drill="0.95" shape="octagon"/>
    // <pad name="8" x="8.89" y="0" drill="1.016" shape="long" rot="R90"/>
    'pad':       ['name','x','y','drill','shape','rot'],

    // <smd name="16" x="-4.445" y="2.695" dx="0.635" dy="1.524" layer="1"/>
    'smd':       ['name','x','y','dx','dy','layer'],
};

// recognized via shapes
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

    // parser, that uses above EaglePackageElements to parse all valid element attributes
    parser = function(name, element)
    {
        element = $(element);
        var result = jParse(element, EaglePackageElements[name]);
        // in case of text, also parse the text
        if (name == 'text')
            result['text'] = element.html();
        // in case of polygon, also parse vertex sub-elements
        else if (name == 'polygon')
        {
            result.vertices = [];
            element.children('vertex').each(function()
            {
                var self = $(this);
                result.vertices.push({
                    'x': self.attr('x'),
                    'y': self.attr('y')
                    });
            });
        }
        return result;
    } 

    // Parse one by one ...
    for (key in EaglePackageElements)
    {
        // Find all of this element type
        var e = jElement.find(key);
        for (var i=0; i<e.length; i++)
        {
            // invoke parser onto element
            // append result to array
            this.elements[key].push( parser(key, e[i]) );
        }
        console.log(e.length+' elements of type <'+key+'/>');
    }
    
    return this;
}

/*
 * Add hole to current package
 */
EaglePackage.prototype.add = function(name, attrs)
{
    this.elements[name].push(attrs);
}

/*
 * Export package as XML using jQuery
 */
EaglePackage.prototype.exportjQuery = function()
{
    var result = $('<package name="'+this.name+'">');
    if (this.name == '')
        console.error('Warning: Package has no name');
    
    for (key in this.elements)
    {
        for (var i=0; i<this.elements[key].length; i++)
        {
            result.append(json2jquery(key, this.elements[key][i]));
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
 * Export package as Scalable Vector Graphic using jQuery
 */
EaglePackage.prototype.exportSVG = function()
{
    var svg = '<svg width="300" height="300">';
    svg += '<g transform="translate(120,100) scale(10)">';

    for (key in this.elements)
    {
        for (var i=0; i<this.elements[key].length; i++)
        {
            svg += EaglePackageRenderSVG[key]( this.elements[key][i] );
        }
    }

    svg += '</g></svg>';
    return svg;
}
