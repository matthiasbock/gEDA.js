
/*
 * Mother of all elements
 */

Element = function() {};

Element.prototype.getName = function() {
    return this.parentSchematic.getName()+' > '+this.name;
};

Element.prototype.setXY = function(x, y) {
    
    if (typeof x == 'object') {
        y = x.y;
        x = x.x;
    }
    if (this.x != x || this.y != y) {
        this.x = x;
        this.y = y;
        this.refresh();
    }
    return this;
};

Element.prototype.refresh = function() {
    
    // move bounding box
    this.bbox.attr('x',this.x-40).attr('y',this.y-30);
    
    // move symbol
    this.path.attr('transform', 'translate('+this.x+','+this.y+')');
    
    // move terminals
    this.terminals[0].setXY(this.x-30, this.y);
    this.terminals[1].setXY(this.x+30, this.y);
};

$.getScript('js/battery.js');
$.getScript('js/resistor.js');
$.getScript('js/led.js');
