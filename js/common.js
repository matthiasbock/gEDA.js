
/*
 * Convert
 *   name: {'x': 0, 'y': 0}
 * to
 *   <name x=0 y=0></key>
 */
json2jquery = function(name, attrs)
{
    var dom = $('<'+name+'>');
    for (var key in attrs)
        dom.attr(key, attrs[key]);
    return dom;
}

/*
 * Escape HTML special chars in string
 */
escapeHTML = function(string)
{
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;',
        '\n': '<br/>'
    };

    return string.replace(/[&<>"'\/\n]/g, function (s) {
        return entityMap[s];
    });
}

/*
 * Helper function:
 * Parse all specified jQuery element's attributes into a dictionary
 */
jParse = function(jElement, attributes)
{
    var result = {};
    for (var i=0; i<attributes.length; i++)
    {
        var value = jElement.attr(attributes[i])
        try {
            result[attributes[i]] = parseFloat(value);
            // fallback in case of failure without exception
            if (isNaN(result[attributes[i]]))
                result[attributes[i]] = value;
        } catch (e) {
            result[attributes[i]] = value;
        }; 
    }
    return result;
}
