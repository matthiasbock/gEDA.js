/*
 * https://de.wikipedia.org/wiki/Gerber-Format
 * http://www.ucamco.com/files/downloads/file/81/the_gerber_file_format_specification.pdf?878b6d422920881fe5d06785166ee8e3
 */

Gerber = function(s)
{
    this.commands = [];    
}

Gerber.prototype.Interpolation =
[
    'LINEAR'
];

// Import existing Gerber file

// Parse Gerber object from string
Gerber.prototype.fromString = function(s)
{
    this.commands = [];    

    // line-based format
    var lines = s.split('\n');
    for (var i=0; i<lines.length; i++)
    {
        this.parseLine(line);
    }
}

// Parse one line of Gerber into existing object
Gerber.prototype.parseLine = function(line)
{
    if (line.indexOf('X') > -1
    &&  line.indexOf('Y') > -1
    &&  line.indexOf('D') > -1)
    {
        var s = line.replace('Y','X').replace('D','X').split('X');
        if (s.length < 4)
        {
            console.error('Insufficient arguments: '+line);
            return;
        }
        var x = s[1], y = s[2], d = s[3];
        this.addCommand( GerberCommandGoto(x,y) )
    }
}

// Manipulate Gerber object in userspace
 
Gerber.prototype.addCommand = function(cmd)
{
}

// Export Gerber object to string

Gerber.prototype.toString = function()
{
    var result = '';
    
    // add commands line-by-line
    for (var i=0; i<this.commands.length; i++)
    {
        
    }
    
    return result;
}
