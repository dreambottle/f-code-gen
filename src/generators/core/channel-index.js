"use strict";
var weaver = require("../../code-weaver")

class ChannelIndex {
    constructor(moduleId, props) {

        this.calls = {
            doWork(data, idx) {
                weaver.triggerLink(moduleId, "onIndex", idx);
            }
        }
    }
}

module.exports = ChannelIndex
