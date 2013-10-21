
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
