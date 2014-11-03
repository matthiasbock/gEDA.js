
/**
 * GAF object prototype
 */

/*
 * Constants: Character defining the object's type
 */
GAF_OBJECT_VERSION      = 'v';
GAF_OBJECT_TEXT         = 'T';
GAF_OBJECT_NET          = 'N';
GAF_OBJECT_COMPONENT    = 'C';

/*
 * "GAF object" object
 * Usually one object per line
 */
GAF_Object = function(s)
{
    s = s.trim();
    console.log('New GAF object: '+s);

    this.type = s.trim().substr(1);
    this.attributes = {};
}

/*
 * GAF objects can have additional attributes
 * enclosed in {}.
 *
 * Parse object attributes string.
 */
GAF_Object.prototype.parseAttributes = function(attrs)
{
    console.log('TODO: parse attributes');
    console.log(attrs);
}