
/*
 * Simplest element: a wire
 * 
 * one line
 * two ends: From, To
 * two terminals
 */

Wire = function(debug, randomXY) {
    
    this.debug = debug ? debug : false;
    randomXY = randomXY ? randomXY : true;
    
    this.path = svg.append('svg:path').attr('stroke','black').attr('fill','transparent');
    this.circleFrom = circleTerminal();
    this.circleTo = circleTerminal();
    
    var x = 50;
    var y = 50;
    if (randomXY) {
        x = Math.random()*(parseInt($('#svg').css('width'))-50);
        y = Math.random()*(parseInt($('#svg').css('height'))-10);
    }
    this.setFrom(x,y).setTo(x+50,y);
    
    this.terminals = [];
    this.terminals.push( new Terminal(debug=this.debug) );
    this.terminals.push( new Terminal(debug=this.debug) );
    this.terminals[0].connectTerminal( this.terminals[1] );
    
};

/*
 * Set SVG coordinates of "From" terminal
 * and invoke "refresh"
 */
Wire.prototype.setFrom = function(x, y) {
    if (y == undefined)
        this.from = x;
    else
        this.from = {x:x, y:y};
    this.refresh();
    return this;
};

/*
 * Set SVG coordinates of "To" terminal
 * and invoke "refresh"
 */
Wire.prototype.setTo = function(x, y) {
    if (y == undefined)
        this.to = x;
    else
        this.to = {x:x, y:y};
    this.refresh();
    return this;
};

/*
 * Redraw the wire's SVG
 */
Wire.prototype.refresh = function() {
    
    if (this.from == undefined || this.to == undefined)
        return;
    
    if (this.from.x == this.to.x || this.from.y == this.to.y) {
        this.path.attr('d','M'+coord(this.from)+' L'+coord(this.to));
    } else {
        var a = {x:this.to.x, y:this.from.y};
        this.path.attr('d','M'+coord(this.from)+' L'+coord(a)+' L'+coord(this.to));
    }
    
    this.circleFrom.attr('cx',this.from.x);
    this.circleFrom.attr('cy',this.from.y);
    this.circleTo.attr('cx',this.to.x);
    this.circleTo.attr('cy',this.to.y);
};
