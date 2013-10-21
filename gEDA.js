
// Voltage units
Volt = 1;
mV = 0.001;

/*
 * Logic levels
 * 
 * Read more:
 * https://de.wikipedia.org/wiki/Logikpegel
 * https://en.wikipedia.org/wiki/Logic_level
 */
CMOS = 'CMOS';
TTL = 'TTL';

/*
 * Load SVGs (doesn't work due to browser restrictions)
 */
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

coord = function(point) {
    return point.x+','+point.y;
};
