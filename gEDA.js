
// reserved word: undefined
notDefined = 'undefined';

/*
 * Register new HTML elements
 *
 * http://www.w3.org/TR/custom-elements/
 * http://www.html5rocks.com/en/tutorials/webcomponents/customelements/
 */
geda_project = document.registerElement('geda-project');
geda_library = document.registerElement('geda-library');
geda_component = document.registerElement('geda-component');
geda_schematic = document.registerElement('geda-schematic');

/*
 * Resolve dependencies
 */

INCLUDE_ROOT = 'include';
SCRIPT_ROOT = 'js';
PARSER_ROOT = SCRIPT_ROOT+'/parsers';

// include stylesheet, if not included already
if ($('head > link[href="gEDA.css"]').length == 0)
    $('head').append('<link rel="stylesheet" type="text/css" href="gEDA.css"/>');

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

if (typeof d3 == notDefined)
    $.getScript(INCLUDE_ROOT+'/d3.v3.js');

svgpan = true;
if (svgpan)
    $.getScript(INCLUDE_ROOT+'/jquery-svgpan.js');

if (typeof GAF == notDefined)
    $.getScript(PARSER_ROOT+'/gaf.js');

if (typeof Schematic == notDefined)
    $.getScript(SCRIPT_ROOT+'/schematic.js');

if (typeof LibraryComponent == notDefined)
    $.getScript(SCRIPT_ROOT+'/library.js');


allRefsIncluded = false;
//$('geda-component[src!=""]')...


/*
 * Stall execution of main, until all dependencies are resolved
 */
var handle = window.setInterval(function()
                                { 
                                    if ( typeof GAF != 'undefined'
                                      && typeof GAF_Object != 'undefined'
                                      && typeof LibraryComponent != 'undefined'
                                      && typeof d3 != 'undefined'
                                      && allRefsIncluded
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
    // Find and import all component libraries
    var lib = $('geda-library');
    for (var i=0; i<lib.length; i++)
    {
        // import all components in library
        var components = lib.find('geda-component[format="application/gaf"]');
        for (var j=0; j<components.length; j++)
        {
            components[j] = $(components[j]);
            var component = (new LibraryComponent()).fromGAF( components[j].html() );
            var c = component.exportDOM().insertAfter( components[j] );
            c.attr('component', components[j].attr('component'));
        } 
    }
    
    // Find and import all schematics
    var schematic = $('geda-schematic[format="application/gaf"]');
    for (var i=0; i<schematic.length; i++)
    {
        schematic[i] = $(schematic[i]);

        // put schematic in separate <geda-project> container
        var container = schematic[i].parent();
        // if not already in one 
        if (container.prop('tagName').toUpperCase() != 'GEDA-PROJECT')
        {
            var container = $('<geda-project/>');
            container.insertAfter(schematic[i]);
            schematic[i].appendTo(container);
        }

        new Schematic( schematic[i] );
    }
};


/*
 * There's a bug of unknown origin, see GitHub issue 1
 * https://github.com/matthiasbock/gEDA.js/issues/1
 *
 * Temporary workaround:
 * Regularly remove misplaced transform attributes from schematic elements
 */
/*window.setInterval(function()
{
    $('svg.schematic line, svg.schematic rect').attr('transform', null);
}, 1000);*/
