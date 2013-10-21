
// terminal roles
NOT_CONNECTED = null;
VCC = 'VCC';
GND = 'GND';
INPUT = 'INPUT';
OUTPUT = 'OUTPUT';

// units
Volt = 1;
mV = 0.001;

/*
 * Logic levels
 * 
 * Read more:
 * https://de.wikipedia.org/wiki/Logikpegel
 * https://en.wikipedia.org/wiki/Logic_level
 */
LOGICLEVEL_CMOS = 'CMOS';
LOGILEVEL_TTL = 'TTL';


loadSVG = function(url, idElement, idObject, element) {
    /*
    $('body').append('<object id="'+idObject+'" data="'+url+'" type="image/svg+xml" style="width:0px;height:0px;visibility:hidden;"></object>');
    var object = document.getElementById(idObject);
    object.addEventListener('load',
            function() {
                var svg = object.contentDocument.getElementById(idElement);
                element.svg = svg;
                console.log(svg);
            }, false);
    */
    var svg = document.getElementById(idObject).contentDocument.getElementById(idElement);
    console.log(svg);
    return svg;
};


$.ajaxSetup({
    cache: true,
    beforeSend: function (xhr) {
        xhr.overrideMimeType("text/javascript");
    }
});

$.getScript("include/jquery.simulate.js");

$.ajaxSetup({
    beforeSend: null
});

<script src="elements.js"></script>
<script src="terminals.js"></script>
<script src="wire.js"></script>
<script src="hexinverter.js"></script>
