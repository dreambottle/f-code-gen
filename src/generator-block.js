"use strict";

function Block(elements) {
    this._elements = [];
    if (!(elements instanceof Array)) {
        this.add(elements);
    } else {
        // TODO add validity check
        this._elements = elements;
    }
}

Block.isValidElement = function (element) {
    return (typeof element === "string" ||
            typeof element === "function" ||
            element instanceof Block);
}

Block.prototype.add = function (element) {
    if (Block.isValidElement(element)) {
        this._elements.push(element);
    }
    return this
}

// callstack is an array of Blocks
Block.prototype.toString = function (callStack) {
    var strings = [];
    var self = this;
    this._elements.forEach(function(element) {
        while (typeof element === "function") {
            var result = element();
            if (!Block.isValidElement(result)) {
                console.log("Warning! Block function returned an invalid result: '" + result + "'.\n Function:\n",
                    element);
                return;
            } else {
                element = result;
            }
        }
        if (element instanceof Block) {
            // stringify the block
            // TODO: test if this actually works
            callStack = callStack || []
            if (callStack.indexOf(self) >= 0) {
                throw new Error("Cyclic block includes! Block contents:\n" +
                        self._elements +
                        "\nCall stack:\n" +
                        callStack);
            }
            callStack.push(self);
            element = element.toString(callStack);
            callStack.pop();
        }
        strings.push(element);
    });
    return strings.join("\n");
}

module.exports = Block;
