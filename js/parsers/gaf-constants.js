
/**
 * Constants
 */

// Single character at the beginning of each GAF line determines the object type
GAF_OBJECT_TYPES = {
    'v': [
        'version',
        'version',
        'fileformat_version'
    ],
    'L': [
        'line',
        'x1', 'y1', 'x2', 'y2',
        'color',
        'linewidth', 'capstyle', 'dashstyle', 'dashlength', 'dashspace'
    ],
    'G': [
        'picture',
        'x', 'y', 'width', 'height',
        'angle', 'mirrored', 'embedded', 'filename'
    ],
    'B': [
        'box',
        'x', 'y', 'width', 'height',
        'color', 'linewidth', 'capstyle', 'dashstyle', 'dashlength', 'dashspace', 'filltype', 'fillwidth',
        'anle1', 'pitch1', 'angle2', 'pitch2'
    ],
    'V': [
        'circle',
        'x', 'y', 'radius',
        'color', 'linewidth', 'capstyle', 'dashstyle', 'dashlength', 'dashspace', 'filltype', 'fillwidth',
        'angle1', 'pitch1', 'angle2', 'pitch2'
    ],
    'A': [
        'arc',
        'x', 'y', 'radius',
        'startangle', 'sweepangle',
        'color', 'width', 'capstyle', 'dashstyle', 'dashlength', 'dashspace'
    ],
    'T': [
        'text',
        'x', 'y',
        'color', 'size', 'visibility',
        'show_name_value',
        'angle',
        'alignment',
        'num_lines'
    ],
    'N': [
        'net',
        'x1', 'y1', 'x2', 'y2',
        'color'
    ],
    'U': [
        'bus',
        'x1', 'y1', 'x2', 'y2',
        'color', 'ripperdirection'
    ],
    'P': [
        'pin',
        'x1', 'y1', 'x2', 'y2',
        'color', 'pintype', 'whichend'
    ],
    'C': [
        'component',
        'x', 'y',
        'selectable',
        'angle', 'mirror',
        'basename'
    ],
    'H': [
        'path',
        'color', 'width', 'capstyle', 'dashstyle', 'dashlength', 'dashspace', 'filltype', 'fillwidth',
        'angle1', 'pitch1', 'angle2', 'pitch2',
        'numlines'
    ],
    'F': [
        'font', 
        'character', 'width', 'flag'
    ]
};

// an attribute is text + parsed text
GAF_OBJECT_TYPES['attribute'] = GAF_OBJECT_TYPES['T'];
GAF_OBJECT_TYPES['attribute'].push('name');
GAF_OBJECT_TYPES['attribute'].push('value');

// line specific
GAF_CAPSTYLE_NONE   = 0;
GAF_CAPSTYLE_SQUARE = 1;
GAF_CAPSTYLE_ROUND  = 2;
GAF_DASHSTYLE_SOLID   = 0;
GAF_DASHSTYLE_DOTTED  = 1;
GAF_DASHSTYLE_DASHED  = 2;
GAF_DASHSTYLE_CENTER  = 3;
GAF_DASHSTYLE_PHANTOM = 4;
GAF_FILLTYPE_HOLLOW = 0;
GAF_FILLTYPE_FILL   = 1;
GAF_FILLTYPE_MESH   = 2;
GAF_FILLTYPE_HATCH  = 3;
GAF_FILLTYPE_VOID   = 4;
