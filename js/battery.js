
numberOfBatteries = 0;

$('#divNewElements').append( $('<input type=button value="New battery" onclick="new Battery(schematic);"/>') );

/*
 * Battery power source
 * 
 * two poles: plus, minus
 * two ends
 * two terminals
 */

Battery = function(parentSchematic, debug, randomXY) {
    
    this.name = 'battery'+(numberOfBatteries++);
    this.parentSchematic = parentSchematic;
    this.parentSchematic.append(this);
    this.debug = debug ? debug : (this.parentSchematic.debug ? this.parentSchematic.debug : false);
    randomXY = randomXY ? randomXY : true;
    
    this.voltage = 0;
    
    this.path = this.parentSchematic.newPathElement().attr('id',this.name);
    this.bbox = this.parentSchematic.newBoundingBox().attr('width', 80).attr('height',60);
    // https://github.com/mbostock/d3/wiki/Drag-Behavior
    var self = this; this.bbox.call(d3.behavior.drag().on("drag", function() { moveBattery(self); } )); // closure
    this.circlePlus = this.parentSchematic.newCircleTerminal('terminalBattery');
    this.circleMinus = this.parentSchematic.newCircleTerminal('terminalBattery');
    
    this.terminals = [];
    this.terminals.push( new Terminal(this) );
    this.terminals.push( new Terminal(this) );
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

Battery.prototype.getName = function() {
    return this.parentSchematic.getName()+' > '+this.name;
};

Battery.prototype.setXY = function(x, y) {
    
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

Battery.prototype.setVoltage = function(V) {
    
    this.voltage = V;
    this.terminals[0].setVoltage(V/2);
    this.terminals[1].setVoltage(-V/2);
};

Battery.prototype.draw = function() {
    
    // move bounding box
    this.bbox.attr('x',this.x-40).attr('y',this.y-30);
    
    // redraw battery symbol
    var a = {x:this.x-30, y:this.y};
    var b = {x:this.x-3, y:this.y};
    var m = {x:this.x-3, y:this.y-20};
    var n = {x:this.x-3, y:this.y+20};
    var v = {x:this.x+3, y:this.y-10};
    var w = {x:this.x+3, y:this.y+10};
    var c = {x:this.x+3, y:this.y};
    var d = {x:this.x+30, y:this.y};
    this.path.attr('d','M'+coord(a)+' L'+coord(b)+' M'+coord(m)+' L'+coord(n)+' M'+coord(v)+' L'+coord(w)+' M'+coord(c)+' L'+coord(d));
    
    // move terminals
    this.terminals[0].setXY(a);
    this.terminals[1].setXY(d);
};

function moveBattery(battery){
    battery.setXY(battery.x + d3.event.dx, battery.y + d3.event.dy);
};

