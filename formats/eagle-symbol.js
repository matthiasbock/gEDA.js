
/*
 * JavaScript object for Eagle schematic symbols (*.sym or several in one *.lbr)
 */
EagleSymbol = function()
{
    this.name = '';
    this.description = '';
    this.rectangles = [];
    this.pins = [];
}

// <rectangle x1="-10.16" y1="-17.78" x2="10.16" y2="10.16" layer="94"/>
parseEagleRectangle = function(jElement)
{
    return jParse(jElement, ['x1','y1','x2','y2','layer']); 
}

// <pin name="P$1" x="10.16" y="7.62" length="middle"/>
parseEaglePin = function(jElement)
{
    return jParse(jElement, ['name','x','y','length']);
}

/*
 * Parse Eagle symbol from XML using jQuery:
 *
 * <symbol name="ADUM4190">
 * ...
 * </symbol>
 */
EagleSymbol.prototype.fromDOM = function(jElement)
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
        'rectangle': [
            parseEagleRectangle,
            this.rectangles
            ],
        'pin': [
            parseEaglePin,
            this.pins
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

