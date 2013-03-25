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

Terminal = {
	var SVGElement = null;
	var role = NOT_CONNECTED;
	var level = LOW;
	}

HexInverter14 = {

	var terminals = {};

	terminals[14].role = VCC;
		...
		role = VCC;
		level[14] = 5 * Volt;
		role[7] = GND;
		level[7] = 0 * Volt;

		role[01] = INPUT;
		role[03] = INPUT;
		role[05] = INPUT;
		role[09] = INPUT;
		role[11] = INPUT;
		role[13] = INPUT;
		level[01] = LOW;
		level[03] = LOW;
		level[05] = LOW;
		level[09] = LOW;
		level[11] = LOW;
		level[13] = LOW;
		role[02] = OUTPUT;
		role[04] = OUTPUT;
		role[06] = OUTPUT;
		role[08] = OUTPUT;
		role[10] = OUTPUT;
		role[12] = OUTPUT;
		level[02] = HIGH;
		level[04] = HIGH;
		level[06] = HIGH;
		level[08] = HIGH;
		level[10] = HIGH;
		level[12] = HIGH;
		}

	var HIGH_TO_LOW = LOW_TO_HIGH = 2.5 * Volt;
		
	invert = function(currentOutputLevel, inputLevel) {
		var VCC = this.level[14]-this.level[7];

		if (VCC < 3*Volt || VCC > 15*Volt) // inactive or destroyed; null = disconnected
			return NOT_CONNECTED;

		if (currentOutputLevel == LOW && inputLevel >= this.LOW_TO_HIGH)	// input = HIGH
			return LOW
		else
		if (currentOutputLevel == HIGH && inputLevel <= this.HIGH_TO_LOW)	// input = LOW
			return HIGH
		else
			return currentOutputLevel; // hysterese (e.g. Schmitt-Trigger)
		}

	update = function(event) {
		this.level[2] = this.invert(this.level[2], this.level[3]);
		this.level[4] = this.invert(this.level[4], this.level[5]);
		this.level[6] = this.invert(this.level[6], this.level[7]);
		this.level[10] = this.invert(this.level[10], this.level[9]);
		this.level[12] = this.invert(this.level[12], this.level[11]);
		this.level[15] = this.invert(this.level[15], this.level[14]);
		}
	}

HexInverter16 = {
	// init terminal functions
	var role = {};
	role[1] = VCC;
	role[8] = GND;
	role[2] = OUTPUT;
	role[3] = INPUT;

	// init levels
	var level = {};
	level[1] = 5 * Volt; // switched on
	level[8] = 0 * Volt;
	level[3] = LOW;
	level[2] = HIGH;

	var HIGH_TO_LOW = LOW_TO_HIGH = 2.5 * Volt;
		
	invert = function(currentOutputLevel, inputLevel) {
		var VCC = this.level[1]-this.level[8];

		if (VCC < 3*Volt || VCC > 15*Volt) // inactive or destroyed; null = disconnected
			return NOT_CONNECTED;

		if (currentOutputLevel == LOW && inputLevel >= this.LOW_TO_HIGH)	// input = HIGH
			return LOW
		else
		if (currentOutputLevel == HIGH && inputLevel <= this.HIGH_TO_LOW)	// input = LOW
			return HIGH
		else
			return currentOutputLevel; // hysterese (e.g. Schmitt-Trigger)
		}

	update = function(event) {
		this.level[2] = this.invert(this.level[2], this.level[3]);
		this.level[4] = this.invert(this.level[4], this.level[5]);
		this.level[6] = this.invert(this.level[6], this.level[7]);
		this.level[10] = this.invert(this.level[10], this.level[9]);
		this.level[12] = this.invert(this.level[12], this.level[11]);
		this.level[15] = this.invert(this.level[15], this.level[14]);
		}
	}

