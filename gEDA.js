
/*
 * Register new HTML elements
 *
 * http://www.w3.org/TR/custom-elements/
 * http://www.html5rocks.com/en/tutorials/webcomponents/customelements/
 */
geda_project = document.registerElement('geda-project');
geda_schematic = document.registerElement('geda-library');
geda_schematic = document.registerElement('geda-schematic');

/*
 * Resolve dependencies
 */

INCLUDE_ROOT = 'include';
SCRIPT_ROOT = 'js';
PARSER_ROOT = SCRIPT_ROOT+'/parsers';

//Capture JS errors from js files called using the $.getScript function
$.extend({
    getScript: function (url, callback) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = url;
        head.appendChild(script);
        return undefined;
    },
});

$.getScript(INCLUDE_ROOT+'/d3.v3.js');
$.getScript(INCLUDE_ROOT+'/svgpan/jquery-svgpan.js');

$.getScript(PARSER_ROOT+'/gaf.js');

$.getScript(SCRIPT_ROOT+'/schematic.js');

/*
 * Stall execution of main, until all dependencies are resolved
 */
var handle = window.setInterval(function()
                                { 
                                    if ( typeof GAF != 'undefined'
                                      && typeof GAF_Object != 'undefined'
                                      && typeof d3 != 'undefined' 
                                      )
                                    {
                                        window.clearInterval(handle);
                                        main();
                                    }
                                }, 1000);


/*
 * When document and all scripts are ready:
 * Import all schematics in document
 */
function main()
{
    var schematics = [];
    var elmt = $('geda-schematic');
    console.log(elmt.length+' schematic(s) found in document.');
    for (var i=0; i<elmt.length; i++)
    {
        elmt[i] = $(elmt[i]);

        // hide unimported model
        elmt[i].css('display','none');

        // put everything related to this schematic in a separate container
        var container = $('<geda-project/>');
        container.insertAfter(elmt[i]);
        elmt[i].appendTo(container);

        // import model
        var gaf = new GAF(elmt[i].html());

        // add imported schematic to container
        container.append(
            gaf.exportDOM( $('<geda-schematic format="application/gaf-xml"></geda-schematic>') )
        );

        // import schematic from GAF
        var schematic = new Schematic( d3.select('geda-project') );
        schematic.importFromGAF(gaf);
        schematics.push(schematic);
    }
};
