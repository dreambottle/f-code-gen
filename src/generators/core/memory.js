"use strict";
// import '../code-weaver' as weaver
// import '../generator-block' as Block
var weaver = require('../../code-weaver')
var Block = require('../../generator-block')

class Memory {
    constructor(id, props) {

        let defaultVal = props.Default.value
        let memAlloc = props.MemAlloc.value

        this.headers = []
        this.declarations = []
        if (!defaultVal) {
            this.declarations.push(`char dat_${id}[${memAlloc}];`)
        } else {
            this.declarations.push(`char dat_${id}[${memAlloc}] = ${defaultVal};`)
        }
        this.functions = []
        this.calls = {
            doSetValue(data) {
                return new Block([
                    `memset(dat_${id}, 0, sizeof(dat_${id}));`,
                    `strcpy(dat_${id}, ${data});`,
                    weaver.triggerLink("onSetValue", `dat_${id}`)
                    ])
            },
            doClear(data) {
                return `memset(dat_${id}, 0, sizeof(dat_${id}));`
            },
            Value(data) {
                return `return dat_${id};`
            }
        };
        
        this.init = ""
    }
}

module.exports = Memory
