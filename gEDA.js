
// Voltage units
Volt = 1;
mV = 0.001;

/*
 * Logic levels
 * 
 * Read more:
 * https://de.wikipedia.org/wiki/Logikpegel
 * https://en.wikipedia.org/wiki/Logic_level
 */
CMOS = 'CMOS';
TTL = 'TTL';

/*
 * Load SVGs (doesn't work due to browser restrictions)
 */
loadSVG = function(url, idElement, idObject, element) {
    /*
    $('body').append('<object id="'+idObject+'" data="'+url+'" type="image/svg+xml" style="width:0px;height:0px;visibility:hidden;"></object>');
    var object = document.getElementById(idObject);
    object.addEventListener('load',
            function() {
                var svg = object.contentDocument.getElementById(idElement);
                element.svg = svg;
                console.log(svg);
            }, false);
    */
    var svg = document.getElementById(idObject).contentDocument.getElementById(idElement);
    console.log(svg);
    return svg;
};

coord = function(point) {
    return point.x+','+point.y;
};

moveElement = function(element) {
    if (! (element instanceof Wire))
        element.setXY(element.x + d3.event.dx, element.y + d3.event.dy);
};

moveSchematic = function(schematic) {
    for (var i=0; i<schematic.elements.length; i++)
        if (! (schematic.elements[i] instanceof Wire))
            moveElement(schematic.elements[i]);
};

//Capture JS errors from js files called using the $.getScript function
$.extend({
    getScript: function (url, callback) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = url;
        // Handle Script loading
        {
            var done = false;
            // Attach handlers for all browsers
            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                    done = true;
                    if (callback) callback();
                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                }
            };
        }
        head.appendChild(script);
        // We handle everything using the script element injection
        return undefined;
    },
});

$.getScript('js/schematic.js');
$.getScript('js/terminals.js');
$.getScript('js/wire.js');
$.getScript('js/battery.js');
$.getScript('js/led.js');
