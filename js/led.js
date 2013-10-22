
numberOfLEDs = 0;

$('#divNewElements').append( $('<input type=button value="New LED" onclick="new LED(schematic);"/>') );

/*
 * Battery power source
 * 
 * two poles: plus, minus
 * two ends
 * two terminals
 */

LED = function(parentSchematic, debug, randomXY) {
    
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

LED.prototype.getName = function() {
    return this.parentSchematic.getName()+' > '+this.name;
};

LED.prototype.setXY = function(x, y) {
    
    if (typeof x == 'object') {
        y = x.y;
        x = x.x;
    }
    if (this.x != x || this.y != y) {
        this.x = x;
        this.y = y;
        this.draw();
    }
    return this;
};

LED.prototype.draw = function() {
    
    // move bounding box
    this.bbox.attr('x',this.x-40).attr('y',this.y-30);
    
    // move LED symbol
    this.path.attr('transform', 'translate('+this.x+','+this.y+')');
    
    // move terminals
    this.terminals[0].setXY(this.x-30, this.y);
    this.terminals[1].setXY(this.x+30, this.y);
};

