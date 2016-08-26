"use strict";
var weaver = require("../../code-weaver")

class IndexChannel {
    constructor(moduleId, props) {
        this.id = moduleId
        this.props = props

        // HARDCODE
        this.props.count = 5;

        this.functions = [
            this._generateIndexToChannelFunc(this.props.count)
            ]

        this.calls = {
            doEvent(data) {
                return `indexToChannel_${moduleId}(${data});`
            }
        }
    }

    _generateIndexToChannelFunc(count) {
        var b = new Block();
        b.add('void indexToChannel_${this.id}(int index) {')
        b.add('switch(index) {')
        for (let i = 0; i < count; i++) {
            let linkName = `onEvent${i}`
            if (!!weaver.getLink(this.id, linkName)) {
                b.add(`case ${i}:`)
                weaver.triggerLink(this.id, linkName)
                b.add('break;')
            }
        }
        b.add('default:')
        b.add('break;')
        b.add('}')
        b.add('}')
    }
}

module.exports = IndexChannel
