
/*
 * Allowed terminal directions
 */
NORTH = 'NORTH';
SOUTH = 'SOUTH';
WEST = 'WEST';
EAST = 'EAST';

/*
 * Virtual terminal
 * 
 * Stores voltage
 * Interconnects with other terminals
 */
Terminal = function(parent, debug) {
    
    this.parentElement = parent;
    this.debug = debug ? debug : (parent.debug ? parent.debug : false);
    this.voltage = 0;
    this.connectedTerminals = [];
    this.direction = NORTH;
    this.label = '';
};

/*
 * Check if the applied voltage differs from our terminal voltage.
 * If yes, apply it and tell all connected terminals to update aswell.
 */
Terminal.prototype.setVoltage = function(V) {
    
    if (V != this.voltage) {
        if (this.debug)
            console.log('setVoltage('+V+');');
        this.voltage = V;
        for (var i=0; i<this.connectedTerminals.length; i++) {
            this.connectedTerminals[i].setVoltage(V);
        }
    } else if (this.debug)
        console.log('setVoltage('+V+'): Ignored, terminal voltage already equals '+V+'.');
};

/*
 * Connect with a terminal if it's not already connected
 * and tell it to add us aswell.
 */
Terminal.prototype.connectTerminal = function(T) {
    
    if (this.connectedTerminals.indexOf(T) < 0) {
        if (this.debug)
            console.log('connectTerminal(T);');
        this.connectedTerminals.push(T);
        T.connectTerminal(this);
    } else if (this.debug)
        console.log('connectTerminal(T): Ignored, terminal is already connected.');
};

/*
 * Delete T from the list of connected terminals
 * and also tell T to remove us from it's list.
 */
Terminal.prototype.disconnectTerminal = function(T) {
    
    if (this.connectedTerminals.indexOf(T) > -1) {
        if (this.debug)
            console.log('disconnectTerminal(T);');
        this.connectedTerminals.splice(this.connectedTerminals.indexOf(T), 1);
        T.disconnectTerminal(this);
    } else if (this.debug)
        console.log('disconnectTerminal(T): Ignored, this terminal is not connected.');
};

/*
 * Tell all connected terminals to disconnect from this terminal
 * (could also work the other way around, but doesn't make a difference)
 */
Terminal.prototype.disconnectAllTerminals = function() {
    
    for (var i=0; i<this.connectedTerminals.length; i++) {
        this.connectedTerminals[i].disconnectTerminal(this);
    }
    
    // should already be empty here, just to make sure
    this.connectedTerminals = [];
};

/*
 * Define an SVG element that corresponds to this terminal
 */
Terminal.prototype.hookSVG = function(element) {
    
    this.svg = element;
    
    /*
     * Programming a closure for the event function
     * 
     * The SVG element throws the event ("this").
     * Additionally the event itself aswell as
     * the corresponding terminal object are provided.  
     */ 
    var terminal = this;
    // [0][0] is due to d3 syntax
    // d3's .on does not provide the proper this, event nor terminal 
    this.svg[0][0].onclick = function(event) { onTerminalClick.call(event.toElement, event, terminal); };
};

onTerminalClick = function(event, terminal) {
    /*
    console.log(this);
    console.log(event);
    console.log(terminal);
    console.log(terminal.parentElement);
    */
    
    if (typeof selectedTerminal == typeof undefined) {
        selectedTerminal = terminal;
        selectionBegin = {x:event.srcElement.cx.baseVal.value, y:event.srcElement.cy.baseVal.value};
        console.log(selectionBegin);
        selectionPath = svg.append('svg:path').attr('class','connectTerminalsLine');
        $('#svg').bind('mousemove', refreshConnectTerminalsLine);
        $('#svg').bind('keyup', cancelConnectTerminalsLine);
    } else {
        selectionEnd = {x:event.x, y:event.y};
        selectionPath.remove();
        $('#svg').unbind('movemove');
        delete selectedTerminal;
    }
};

refreshConnectTerminalsLine = function(event) {
    selectionEnd = {x:event.originalEvent.x-20, y:event.originalEvent.y-20};
    selectionPath.attr('d','M'+coord(selectionBegin)+' L'+coord(selectionEnd));
    console.log(coord(selectionEnd));
};

cancelConnectTerminalsLine = function(event) {
    console.log(event);
    console.log(event.originalEvent);
};
