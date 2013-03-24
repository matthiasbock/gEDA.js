 // logical "not" IC: hex inverter

 // constants
 var TERMINAL_DISCONNECTED = null;
 var TERMINAL_VCC = 'VCC';
 var TERMINAL_GND = 'GND';
 var TERMINAL_INPUT = 'INPUT';
 var TERMINAL_OUTPUT = 'OUTPUT';

 // init terminal functions
 var element1.role = [];
 element1.role[terminal1] = TERMINAL_VCC;
 element1.role[terminal8] = TERMINAL_GND;
 element1.role[terminal2] = TERMINAL_OUTPUT;
 element1.role[terminal3] = TERMINAL_INPUT;

 // init levels
 var element1.level = [];
 element1.level[terminal1] = 5 * Volt; // switched on
 element1.level[terminal8] = 0 * Volt;
 element1.level[terminal3] = CMOS_LOW;
 element1.level[terminal2] = CMOS_HIGH;

 invert = function(currentOutputLevel, inputLevel) {
   var VCC = this.level[terminal1]-this.level[terminal8];

   if (VCC < 3*Volt || VCC > 15*Volt) // inactive or destroyed; null = disconnected
     return TERMINAL_DISCONNECTED;

   if (currentOutputLevel == CMOS_LOW && inputLevel >= CMOS_LOW_TO_HIGH) // input = HIGH
        return CMOS_LOW
   else if (currentOutputLevel == CMOS_HIGH && inputLevel <= CMOS_HIGH_TO_LOW) // input = LOW
        return CMOS_HIGH
   else return currentOutputLevel; // hysterese (e.g. Schmitt-Trigger)
   }

 update = function(event) {
   this.level[terminal2] = this.invert(this.level[terminal2], this.level[terminal3]);
   this.level[terminal4] = this.invert(this.level[terminal4], this.level[terminal5]);
   this.level[terminal6] = this.invert(this.level[terminal6], this.level[terminal7]);
   this.level[terminal15] = this.invert(this.level[terminal15], this.level[terminal14]);
   this.level[terminal12] = this.invert(this.level[terminal12], this.level[terminal11]);
   this.level[terminal10] = this.invert(this.level[terminal10], this.level[terminal9]);
   }

 element1.onclick = update;
