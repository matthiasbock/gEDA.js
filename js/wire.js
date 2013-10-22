
numberOfWires = 0;

/*
 * Simplest element: a wire
 * 
 * one line
 * two ends: From, To
 * two terminals
 */

Wire = function(parentSchematic, debug, randomXY) {
    
    this.name = 'wire'+(numberOfWires++);
    this.parentSchematic = parentSchematic;
    this.parentSchematic.append(this);
    this.debug = debug ? debug : (this.parentSchematic.debug ? this.parentSchematic.debug : false);
    randomXY = randomXY ? randomXY : true;
    
    this.path = this.parentSchematic.newPathElement().attr('id',this.name);
    this.circleFrom = this.parentSchematic.newCircleTerminal('terminalWire');
    this.circleTo = this.parentSchematic.newCircleTerminal('terminalWire');
    
    this.terminals = [new Terminal(this), new Terminal(this)];
    this.terminals[0].hookSVG(this.circleFrom);
    this.terminals[1].hookSVG(this.circleTo);
    this.terminals[0].onSetVoltage = function() { this.parentElement.terminals[1].setVoltage(this.voltage); };
    this.terminals[1].onSetVoltage = function() { this.parentElement.terminals[0].setVoltage(this.voltage); };
    
    var x = 50;
    var y = 50;
    if (randomXY) {
        x = Math.random()*(parseInt($('#svg').css('width'))-50);
        y = Math.random()*(parseInt($('#svg').css('height'))-10);
    }
    this.from = this.to = {x:0,y:0};
    this.setFrom(x,y).setTo(x+50,y);
};

Wire.prototype.getName = function() {
    return this.parentSchematic.getName()+' > '+this.name;
};

/*
 * Set SVG coordinates of "From" terminal
 * and invoke "refresh"
 */
Wire.prototype.setFrom = function(x, y, updateTerminals) {
    
    if (typeof x == 'object') {
        y = x.y;
        x = x.x;
    }
    if (this.from.x != x || this.from.y != y) {
        this.from = {x:x, y:y};
        this.draw(updateTerminals);
    }
    return this;
};

/*
 * Set SVG coordinates of "To" terminal
 * and invoke "refresh"
 */
Wire.prototype.setTo = function(x, y, updateTerminals) {
    
    if (typeof x == 'object') {
        y = x.y;
        x = x.x;
    }
    if (this.to.x != x || this.to.y != y) {
        this.to = {x:x, y:y};
        this.draw(updateTerminals);
    }
    return this;
};

/*
 * Redraw the wire's SVG
 */
Wire.prototype.draw = function(updateTerminals) {
    
    if (this.from == undefined || this.to == undefined)
        return;
    
    if (this.from.x == this.to.x || this.from.y == this.to.y) {
        this.path.attr('d','M'+coord(this.from)+' L'+coord(this.to));
    } else {
        // go the long way first
        var a;
        if (Math.abs(this.to.x-this.from.x) > Math.abs(this.to.y-this.from.y))
            a = {x:this.to.x, y:this.from.y};
        else
            a = {x:this.from.x, y:this.to.y};
        this.path.attr('d','M'+coord(this.from)+' L'+coord(a)+' L'+coord(this.to));
    }
    
    this.terminals[0].setXY(this.from, updateConnectedTerminals=updateTerminals);
    this.terminals[1].setXY(this.to, updateConnectedTerminals=updateTerminals);
};
