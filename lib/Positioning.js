
module.exports = function (window) {
    var OPTIMIZE_APPEND_DOC_FRAG = 3;

    /**     @Function Node#replace
        Remove this Node from the DOM and replace it with any number of other Nodes.
    */
    window.Object.addPermanent (window.Node.prototype, "replace", function (contents) {
        var contentsType = window.Object.typeStr (contents);
        if (contentsType != 'array' && contentsType != 'nodelist')
            contents = arguments;

        if (!contents.length)
            return this;
        if (contents.length == 1) {
            if (contents[0] !== this) {
                this.parentNode.insertBefore (contents[0], this);
                this.parentNode.removeChild (this);
            }
            return this;
        }

        var anchor = contents[contents.length-1];
        this.parentNode.insertBefore (anchor, this);
        if (anchor !== this)
            this.parentNode.removeChild (this);

        if (contents.length > OPTIMIZE_APPEND_DOC_FRAG) {
            var frag = window.document.createDocumentFragment();
            for (var i=0,j=contents.length-1; i<j; i++)
                frag.appendChild (contents[i]);
            parent.insertBefore (frag, anchor);
            return this;
        }

        for (var i=contents.length-1; i>=0; i--)
            this.parentNode.insertBefore (contents[i], anchor);
        return this;
    });


    /**     @member/Function Node#dispose
        Remove this Node or Element from the DOM. Just a little more elegant than calling
        `elem.parentNode.removeChild (elem);`.
    @returns/Node
        Self.
    */
    window.Object.addPermanent (window.Node.prototype, "dispose", function(){
        if (this.parentNode) this.parentNode.removeChild (this);
        return this;
    });


    /**     @member/Function Element#disposeChildren
        @synonym Element#dropChildren
        Convenience method to call `dispose` on all child nodes.
    @returns/Element
        Self.
    */
    window.Object.addPermanent (window.Element.prototype, "disposeChildren", function(){
        while (this.firstChild)
            this.removeChild (this.firstChild);
        return this;
    });
    window.Object.addPermanent (
        window.Element.prototype,
        "dropChildren",
        window.Element.prototype.disposeChildren
    );


    /**     @member/Function Node#appendText
        Append a text to this Node with the provided content. When called on an Element, the last Node
        is used, if it is a textual Node, or a new Text Node will be created and appended.
    @argument/String text
        Text content to append.
    @returns Node
        The Text Node containing the appended content.
    */
    window.Object.addPermanent (window.Node.prototype, "appendText", function (text) {
        this.textContent = this.textContent + text;
        return this;
    });
    window.Object.addPermanent (window.Element.prototype, "appendText", function (text) {
        if (window.Object.typeStr(this.lastChild) == 'textnode') {
            this.lastChild.textContent = this.lastChild.textContent + text;
            return this;
        }
        var newNode = window.document.createTextNode (text);
        this.appendChild (newNode);
        return this;
    });


    /**     @member/Function Element#append
        Synonym for native `appendChild`, except it accepts any number of Node arguments, or an Array
        of Nodes.
    @argument/Array contents
        @optional
        An Array of Nodes to append to this Element. Mutually exclusive with the `newChild` argument(s).
    @argument/Node newChild
        @optional
        Any number of Nodes to append to this Element. Mutually exclusive with the `contents` argument.
    @returns/Element
        Self.
    */
    window.Object.addPermanent (window.Element.prototype, "append", function (contents) {
        if (!contents) // called without args, append nothing
            return this;

        var contentsType = window.Object.typeStr (contents);
        if (contentsType != 'array' && contentsType != 'nodelist')
            contents = Array.prototype.slice.call (arguments);

        if (contents.length > OPTIMIZE_APPEND_DOC_FRAG) {
            var frag = window.document.createDocumentFragment();
            for (var i=0,j=contents.length; i<j; i++)
                frag.appendChild (contents[i]);
            this.appendChild (frag);
            return this;
        }

        for (var i=0,j=contents.length; i<j; i++)
            this.appendChild (contents[i]);
        return this;
    });


    /**     @member/Function Element#prepend
        Insert any number of Nodes as the first child(ren) of this Element.
    @argument/Array contents
        @optional
        An Array of Nodes to prepend to this Element. Mutually exclusive with the `newChild`
        argument(s).
    @argument/Node newChild
        @optional
        Any number of Nodes to prepend to this Element. Mutually exclusive with the `contents`
        argument.
    @returns/Element
        Self.
    */
    window.Object.addPermanent (window.Element.prototype, "prepend", function (contents) {
        if (!contents) // called without args, append nothing
            return this;

        var contentsType = window.Object.typeStr (contents);
        if (contentsType != 'array' && contentsType != 'nodelist')
            contents = Array.prototype.slice.call (arguments);

        if (contents.length > OPTIMIZE_APPEND_DOC_FRAG) {
            var frag = window.document.createDocumentFragment();
            for (var i=0,j=contents.length; i<j; i++)
                frag.appendChild (contents[i]);
            if (this.firstChild)
                this.insertBefore (frag, this.firstChild);
            else
                this.appendChild (frag);
            return this;
        }

        var sucker = this.firstChild;
        if (sucker)
            for (var i=0,j=contents.length; i<j; i++)
                this.insertBefore (contents[i], sucker);
        else
            for (var i=0,j=contents.length; i<j; i++)
                this.appendChild (contents[i]);

        return this;
    });


    /**     @member/Function Element#preFix
        Insert any number of Nodes directly before this Element. An Error will be thrown if this
        Element has no parent - but it doesn't have to be in the page yet.
    @argument/Array contents
        @optional
        An Array of Nodes to prefix to this Element. Mutually exclusive with the `newSib` argument(s).
    @argument/Node newSib
        @optional
        Any number of Nodes to prefix to this Element. Mutually exclusive with the `contents` argument.
    @returns/Element
        Self.
    */
    window.Object.addPermanent (window.Element.prototype, "preFix", function (contents) {
        var parent = this.parentNode;
        if (!parent)
            throw new Error ("cannot preFix Nodes on Element with no parent.");
        if (!contents) // called without args, append nothing
            return this;

        var contentsType = window.Object.typeStr (contents);
        if (contentsType != 'array' && contentsType != 'nodelist')
            contents = arguments;

        if (contents.length > OPTIMIZE_APPEND_DOC_FRAG) {
            var frag = window.document.createDocumentFragment();
            for (var i=0,j=contents.length; i<j; i++)
                frag.appendChild (contents[i]);
            parent.insertBefore (frag, this);
            return this;
        }

        for (var i=0,j=contents.length; i<j; i++)
            parent.insertBefore (contents[i], this);
        return this;
    });


    /**     @member/Function Element#postFix
        Insert any number of Nodes directly after this Element. An Error will be thrown if this
        Element has no parent - but it doesn't have to be in the page yet.
    @argument/Array contents
        @optional
        An Array of Nodes to postfix to this Element. Mutually exclusive with the `newSib` argument(s).
    @argument/Node newSib
        @optional
        Any number of Nodes to postfix to this Element. Mutually exclusive with the `contents` argument.
    @returns/Element
        Self.
    */
    window.Object.addPermanent (window.Element.prototype, "postFix", function (contents) {
        var parent = this.parentNode;
        if (!parent)
            throw new Error ("cannot postFix Nodes on Element with no parent.");
        if (!contents) // called without args, append nothing
            return this;

        var contentsType = window.Object.typeStr (contents);
        if (contentsType != 'array' && contentsType != 'nodelist')
            contents = arguments;

        var sib = this.nextSibling;

        if (contents.length > OPTIMIZE_APPEND_DOC_FRAG) {
            var frag = window.document.createDocumentFragment();
            for (var i in contents)
                frag.appendChild (contents[i]);
            if (sib)
                parent.insertBefore (frag, sib);
            else
                parent.appendChild (frag);
            return this;
        }

        if (sib)
            for (var i=0,j=contents.length; i<j; i++)
                parent.insertBefore (contents[i], sib);
        else
            for (var i=0,j=contents.length; i<j; i++)
                parent.appendChild (contents[i]);
        return this;
    });


    /**     @member/Function Element#elemIndexOf
        Search for an Element among this Element's children, counting only Element children. Returns
        `-1` if not found.
    @argument/Element item
        Element to search for among Element children.
    */
    window.Object.addPermanent (window.Element.prototype, "elemIndexOf", function (item) {
        for (var i=0,j=this.children.length; i<j; i++)
            if (item === this.children[i]) return i;
        return -1;
    });


    /**     @member/Function Element#nodeIndexOf
        Search for a Node among this Element's children, counting all child Nodes. Returns `-1` if not
        found.
    @argument/Node item
        Node to search for among all children.
    */
    window.Object.addPermanent (window.Element.prototype, "nodeIndexOf", function (item) {
        for (var i=0,j=this.childNodes.length; i<j; i++)
            if (item === this.childNodes[i]) return i;
        return -1;
    });


    /**     @member/Function Node#setText

    */
    window.Object.addPermanent (window.Node.prototype, "setText", function (text) {
        this.textContent = text;
        return this;
    });
    window.Object.addPermanent (window.Element.prototype, "setText", function (text) {
        while (this.firstChild)
            this.removeChild (this.firstChild);
        this.appendChild (window.document.createTextNode (text));
        return this;
    });
};

module.exports (window);
