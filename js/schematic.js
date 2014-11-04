
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
                                .attr('id', 'svg')
                                .style('width',width)
                                .style('height',height);

    // overlay rectangle to catch drag'n' drop events    
    this.rectMoveCanvas = this.svg.append('svg:rect')
                                    .attr('class','rectMoveCanvas')
                                    .attr('x',0)
                                    .attr('y',0)
                                    .attr('width',width)
                                    .attr('height',height);

    // attach drag'n'drop event handler
    var self = this;
    this.rectMoveCanvas.call(d3.behavior.drag().on("drag", function() { moveSchematic(self); } ));

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
    this.svg.select('g').remove();
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
    var c = this.svg.append('svg:g').attr('class', 'component');
    var rect = c.append('svg:rect');
    rect
        .attr('x', x)
        .attr('y', y)
        .attr('width', '7px')
        .attr('height', '7px');
        
    // type: ignored, until component libraries are implemented
}

Schematic.prototype.appendWire = function(x1,y1,x2,y2)
{
    var w = this.svg.append('svg:g').attr('class', 'wire');
    var line = w.append('svg:line');
    line
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2);
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

        if (obj.type == GAF_OBJECT_COMPONENT)
        {
            this.appendComponent(obj.x*zoomX, obj.y*zoomY);
        }

        else if (obj.type == GAF_OBJECT_NET)
        {
            this.appendWire(obj.x1*zoomX, obj.y1*zoomY, obj.x2*zoomX, obj.y2*zoomY);
        }
    }
}
