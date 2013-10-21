
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
Terminal = function(debug) {
    
    this.debug = debug ? debug : false;
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
