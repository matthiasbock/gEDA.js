
/*
 * JavaScript object for Eagle PCB packages (*.pac or several in one *.lbr)
 */
EaglePackage = function()
{
    this.name = '';
    this.description = '';
    this.pads = [];
    this.holes = [];
    this.texts = [];
}

EagleViaShape = [
    'round'
];

// <smd name="16" x="-4.445" y="2.695" dx="0.635" dy="1.524" layer="1"/>
parseEaglePad = function(jElement)
{
    return jParse(jElement, ['name','x','y','dx','dy','layer']);
}

// <text x="-5.08" y="-2.54" size="1.27" layer="25" rot="R90">&gt;NAME</text>
parseEagleText = function(jElement)
{
    return jParse(jElement, ['x','y','size','layer','rot']);
}

/*
 * Parse Eagle package from XML using jQuery:
 *
 * <package name="SOIC16">
 * ...
 * </package>
 */
EaglePackage.prototype.fromDOM = function(jElement)
{
    this.name = jElement.attr('name');
    console.log('Importing symbol: '+this.name);
        
    var e = jElement.find('description');
    if (e.length == 1)
    {
        this.description = e.html();
        console.log('Description: '+this.description);
    } else {
        console.error('Error: '+e.length+' <description/> elements. Must be exactly one.');
    }

    // Which elements shall we parse?
    var parseMe = {
        'smd': [
            parseEaglePad,
            this.pads,
            ],
        'text': [
            parseEagleText,
            this.texts
            ]
    }
    // Parse one by one ...
    for (key in parseMe)
    {
        // Find all of this type
        var e = jElement.find(key);
        console.log('Found '+e.length+' elements of type <'+key+'>.');
        for (var i=0; i<e.length; i++)
        {
            // invoke specified parser onto element
            // append result to array
            parseMe[key][1].push( parseMe[key][0](e) );
        }
    }
}

/*
 * Add hole to current package
 */
EaglePackage.prototype.addHole = function(x, y, drill)
{
    this.holes.push({
        'x':     x,
        'y':     y,
        'drill': drill
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
    
    var exportElements = {
        'hole': this.holes
        };
    for (key in exportElements)
    {
        for (var i=0; i<exportElements[key].length; i++)
        {
            result.append(json2jquery(key, exportElements[key][i]));
        }
    }

    return result;
}

/*
 * Export package as string
 */
EaglePackage.prototype.exportString = function()
{
    return this.exportjQuery()
            .prop('outerHTML')
            .replace(/></g,'>\n<')
            .replace(/(\<[a-z]* [^>]*)\>[\s]*\<\/[a-z]*\>/g, '$1/>');
}
