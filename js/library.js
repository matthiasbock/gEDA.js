
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

    // import lines
    this.lines = gaf.filterType(GAF_OBJECT_LINE);
    // import pins
    this.pins = gaf.filterType(GAF_OBJECT_PIN);
    // import rects/boxes
    this.rects = gaf.filterType(GAF_OBJECT_BOX);

    // move whole SVG to (0,0), therefore find minX and minY
    var x = [], y = [];
    // line min/max
    for (var i=0; i<this.lines.length; i++)
    {
        var l = this.lines[i];
        x.push(l.x1); y.push(l.y1); x.push(l.x2); y.push(l.y2);
    }
    // pin min/max
    for (var i=0; i<this.pins.length; i++)
    {
        var p = this.pins[i];
        x.push(p.x1); y.push(p.y1); x.push(p.x2); y.push(p.y2);
    }
    // rect min/max
    for (var i=0; i<this.rects.length; i++)
    {
        var r = this.rects[i];
        x.push(r.x); y.push(r.y); x.push(r.x+r.width); y.push(r.y+r.height);
    }
    this.minX = d3.min(x);
//    this.minX = this.minX ? this.minX : 0;
    this.maxX = d3.max(x);
//    this.maxX = this.maxX ? this.maxX : 0;
    this.minY = d3.min(y);
//    this.minY = this.minY ? this.minY : 0;
    this.maxY = d3.max(y);
//    this.maxY = this.maxY ? this.maxY : 0;
    
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
    var g = svg.append('svg:g');
    if (this.minX != 0 || this.minY != 0)
        g.attr('transform', 'translate('+(-this.minX)+', '+(-this.minY)+')');
    
    // export lines
    for (var i=0; i<this.lines.length; i++)
    {
        var l = this.lines[i];
        g.append('svg:line')
            .attr('class', 'line')
            .attr('x1', l.x1)
            .attr('y1', l.y1)
            .attr('x2', l.x2)
            .attr('y2', l.y2)
            .style('stroke-width', l.linewidth+1);
    }
    // export pins
    for (var i=0; i<this.pins.length; i++)
    {
        var p = this.pins[i];
        g.append('svg:line')
            .attr('class', 'pin')
            .attr('x1', p.x1)
            .attr('y1', p.y1)
            .attr('x2', p.x2)
            .attr('y2', p.y2);
    }
    // export rects
    for (var i=0; i<this.rects.length; i++)
    {
        var r = this.rects[i];
        g.append('svg:rect')
            .attr('x', r.x)
            .attr('y', r.y)
            .attr('width', r.width)
            .attr('height', r.height);
    }

    return dom;
}
