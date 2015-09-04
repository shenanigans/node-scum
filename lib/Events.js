
module.exports = function (window) {
    /**     @property/window.Object window.Object.DROP_LISTENER
        This constant is used with event listeners. Throwing it during an event handler will efficiently
        dequeue the handler.
    */
    var DROP_LISTENER = {};
    window.Object.addPermanent (window.Object, 'DROP_LISTENER', DROP_LISTENER);


    function addEventListener (event, call) {
        var listeners;
        if (!this._listeners) {
            this._listeners = {};
            listeners = this._listeners[event] = [ call ];
        } else {
            if (window.Object.hasOwnProperty.call (this._listeners, event)) {
                this._listeners[event].push (call);
                // the event listener function was already created
                return this;
            }
            listeners = this._listeners[event] = [ call ];
        }

        // the listener chain for this event was empty until now
        // add a property to catch DOM events.
        // Instead of keeping up with all possible DOM events, just make props for all events.
        var elem = this;
        this["on"+event] = function(){
            var ok = true;
            for (var i=0, j=listeners.length; i<j; i++)
                try {
                    var activeListener = listeners[i];
                    if (activeListener.apply (elem, arguments) === false)
                        ok = false;
                } catch (err) {
                    if (err === window.Object.DROP_LISTENER) {
                        listeners.splice (i,1);
                        i--; j--;
                        continue;
                    }
                    console.log (err, err.stack);
                    throw err;
                }
            return ok;
        };

        return this;
    }


    /**     @Function Node#on
        Add an event listener to a DOM Element. Events are queued FIFO and lose their place in line
        when dropped. During any DOM event handler, throw [window.Object.DROP_LISTENER]() to efficiently drop
        the handler.
    @argument/String event
        The name of the event to listen for. If this is a DOM event, omit the initial "on".
    @argument/Function call
        The listener Function to add to the event's queue.
    @argument/window.Object thisarg
        @optional
        The listener is applied on `thisarg` instead of this Element.
    @returns Element
        Self.
    */
    window.Object.addPermanent (window.Node.prototype, "on", addEventListener);


    /**     @Function window#on
        Add an event listener to `window`. Events are queued FIFO and lose their place in line
        when dropped.
    @argument/String event
        The name of the event to listen for. If this is a DOM event, omit the initial "on".
    @argument/Function call
        The function to add to the event's queue.
    @argument/window.Object thisarg
        @optional
        The listener is applied on `thisarg` instead of this Element.
    @returns Element
        Self.
    */
    window.Object.addPermanent (window, "on", addEventListener);


    /**     @Function document#on
        Add an event listener to `window`. Events are queued FIFO and lose their place in line
        when dropped.
    @argument/String event
        The name of the event to listen for. If this is a DOM event, omit the initial "on".
    @argument/Function call
        The function to add to the event's queue.
    @argument/window.Object thisarg
        @optional
        The listener is applied on `thisarg` instead of this Element.
    @returns Element
        Self.
    */
    // window.Object.addPermanent (document, "on", addEventListener);


    /**     @Function Element#emit
        Call the registered `once` event handlers, asynchronously, in FIFO order. Then call normal
        event handlers, also in FIFO order. Any handler that throws
        [DROP_LISTENER](type://element.DROP_LISTENER) is summarily dropped.
    */
    window.Object.addPermanent (window.Element.prototype, "emit", function () {
        if (!this._listeners) return this;
        if (!window.Object.hasOwnProperty.call (this._listeners, arguments[0]))
            return this;
        var listeners = this._listeners[arguments[0]];

        var args = [];Array.prototype.slice.call (arguments, 1);
        for (var i=1, j=arguments.length; i<j; i++)
            args.push (arguments[i]);

        for (var i=0,j=listeners.length; i<j; i++)
            listeners[i].apply (listeners[i]._this, args);
    });


    /**     @Function Element#dropListener
        Drop an event listener from this DOM Element.
    @argument/String event
        The name of the event not to listen to anymore, without the "on".
    @argument/Function call
        A reference to the callback we're to remove from the queue.
    @returns Element
        self.
    */
    window.Object.addPermanent (window.Element.prototype, "dropListener", function (event, call) {
        if (!this._listeners) return this;

        if (!window.Object.hasOwnProperty.call (this._listeners, event))
            return this;
        var calls = this._listeners[event];
        for (var i=0,j=calls.length; i<j; i++)
            if (calls[i] === call) {
                calls.splice (i, 1);
                i--; j--;
            }
        return this;
    });


    /**     @Function Element#dropEvent
    Drop all listeners on a given DOM event.
    @argument/String event
        The name of the event to nuke.
    @returns Element
        Self.
    */
    window.Object.addPermanent (window.Element.prototype, "dropEvent", function (event) {
        if (!this._listeners) return this;
        delete this._listeners[event];
        this["on"+event] = null;
        return this;
    });


    /**     @Function Element#dropAllEvents
        Drop all listeners on all DOM events on this Element.
    @returns Element
        Self.
    */
    window.Object.addPermanent (window.Element.prototype, "dropAllEvents", function (event) {
        if (!this._listeners) return this;
        for (var key in this._listeners)
            this["on"+key] = null;
        delete this._listeners;
        return this;
    });
};

module.exports (window);
