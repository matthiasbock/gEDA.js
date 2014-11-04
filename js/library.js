
/*
 * A library (<geda-library>) is a set of visual representation prototypes (SVGs)
 * for components, usually one per component type.
 * <geda-ibrary> elements can be located anywhere in the document,
 * it is recommended to place them below their corresponding <geda-project> though. 
 * Library components are available to every schematic in the document,
 * also to those in different projects.
 * Wherever component prototypes are referenced in a schematic,
 * the library prototype will be copied over to the schematic.  
 */

LibraryComponent = function()
{
    this.component = '';
}

LibraryComponent.prototype.fromGAF = function(src)
{
    if (typeof src == 'string')
        var gaf = new GAF(src);
    else
        var gaf = src;

    // import lines and pins
    this.lines = gaf.filterType(GAF_OBJECT_LINE);
    this.pins = [];

    // move whole SVG to (0,0), therefore find minX and minY
    var x = [], y = [];
    for (var i=0; i<this.lines.length; i++)
    {
        var l = this.lines[i];
        x.push(l.x1);
        y.push(l.y1)
        x.push(l.x2);
        y.push(l.y2)
    }
    this.minX = d3.min(x);
    this.maxX = d3.max(x);
    this.minY = d3.min(y);
    this.maxY = d3.max(y);
    
    return this;
}

LibraryComponent.prototype.exportDOM = function()
{
    var dom = $('<geda-component component="'+this.component+'" format="image/svg+xml">');

    // create SVG in <geda-component>   
    var svg = d3.select(dom[0]).append('svg:svg')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .attr('width', this.maxX-this.minX)
                .attr('height', this.maxY-this.minY);
    var g = svg.append('svg:g')
            .attr('transform', 'translate('+(-this.minX)+', '+(-this.minY)+')');
    
    // export lines and pins
    for (var i=0; i<this.lines.length; i++)
    {
        var l = this.lines[i];
        g.append('svg:line')
            .attr('x1', l.x1)
            .attr('y1', l.y1)
            .attr('x2', l.x2)
            .attr('y2', l.y2)
            .style('stroke-width', l.linewidth+1);
    }

    return dom;
}
