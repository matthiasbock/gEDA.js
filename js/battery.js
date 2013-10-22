
numberOfBatteries = 0;

$('#divNewElements').append( $('<input type=button value="New battery" onclick="new Battery(schematic);"/>') );

/*
 * Battery power source
 */

Battery = function(parentSchematic, debug, randomXY) {
    
    Element.call(this);
    
    this.name = 'battery'+(numberOfBatteries++);
    this.parentSchematic = parentSchematic;
    this.parentSchematic.append(this);
    this.debug = debug ? debug : (this.parentSchematic.debug ? this.parentSchematic.debug : false);
    randomXY = randomXY ? randomXY : true;
    
    this.voltage = 0;
    
    this.path = this.parentSchematic.newPathElement(this.name, 'm-30,0 l+27,0 m0,-20 l0,+40 m+5,-10 l0,-20 m+1,0 l0,+20 m0,-10 l+27,0');
    this.bbox = this.parentSchematic.newBoundingBox(80, 60);
    // https://github.com/mbostock/d3/wiki/Drag-Behavior
    var self = this; this.bbox.call(d3.behavior.drag().on("drag", function() { moveElement(self); } )); // closure
    this.circlePlus = this.parentSchematic.newCircleTerminal('terminalBattery');
    this.circleMinus = this.parentSchematic.newCircleTerminal('terminalBattery');
    
    this.terminals = [new Terminal(this), new Terminal(this)];
    this.terminals[0].hookSVG(this.circlePlus);
    this.terminals[1].hookSVG(this.circleMinus);
    
    // set position only after terminal SVG hooks are in place
    var x = 50;
    var y = 50;
    if (randomXY) {
        x = Math.random()*(parseInt($('#svg').css('width'))-80)+40;
        y = (Math.random()*(parseInt($('#svg').css('height'))-80))+40;
    }
    this.setXY(x,y);
};

Battery.prototype = new Element();

Battery.prototype.constructor = Battery;

Battery.prototype.setVoltage = function(V) {
    
    this.voltage = V;
    this.terminals[0].setVoltage(V/2);
    this.terminals[1].setVoltage(-V/2);
};
