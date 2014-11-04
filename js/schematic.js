
/*
 * Helper functions for drag'n'drop
 */
moveElement = function(element) {
    console.log(element);
    element
        .attr('x', element.x + d3.event.dx)
        .attr('y', element.y + d3.event.dy);
};

moveSchematic = function(schematic) {
    var elements = schematic.svg.select('g');
    console.log(elements);
    for (var i=0; i<elements.length; i++)
        moveElement(elements[i]);
};


numberOfSchematics = 0;

/*
 * The schematic object stores a list of elements
 * and a link to the main SVG canvas
 */

Schematic = function(d3_parent, debug) {
    
    this.name = 'schematic'+(numberOfSchematics++);
    this.debug = debug ? debug : false;
    
    /*
     * User Interface (UI):
     * An SVG below <geda-project/>
     * visualizing the current schematic model and
     * providing means for model manipulation by the user.
     */
    
    // create SVG
    var width = $('body').css('width');
    var height = parseInt($('body').css('height'))*0.8;
    this.svg = d3_parent.append("svg:svg")
                                .attr('id', this.name)
                                .style('width',width)
                                .style('height',height);
    // for svgpan
    this.viewport = this.svg.append('svg:g');
    this.viewport.attr('id','viewport');
    $('svg#'+this.name).svgPan('viewport', true, true, true, 0.8);

    /*
     * The schematic model is stored within the DOM of the document
     * inside the SVG representing the current gEDA project (content of <geda-project>...</geda-project>).
     *
     * Example:
     * <svg>
     *  <g type=component component=resistor value="4.7k">
     *   <rect x=50 y=50 width=20 height=5 color=black fill=white/>
     *   <text x=60 y=60>4.7 Ohm</text>
     *  </g>
     *  <g type=wire net="net0">
     *   <line x1=20 y1=20 x2=80 y2=20 color=black/>
     *  </g>
     * </svg>
     */

/*    this.grid = $('<g>')
    this.grid.append()
    this.svg.append(this.grid);*/
    
};

Schematic.prototype.getName = function() {
    return this.name;
};

Schematic.prototype.append = function(element) {
    if (this.elements.indexOf(element) < 0)
        this.elements.push(element);
};

Schematic.prototype.newCircleTerminal = function(css_class) {
    return this.svg.append('svg:circle').attr('class','circleTerminal '+css_class).attr('r',terminalCircleRadius);
};

Schematic.prototype.newPathElement = function(id, d, css_class) {
    if (typeof css_class == 'undefined')
        css_class = 'pathElement';
    var path = this.svg.append('svg:path').attr('class',css_class);
    if (typeof id != 'undefined')
        path.attr('id',id);
    if (typeof d != 'undefined')
        path.attr('d',d);
    return path;
};

Schematic.prototype.newBoundingBox = function(width, height) {
    var bbox = this.svg.append('svg:rect').attr('class','rectBoundingBox');
    if (typeof width != 'undefined')
        bbox.attr('width',width).attr('height',height);
    else
        bbox.attr('width',80).attr('height',60);
    return bbox;
};

Schematic.prototype.clearSVG = function()
{
    this.viewport.select('g').remove();
}

/*
 * Append a component to the schematic
 * at position (x,y).
 * If a library is present and linked to the schematic (this.library)
 * then "type" can be the name of the component prototype in the library
 * to import into the schematic.
 * If no library prototype is found, a simple rectangle is used. 
 *
 * Components are SVG groups (<g type="component">...</g>),
 * grouping all elements that visually represent the component.
 * Component parameters are stored as XML parameters to <g>,
 * e.g. <g type="component" component="resistor" resistance="4.7k">...</g>
 */
Schematic.prototype.appendComponent = function(x, y, type)
{
    var c = this.viewport
                .append('svg:g')
                    .attr('class', 'component')
                    .attr('transform', 'translate('+x+','+y+')');

    var rect = c
                .append('svg:rect')
                    .attr('x', '0')
                    .attr('y', '0')
                    .attr('width', '7px')
                    .attr('height', '7px');
        
    // type: ignored, until component libraries are implemented
}

Schematic.prototype.appendWire = function(x1,y1,x2,y2)
{
    var w = this.viewport
                .append('svg:g')
                    .attr('class', 'wire')
                    .attr('transform', 'translate('+x1+','+y1+')');

    var line = w
                .append('svg:line')
                    .attr('x1', '0')
                    .attr('y1', '0')
                    .attr('x2', x2-x1)
                    .attr('y2', y2-y1);
}


/*
 * Import the whole schematic from an existing GAF model object
 */
Schematic.prototype.importFromGAF = function(gaf)
{
    // remove all components and wires
    this.clearSVG();

    // schematics from gschem are too big for the average screen
    var zoomX = 1/100, zoomY = zoomX;

    /*
     * Import GAF objects:
     * For now, GAF objects can be only C (components) or N (net, actually wires)
     */
    for (var i=0; i<gaf.objects.length; i++)
    {
        var obj = gaf.objects[i];

        // import component
        if (obj.type == GAF_OBJECT_COMPONENT)
        {
            this.appendComponent(obj.x*zoomX, obj.y*zoomY);
        }

        // import wire ("net")
        else if (obj.type == GAF_OBJECT_NET)
        {
            this.appendWire(obj.x1*zoomX, obj.y1*zoomY, obj.x2*zoomX, obj.y2*zoomY);
        }
    }
}
