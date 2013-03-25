 // logical "not" IC: hex inverter

HexInverter14 = function() {

	// init IC terminals
	var terminals = {};
	terminals[14] = new Terminal(VCC, 5 * Volt);
	terminals[7]   = new Terminal(GND, 0 * Volt);
	[1, 3, 5, 9, 11, 13].forEach( function(element, index, array) { terminals[element] = new Terminal(INPUT, LOW); } );
	[2, 4, 6, 8, 10, 12].forEach( function(element, index, array) { terminals[element] = new Terminal(OUTPUT, HIGH); } );

	// possibility for hysterese (e.g. Schmitt-Trigger)
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
			return currentOutputLevel;
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

