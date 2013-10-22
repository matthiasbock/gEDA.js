
/*
 * The schematic object stores a list of elements
 * and a link to the main SVG canvas
 */

Schematic = function(d3_parent, debug) {
    
    this.debug = debug ? debug : false;
    this.svg = d3_parent.append("svg:svg").attr('id', 'svg');
    this.svg.style('width',$('body').css('width'));
    this.svg.style('height',parseInt($('body').css('height'))*0.8);
    this.elements = [];
};

Schematic.prototype.append = function(element) {
    if (this.elements.indexOf(element) < 0)
        this.elements.push(element);
};

Schematic.prototype.newCircleTerminal = function() {
    return this.svg.append('svg:circle').attr('class','circleTerminal').attr('r','5');
};

Schematic.prototype.newPathElement = function() {
    return this.svg.append('svg:path').attr('class','pathElement');
};

Schematic.prototype.newBoundingBox = function() {
    return this.svg.append('svg:rect').attr('class','rectBoundingBox');
};
