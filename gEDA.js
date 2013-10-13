
// terminal roles
NOT_CONNECTED = null;
VCC = 'VCC';
GND = 'GND';
INPUT = 'INPUT';
OUTPUT = 'OUTPUT';

// units
Volt = 1;
mV = 0.001;

// logic levels
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
 */
Element = function() {
    
    this.terminals = {};
    this.levelType = LOGICLEVEL_CMOS;
    
};
