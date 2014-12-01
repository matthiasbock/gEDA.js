
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
