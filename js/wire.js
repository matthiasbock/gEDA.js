
/*
 * Simplest element: a wire
 * 
 * one line
 * two ends
 * two terminals
 */

Wire = function() {
    
    this.path = svg.append('svg:path').attr('stroke','black').attr('fill','transparent');
    this.circleFrom = svg.append('svg:circle').attr('stroke','black').attr('fill','white').attr('r','5');
    this.circleTo = svg.append('svg:circle').attr('stroke','black').attr('fill','white').attr('r','5');
    this.from = this.to = {x:0,y:0};
    this.setFrom(50,50);
    this.setTo(100,50);
    this.refresh();
    
    this.terminals = [];
    this.terminals.push( new Terminal() );
    this.terminals.push( new Terminal() );
    this.terminals[0].connectTerminal( this.terminals[1] );
    
};

Wire.prototype.setFrom = function(x, y) {
    this.from = {x:x, y:y};
    this.refresh();
    return this;
};

Wire.prototype.setTo = function(x, y) {
    this.to = {x:x, y:y};
    this.refresh();
    return this;
};

Wire.prototype.refresh = function() {

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
