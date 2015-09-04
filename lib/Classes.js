
module.exports = function (window) {
    /*      @member/Function window.Element#addClass
    Add a css classname to the class attribute.
    @name Element#addClass
    @function
    @param {String} classname A string representing the class. Assumed to be a
        single, valid class name.
    @returns {Element} self.
    */
    window.Object.addPermanent (window.Element.prototype, "addClass", function (classname) {
        var current = this.className.length ? this.className.split (' ') : [];
        if (current.indexOf (classname) >= 0) return this;
        current.push (classname);
        this.className = current.join (" ");
        return this;
    });


    /**
    Drop a css classname from the class attribute.
    @name Element#dropClass
    @function
    @param {String} classname A string representing the class. Assumed to be a
        single, valid class name.
    @returns {Element} self.
    */
    window.Object.addPermanent (window.Element.prototype, "dropClass", function (classname) {
        var current = this.className.length ? this.className.split (' ') : [];
        var i = current.indexOf (classname);
        if (i < 0) return this;
        current.splice (i, 1);
        this.className = current.join (" ");
        return this;
    });


    /**
    Test whether a given class has been set.
    @name Element#hasClass
    @function
    @param {String} classname The classname to search for.
    @returns {Boolean} Whether the classname exists on this Element.
    */
    window.Object.addPermanent (window.Element.prototype, "hasClass", function (classname) {
        var current = this.className.length ? this.className.split (' ') : [];
        return current.indexOf(classname) >= 0 ? true : false;
    });


    /**
    Set the exact list of css classes on an Element with an Array.
    @name Element#setClass
    @function
    @param {Array[String]} classname An array of css classes to be set on this Element.
    @returns {Element} self.
    */
    window.Object.addPermanent (window.Element.prototype, "setClass", function (classname) {
        if (!(classname instanceof Array))
            classname = Array.prototype.slice.call (arguments);
        this.className = classname.join (" ");
        return this;
    });
};

module.exports (window);
