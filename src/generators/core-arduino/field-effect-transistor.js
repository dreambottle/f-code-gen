"use strict"
var weaver = require("../../code-weaver")
var Block = require("../../generator-block")
var Output = require("./output")

class FieldEffectTransistor extends Output {
    constructor(id, props) {
        super(id, {port: 7})
    }
}

module.exports = FieldEffectTransistor
