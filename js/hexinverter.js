
/*
 * 
 * Logical inverter IC with 6 channels
 * 
 * Real examples:
 *   TTL voltage: 74HC04, 74HCT04
 *   CMOS voltage: CD4046
 * 
*/

Hexinverter = function() {
    
    // import the SVG for this element
    this.svg = $('#svg').append( document.getElementById('Hexinverter').contentDocument.getElementById('layer1') );
    
    $('#rect2998').css('fill','red');
    
    /*
    // init IC terminals
    this.terminals[14] = new Terminal(VCC, 'VCC', LOGICLEVEL_CMOS, 5*Volt, this.svg.terminal14);
    this.terminals[7]   = new Terminal(GND, 'GND', LOGICLEVEL_CMOS, 0*Volt, this.svg.terminal7);
    
    this.terminals[1] = new Terminal(INPUT, LOW);
    this.terminals[2] = new Terminal(OUTPUT, HIGH);
    */
//    [1, 3, 5, 9, 11, 13].forEach( function(element, index, array) { setup(element, INPUT, LOW); } );
//    [2, 4, 6, 8, 10, 12].forEach( function(element, index, array) { this.terminals[element] = new Terminal(OUTPUT, HIGH); } );
};

// inherit Element
Hexinverter.prototype = new Element();

// replace Element contructor
Hexinverter.prototype.constructor = Hexinverter;

Hexinverter.prototype.update = function(event) {
    // invert all input terminal levels and set output terminal level appropriately
    this.terminals[2].level = this.invert(this.terminals[2].level, this.terminals[3].level);
    this.terminals[4].level = this.invert(this.terminals[4].level, this.terminals[5].level);
    this.terminals[6].level = this.invert(this.terminals[6].level, this.terminals[7].level);
    this.terminals[10].level = this.invert(this.terminals[10].level, this.terminals[9].level);
    this.terminals[12].level = this.invert(this.terminals[12].level, this.terminals[11].level);
    this.terminals[15].level = this.invert(this.terminals[15].level, this.terminals[14].level);
};
