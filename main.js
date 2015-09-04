
/**     @class Node
    DOM Nodes receive a variety of utilities grafted directly onto the prototype, for stylishly
    managing DOM positioning.
*/


/**     @class Element
    @super Node
    DOM Elements receive a large assortment of utilities grafted directly onto the prototype.
    Stylish methods for interacting with DOM positioning and classes, a node-style event API, and a
    rich WYSIWYG editing solution based on `contenteditable` spiked with `textarea` input proxying.
*/


/**     @class NodeList
    Most methods available on `Element` and `Node` may be called directly on a `NodeList` to apply
    changes to all children. These upgrades exist primarily to enhance the functionality of
    `document.querySelector`.
*/

var addPermanent = require ('./lib/addPermanent');
addPermanent (window);
var classes = require ('./lib/Classes');
classes (window);
var events = require ('./lib/Events');
events (window);
var positioning = require ('./lib/Positioning');
positioning (window);

module.exports = function (window) {
    addPermanent (window);
    classes (window);
    events (window);
    positioning (window);
};
