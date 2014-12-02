
/*
 * JavaScript object for Eagle schematic symbols (*.sym or several in one *.lbr)
 */
EagleSymbol = function(name)
{
    this.name = name ? name : '';
    this.description = '';

    this.elements = [];
    for (key in EagleSymbolElements)
    {
        // empty list of respective component
        this.elements[key] = [];
    } 
}

/*
 * Dictionary of valid symbol sub-elements
 * with valid sub-element attributes
 */
EagleSymbolElements = {
    'polygon': [],

    // <wire x1="-6.35" y1="5.08" x2="-6.35" y2="-5.08" width="0.4064" layer="94"/>
    'wire':         ['x1','y1','x2','y2','width','layer'],

    // <text x="-6.35" y="5.715" size="1.778" layer="95">&gt;NAME</text>
    'text':         ['x','y','size','layer'],

    'dimension': [],

    // <pin name="P$1" x="10.16" y="7.62" length="middle"/>
    'pin':          ['name','x','y','length','rot','direction','function'],

    'circle': [],
    
    // <rectangle x1="-10.16" y1="-17.78" x2="10.16" y2="10.16" layer="94"/>
    'rectangle':    ['x1','y1','x2','y2','layer'],

    'frame': []
};

/*
 * Parse Eagle symbol from XML using jQuery:
 *
 * <symbol name="ADUM4190">
 * ...
 * </symbol>
 */
EagleSymbol.prototype.importjQuery = function(jElement)
{
    this.name = jElement.attr('name');
    console.log('Importing symbol: '+this.name);

    jElement.find('rectangle,wire,text,pin').each(function()
    {
        var self = $(this);
        self.children().insertAfter(self);
    });

    this.description = jElement.find('description').html();

    // parser, that uses above EagleSymbolElements to parse all valid element attributes
    parser = function(name, element)
    {
        element = $(element);
        var result = jParse(element, EagleSymbolElements[name]);
        // in case of text, also parse the text
        if (name == 'text')
            result['text'] = element.html();
        return result;
    } 

    // Parse one by one ...
    for (key in EagleSymbolElements)
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
 * Export symbol as XML using jQuery
 */
EagleSymbol.prototype.exportjQuery = function()
{
    var result = $('<symbol name="'+this.name+'">');
    if (this.name == '')
        console.error('Warning: Symbol has no name');
    
    for (key in this.elements)
    {
        for (var i=0; i<this.elements[key].length; i++)
        {
            result.append(json2jquery(key, this.elements[key][i]));
        }
    }

    return result;
}

EagleSymbol.prototype.exportString = function(noSelfClosing)
{
    var result = this.exportjQuery()
        .prop('outerHTML')
        .replace(/></g,'>\n<');
    if (!noSelfClosing)
        result = result.replace(/(\<[a-z]* [^>]*)\>[\s]*\<\/[a-z]*\>/g, '$1/>');
    return result;
}

/*
 * Export symbol as Scalable Vector Graphic using jQuery
 */
EagleSymbol.prototype.exportSVG = function()
{
    var svg = '<svg width="300" height="300">';
    svg += '<g transform="translate(120,100) scale(10)">';

    for (key in this.elements)
    {
        for (var i=0; i<this.elements[key].length; i++)
        {
            console.log(key);
            svg += EagleSymbolRenderSVG[key]( this.elements[key][i] );
        }
    }

    svg += '</g></svg>';
    return svg;
}

