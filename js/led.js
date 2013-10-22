
numberOfLEDs = 0;

$('#divNewElements').append( $('<input type=button value="New LED" onclick="new LED(schematic);"/>') );

/*
 * Light emitting diode
 */

LED = function(parentSchematic, debug, randomXY) {
    
    Element.call(this);
    
    this.name = 'led'+(numberOfLEDs++);
    this.parentSchematic = parentSchematic;
    this.parentSchematic.append(this);
    this.debug = debug ? debug : (this.parentSchematic.debug ? this.parentSchematic.debug : false);
    randomXY = randomXY ? randomXY : true;
    
    this.path = this.parentSchematic.newPathElement(this.name, 'm-30,0 l+20,0 m+20,0 l-20,-10 l0,+20 l+20,-10 m0,-10 l0,+20 m0,-10 l+20,0');
    this.bbox = this.parentSchematic.newBoundingBox(80, 60);
    var self = this; this.bbox.call(d3.behavior.drag().on("drag", function() { moveElement(self); } ));
    this.circlePlus = this.parentSchematic.newCircleTerminal('terminalLED');
    this.circleMinus = this.parentSchematic.newCircleTerminal('terminalLED');
    
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

LED.prototype = new Element();

LED.prototype.constructor = LED;
