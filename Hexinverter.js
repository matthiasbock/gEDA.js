 // logical "not" IC: hex inverter

HexInverter14 = function() {

	// init IC terminals
	this.terminals = {};
	this.terminals[14] = new Terminal(VCC, 5 * Volt);
	this.terminals[7]   = new Terminal(GND, 0 * Volt);

	this.terminals[1] = new Terminal(INPUT, LOW);
	this.terminals[2] = new Terminal(OUTPUT, HIGH);
	
//	[1, 3, 5, 9, 11, 13].forEach( function(element, index, array) { setup(element, INPUT, LOW); } );
//	[2, 4, 6, 8, 10, 12].forEach( function(element, index, array) { this.terminals[element] = new Terminal(OUTPUT, HIGH); } );

	// possibility to setup a hysterese (Schmitt-Trigger)
	var HIGH_TO_LOW = LOW_TO_HIGH = 2.5 * Volt;
		
	invert = function(currentOutputLevel, inputLevel) {
		// IC is powered ?
		var VCC = this.terminals[14].level-this.terminals[7].level;
		// not powered or destroyed by overvoltage
		if (VCC < 3 * Volt || VCC > 15 * Volt)
			return NOT_CONNECTED;

		if (currentOutputLevel == LOW && inputLevel >= this.LOW_TO_HIGH)	// input = HIGH
			return LOW;
		else
		if (currentOutputLevel == HIGH && inputLevel < this.HIGH_TO_LOW)	// input = LOW
			return HIGH;
		else
			return currentOutputLevel;
		};

	update = function(event) {
		// invert all input terminal levels and set output terminal level appropriately
		this.terminals[2].level = this.invert(this.terminals[2].level, this.terminals[3].level);
		this.terminals[4].level = this.invert(this.terminals[4].level, this.terminals[5].level);
		this.terminals[6].level = this.invert(this.terminals[6].level, this.terminals[7].level);
		this.terminals[10].level = this.invert(this.terminals[10].level, this.terminals[9].level);
		this.terminals[12].level = this.invert(this.terminals[12].level, this.terminals[11].level);
		this.terminals[15].level = this.invert(this.terminals[15].level, this.terminals[14].level);
		};
	};
