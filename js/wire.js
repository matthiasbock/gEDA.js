
/*
 * Simplest element: a wire
 * 
 * one line
 * two ends
 * two terminals
 */

Wire = function() {
    
    this.svg = svg.append('svg:path');
    this.svg.attr('stroke','black').attr('d','M50,50 L100,50');
    
    this.terminals = [];
    this.terminals.push( new Terminal() );
    this.terminals.push( new Terminal() );
    this.terminals[0].connectTerminal( this.terminals[1] );
    
};
