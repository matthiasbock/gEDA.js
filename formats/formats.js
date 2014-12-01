
/*
 * Helper function:
 * Parse all specified jQuery element's attributes into a dictionary
 */
jParse = function(jElement, attributes)
{
    var result = {};
    for (var i=0; i<attributes.length; i++)
    {
        result[attributes[i]] = jElement.attr(attributes[i]); 
    }
    return result;
}

//
// import the other formats from here
//
