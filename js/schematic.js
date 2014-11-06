
numberOfSchematics = 0;

/**
 * Schematic interfaces the list of components and wires,
 * which is stored directly in the DOM,
 * with the user interface, i.e. actions on SVG elements.
 */
Schematic = function(source) {
    
    this.name = 'schematic'+(numberOfSchematics++);
    var d3_parent = d3.select('body');
    
    // create from existing source?
    if (typeof source != 'undefined')
    {
        d3_parent = d3.select( source.parent()[0] );
    }
    
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
                    .attr('xmlns', 'http://www.w3.org/2000/svg')
                    .attr('class', 'schematic')
                    .attr('id', this.name)
                    .style('width', width)
                    .style('height', height);
    
    // for svgpan
    this.viewport = this.svg.append('svg:g');
    this.viewport
        .attr('id','viewport');
    $('svg#'+this.name).svgPan('viewport', true, true, true, 0.8);

    if (typeof source != 'undefined')
    {
        // create from GSchem/GAF
        if (source.attr('format') == 'application/gaf')
        {
            // import model
            var gaf = new GAF(source.html());
            
            // add imported schematic to container
            var after = gaf.exportDOM(
                            $('<geda-schematic format="application/gaf-xml" style="display:none;"></geda-schematic>')
                        )
                        .insertAfter(source);

            this.fromGAF(gaf);
        }
    }

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
     
};


/**
 * Remove all model-related elements from SVG
 * (grid etc. remains) 
 */
Schematic.prototype.clearSVG = function()
{
    this.viewport.select('g').remove();
}


/**
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
Schematic.prototype.appendComponent = function(type, x, y, angle)
{
    var c = this.viewport
                .append('svg:g')
                    .attr('class', 'component')
                    .attr('component', type)
                    .attr('transform', 'translate('+x+','+y+')');

    // determine, whether this component type is in the library
    var libComponent = $('geda-component[component="'+type+'"][format="image/svg+xml"]');
    if (libComponent.length > 0)
    {
        // if there are several prototypes available, just pick the first one
        libComponent = $(libComponent[0]);

        console.log('Found library component for "'+type+'":');
        console.log(libComponent);

        c.html(libComponent.find('svg > g:first').html());
        
        // apply rotation
        if (typeof angle != 'undefined' && angle > 0)
        {
            c.attr('transform', c.attr('transform')+' rotate('+angle+')');
        }
    } else {
        // if not in library, add an empty rectangle
        console.error('Warning: No component "'+type+'" in library. Using empty rectangle instead.');
        var rect = c
                    .append('svg:rect')
                        .attr('x', '0')
                        .attr('y', '0')
                        .attr('width', '700px')
                        .attr('height', '700px');
    }

    /*
     * Append a bounding box
     */
    console.log(c);
    var brect = c[0][0].getBBox(),
        width = brect.width,
        height = brect.height,
        margin = 50;
    c.append('svg:rect')
        .attr('class','bbox')
        .attr('x', 0-margin)
        .attr('y', 0-margin)
        .attr('width', width+2*margin)
        .attr('height', height+2*margin);

    return c;
}

Schematic.prototype.appendWire = function(x1,y1,x2,y2)
{
    // insert wires before other components, so that components are drawn over wires
    var w = this.viewport
                .insert('svg:g', ':first-child')
                    .attr('class', 'wire')
                    .attr('transform', 'translate('+x1+','+y1+')');

    // draw wires as simple lines
    var line = w
                .append('svg:line')
                    .attr('class', 'wire')
                    .attr('x1', '0')
                    .attr('y1', '0')
                    .attr('x2', x2-x1)
                    .attr('y2', y2-y1);

    return w;
}


/**
 * Import the whole schematic from an existing GAF model object
 */
Schematic.prototype.fromGAF = function(src)
{
    if (typeof src == 'string')
        var gaf = new GAF(src);
    else
        var gaf = src;

    gaf.center();
    
    // remove all components and wires
    this.clearSVG();
    
    /*
     * Import GAF objects:
     * For now, GAF objects can be only C (components) or N (net, actually wires)
     */
    for (var i=0; i<gaf.objects.length; i++)
    {
        var obj = gaf.objects[i];

        // import component (except title)
        if (obj.type == GAF_OBJECT_COMPONENT && obj.basename != 'title-B.sym')
        {
            this.appendComponent(obj.basename, obj.x, obj.y, obj.angle);
        }

        // import wire ("net")
        else if (obj.type == GAF_OBJECT_NET)
        {
            this.appendWire(obj.x1, obj.y1, obj.x2, obj.y2);
        }
    }

    // make sure, the model is within the borders of the viewport
    this.viewport.style('width', gaf.maxX+100);
    this.viewport.style('height', gaf.maxY+100);
    
    console.log('GAF schematic dimensions:');
    console.log('MinX: '+gaf.minX);
    console.log('MinY: '+gaf.minY);
    console.log('MaxX: '+gaf.maxX);
    console.log('MaxY: '+gaf.maxY);
    
    // scale and translate viewport to display all elements on screen
    var svg = $(this.svg[0]),
        svgWidth = svg.css('width').replace('px',''),
        svgHeight = svg.css('height').replace('px',''),
        gafWidth = gaf.maxX-gaf.minX,
        gafHeight = gaf.maxY-gaf.minY,
        zoomX = svgWidth / gafWidth,
        zoomY = svgHeight / gafHeight,
        zoom = d3.min([zoomX,zoomY]);
    console.log('Fitting schematic to screen:');
    console.log('Translating viewport by ('+(-gaf.minX)+','+(-gaf.minY)+')');
    console.log('Flipping Y axis and translating back into visible screen.');
    console.log('Zooming viewport by a factor of '+zoom+'.');
    this.viewport.attr('transform', 'scale('+zoom+','+(-zoom)+') translate(0,'+1.25*(-gafHeight)+') translate('+(-gaf.minX)+','+(-gaf.minY)+')');
}
