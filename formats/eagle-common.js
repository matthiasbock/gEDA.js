
/*
 * Eagle layer names
 * Valid array indices: [1..98]
 */
EagleLayers = [
    "",
    "Top",
    "Route2",
    "Route3",
    "Route4",
    "Route5",
    "Route6",
    "Route7",
    "Route8",
    "Route9",
    "Route10",
    "Route11",
    "Route12",
    "Route13",
    "Route14",
    "Route15",
    "Bottom",
    "Pads",
    "Vias",
    "Unrouted",
    "Dimension",
    "tPlace",
    "bPlace",
    "tOrigins",
    "bOrigins",
    "tNames",
    "bNames",
    "tValues",
    "bValues",
    "tStop",
    "bStop",
    "tCream",
    "bCream",
    "tFinish",
    "bFinish",
    "tGlue",
    "bGlue",
    "tTest",
    "bTest",
    "tKeepout",
    "bKeepout",
    "tRestrict",
    "bRestrict",
    "vRestrict",
    "Drills",
    "Holes",
    "Milling",
    "Measures",
    "Document",
    "ReferenceLC",
    "ReferenceLS",
    "tDocu",
    "bDocu",
    "Nets",
    "Busses",
    "Pins",
    "Symbols",
    "Names",
    "Values",
    "Info",
    "Guide"
];

/*
 * How to draw SVG elements for each Eagle package sub-element
 */
EaglePackageRenderSVG = {
    'polygon':  function(polygon) {
                    var result = '<path class="polygon" layer="'+EagleLayers[polygon.layer]+'" d="';
                    for (var i=0; i<polygon.vertices.length; i++)
                        result += (i==0 ? 'M' : 'L')+EagleRenderSVG['vertex'](polygon.vertices[i]);
                    result += 'Z"/>';
                    return result;
                },
    'vertex':   function(vertex) {
                    return vertex.x+','+vertex.y;
                },
    'wire':     function(wire) {
                    return '<line class="wire" layer="'+EagleLayers[wire.layer]+'" x1="'+wire.x1+'" y1="'+wire.y1+'" x2="'+wire.x2+'" y2="'+wire.y2+'" stroke-width="'+wire.width+'"/>';
                },
    'text':     function(text) {
                    return '<text '+(text.layer ? 'layer="'+EagleLayers[text.layer]+'" ' : '') +'x="'+text.x+'" y="'+text.y+'" font-size="'+text.size+'">'+text.text+'</text>';
                },
    'dimension':function(dimension) {
                    return '';
                },
    'circle':   function(circle) {
                    return '<circle class="circle" layer="'+EagleLayers[circle.layer]+'" cx="'+circle.x+'" cy="'+circle.y+'" r="'+(circle.radius+circle.width)+'" />';
                },
    'rectangle':function(rectangle) {
                    return '<rect class="rectangle" layer="'+EagleLayers[rectangle.layer]+'" x="'+rectangle.x1+'" y="'+rectangle.y1+'" width="'+(rectangle.x2-rectangle.x1)+'" height="'+(rectangle.y2-rectangle.y1)+'"/>';
                },
    'frame':    function(frame) {
                    return '';
                },
    'hole':     function(hole) {
                    return '<circle class="hole" cx="'+hole.x+'px" cy="'+hole.y+'px" r="'+(hole.drill/2)+'px"/>';
                },
    'pad':      function(pad) {
                    // SVG group
                    // move into place using transform>translate,
                    // so rotate can easily be applied
                    var result = '<g class="pad" '+(pad.name ? 'id="pad'+pad.name+'" ':'')+'transform="translate('+pad.x+','+pad.y+')';
                    // rotate ?
                    if (pad.rot && pad.rot != '')
                    {
                        try {
                            var angle = parseFloat(pad.rot.replace('R',''))
                            if (angle && !isNaN(angle))
                                result += ' rotate('+angle+')';
                            else
                                console.error('Rotation unsuccessful: '+pad.rot);
                        } catch(e) {
                            console.error('Rotation unsuccessful: '+pad.rot);
                        }
                    }
                    result += '">';

                    // draw depending on specified pad shape
                    // http://web.mit.edu/xavid/arch/i386_rhel4/help/67.htm
                    pad.shape = pad.shape.toLowerCase();
                    if (pad.shape == 'square')
                    {
                        var outerDiameter = pad.drill*2, outerRadius = outerDiameter/2;
                        result += '<rect x="'+(-outerRadius)+'" y="'+(-outerRadius)+'" width="'+outerDiameter+'" height="'+outerDiameter+'"/>';
                        result += '<circle class="drill" cx="0" cy="0" r="'+(pad.drill/2)+'"/>';
                    }
                    else if (pad.shape == 'round')
                    {
                        var outerDiameter = pad.drill*2, outerRadius = outerDiameter/2;
                        result += '<circle cx="0" cy="0" r="'+outerRadius+'"/>';
                        result += '<circle class="drill" cx="0" cy="0" r="'+(pad.drill/2)+'"/>';
                    }
                    else if (pad.shape == 'octagon')
                    {
                        var outerDiameter = pad.drill*2, r = outerDiameter/2, a=r/3*2;
                        result += '<path class="pad" d="m'+(-1/2*a)+','+(3/2*a)+' '+(-a)+','+(-a)+' 0,'+(-a)+' '+a+','+(-a)+' '+a+',0 '+a+','+a+' 0,'+a+' '+(-a)+','+a+' z"/>';
                        result += '<circle class="drill" cx="0" cy="0" r="'+(pad.drill/2)+'"/>';
                    }
                    else if (pad.shape == 'long')
                    {
                        var outerDiameter = pad.drill*5/3, outerRadius = outerDiameter/2;
                        result += '<rect x="'+(-outerRadius)+'" y="'+(-outerRadius)+'" width="'+outerDiameter+'" height="'+outerDiameter+'"/>';
                        result += '<circle cx="'+(-outerRadius)+'" cy="0" r="'+outerRadius+'"/>"';
                        result += '<circle cx="'+outerRadius+'" cy="0" r="'+outerRadius+'"/>"';
                        result += '<circle class="drill" cx="0" cy="0" r="'+(pad.drill/2)+'"/>"';
                    }

                    result += '</g>';
                    return result;
                },
    'smd':      function(smd) {
                    return '<rect class="smd" id="smd'+smd.name+'" layer="'+EagleLayers[smd.layer]+'" x="'+(smd.x-(smd.dx/2))+'" y="'+(smd.y-(smd.dy/2))+'" width="'+smd.dx+'" height="'+smd.dy+'"/>';
                }
};


/*
 * How to draw SVG elements for each Eagle symbol sub-element
 */
EagleSymbolRenderSVG = {
    'polygon':      EaglePackageRenderSVG['polygon'],
    'vertex':       EaglePackageRenderSVG['vertex'],

    'wire':         EaglePackageRenderSVG['wire'],

    'text':         EaglePackageRenderSVG['text'],

    'dimension':    EaglePackageRenderSVG['dimension'],

    'pin':          function(pin) {
                        var result = '<g class="pin" '+(pin.name ? 'id="pin'+pin.name+'" ':'')+'transform="translate('+pin.x+','+pin.y+')';

                        if (pin.rot && pin.rot != '')
                        {
                            try {
                                var angle = parseFloat(pin.rot.replace('R',''))
                                if (angle && !isNaN(angle))
                                    result += ' rotate('+angle+')';
                                else
                                    console.error('Rotation unsuccessful: '+pin.rot);
                            } catch(e) {
                                console.error('Rotation unsuccessful: '+pin.rot);
                            }
                        }
                        result += '">';                        

                        var length = 2;
                        if (pin.length == 'short')
                            length = 1.5;
                        else if (pin.length == 'medium')
                            length = 3;
                        else if (pin.length == 'long')
                            length = 4.5;

                        result += '<line x1="0" y1="0" x2="'+length+'" y2="0"/>';
                        result += '<circle cx="0" cy="0" r="1"/>';

                        if (pin.function && pin.function == 'dot')
                        {
                            result += '<circle class="function" cx="'+length+'" cy="0" r="1"/>';
                        }
                        
                        result += '</g>';
                        return result;
                    },

    'circle':       EaglePackageRenderSVG['circle'],
    
    'rectangle':    EaglePackageRenderSVG['rectangle'],

    'frame':        EaglePackageRenderSVG['frame']
};
