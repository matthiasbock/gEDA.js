 // logical "not" IC: hex inverter

 // constants
var NOT_CONNECTED = null;
var VCC = 'VCC';
var GND = 'GND';
var INPUT = 'INPUT';
var OUTPUT = 'OUTPUT';

var V = Volt = 1;
var mV = 0.001;
var LOW = 0 * Volt;
var HIGH = 5 * Volt;

Terminal = function(role=NOT_CONNECTED, level=LOW, svg=null) {
	this.role = role;
	this.level = level;
	this.SVGElement = svg;
	}
