
// terminal roles
NOT_CONNECTED = null;
VCC = 'VCC';
GND = 'GND';
INPUT = 'INPUT';
OUTPUT = 'OUTPUT';

// units
Volt = 1;
mV = 0.001;

/*
 * Logic levels
 * 
 * Read more:
 * https://de.wikipedia.org/wiki/Logikpegel
 * https://en.wikipedia.org/wiki/Logic_level
 */
LOGICLEVEL_CMOS = 'CMOS';
LOGILEVEL_TTL = 'TTL';

/*
 * Terminal prototype class
 * 
 * Holds electrical states
 * Links and allows control of the corresponding, visual SVG object
 */
Terminal = function(role, level, svg) {
    if (role == null)    role = NOT_CONNECTED;
    this.role = role;
    if (level == null)    level = LOW;
    this.level = level;
    this.svg = svg;
    };

/*
 *  Element prototype class
 *  
 *  Parent for all elements, inherits common properties and functions
 *  
 *  Read more about OOP with JavaScript:
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
 */
Element = function() {
    
    this.terminals = {};
    this.levelType = LOGICLEVEL_CMOS;
    
};

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
