
module.exports = function (window) {
    /**     @property/Function Object.addPermanent
        Attaches a non-enumerable static property to an arbitrary Object. Usually used to attach
        nefarious extra methods to native prototypes. Be aware that every time you do this, a small part
        of your integrity is permenantly removed.
    @argument/Object target
        Recipient of the non-enumerable properties.
    @argument/String
    */
    function addPermanent (target, name, value) {
        try {
            Object.defineProperty (target, name, {
                'enumerable':       false,
                'configurable':     false,
                'writable':         true,
                'value':            value
            });
        } catch (err) {
            console.trace();
        }
        return target;
    };
    addPermanent (window.Object, 'addPermanent', addPermanent);

    /**     @function Object.typeStr
        Get a browser-safe lowercase type string for an Object. Provides a few special values for
        working with the DOM:
         * **element** - An Element of any type.
         * **textnode** - A `Text` Node instance.
         * **commentnode** - A Comment Node instance (those exist).
    */
    var typeGetter = ({}).toString;
    window.Object.addPermanent (window.Object, 'typeStr', function (obj) {
        var tstr = typeGetter.apply(obj).slice(8,-1).toLowerCase();
        if (tstr == 'object')
            if (obj instanceof Buffer) return 'buffer';
            else return tstr;
        if (tstr == 'text') return 'textnode';
        if (tstr == 'comment') return 'commentnode';
        if (tstr.slice(0,4) == 'html') return 'element';
        return tstr;
    });
};

module.exports (window);
