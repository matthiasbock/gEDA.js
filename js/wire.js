
/*
 * Simplest element: a wire
 * 
 * one line
 * two ends: From, To
 * two terminals
 */

Wire = function(parentSchematic, debug, randomXY) {
    
    this.parentSchematic = parentSchematic;
    this.parentSchematic.append(this);
    this.debug = debug ? debug : (this.parentSchematic.debug ? this.parentSchematic.debug : false);
    randomXY = randomXY ? randomXY : true;
    
    this.path = this.parentSchematic.newPathElement();
    this.circleFrom = this.parentSchematic.newCircleTerminal();
    this.circleTo = this.parentSchematic.newCircleTerminal();
    
    var x = 50;
    var y = 50;
    if (randomXY) {
        x = Math.random()*(parseInt($('#svg').css('width'))-50);
        y = Math.random()*(parseInt($('#svg').css('height'))-10);
    }
    this.setFrom(x,y).setTo(x+50,y);
    
    this.terminals = [];
    this.terminals.push( new Terminal(this) );
    this.terminals.push( new Terminal(this) );
    this.terminals[0].connectTerminal( this.terminals[1] );
    this.terminals[0].hookSVG(this.circleFrom);
    this.terminals[1].hookSVG(this.circleTo);
};

/*
 * Set SVG coordinates of "From" terminal
 * and invoke "refresh"
 */
Wire.prototype.setFrom = function(x, y) {
    if (typeof y == 'undefined')
        this.from = x;
    else
        this.from = {x:x, y:y};
    this.draw();
    return this;
};

/*
 * Set SVG coordinates of "To" terminal
 * and invoke "refresh"
 */
Wire.prototype.setTo = function(x, y) {
    if (typeof y == 'undefined')
        this.to = x;
    else
        this.to = {x:x, y:y};
    this.draw();
    return this;
};

/*
 * Redraw the wire's SVG
 */
Wire.prototype.draw = function() {
    
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
    
    this.circleFrom.attr('cx',this.from.x);
    this.circleFrom.attr('cy',this.from.y);
    this.circleTo.attr('cx',this.to.x);
    this.circleTo.attr('cy',this.to.y);
};

