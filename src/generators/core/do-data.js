"use strict";
// import '../code-weaver' as weaver
// import '../generator-block' as Block
var weaver = require('../../code-weaver')
var Block = require('../../generator-block')

class DoData {
    constructor(id, props) {

        let propdata = props.Data.value

        this.headers = []
        this.declarations = []
        this.functions = []

        this.calls = {
            doData(data) {
                return weaver.triggerLink(id, "onEventData", propdata)
            }
        };
        
        this.init = ""
    }
}

module.exports = DoData
