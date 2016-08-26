"use strict";
var weaver = require("../../code-weaver");
var Block = require("../../generator-block");
var Output = require("./output")

class Relay extends Output {
    constructor(id, props) {
        super(id, {port: 6})
    }
}

module.exports = Relay;
