"use strict";
// import '../code-weaver' as weaver
// import '../generator-block' as Block
var weaver = require('../../code-weaver')
var Block = require('../../generator-block')

class Counter {
    constructor(id, props) {

        // let port = props.Port.value
        let min = props.Min.value
        let max = props.Max.value
        let defaultVal = props.Default.value

        this.headers = []
        this.declarations = [`double cnt_${id} = ${defaultVal}`]
        this.functions = []
        this.calls = {
            doNext(data) {
                var b = new Block()
                b.add(`cnt_${id},' += Step;`)
                b.add(`if(cnt_${id} > ${max}) cnt_${id} = ${min};`)
                b.add(`else if(cnt_${id} < ${min}) cnt_${id} = ${max};`)
                b.add(weaver.triggerLink(id, "onCounter", `cnt_${id}`))
                return b
            },
            doPrev(data) {
                var b = new Block()
                b.add(`cnt_${id},' -= Step;`)
                b.add(`if(cnt_${id} > ${max}) cnt_${id} = ${min};`)
                b.add(`else if(cnt_${id} < ${min}) cnt_${id} = ${max};`)
                b.add(weaver.triggerLink(id, "onCounter", `cnt_${id}`))
                return b
            },
            doReset(data) {
                var b = new Block()
                b.add(`cnt_${id},' = ${defaultVal};`)
                b.add(weaver.triggerLink(id, "onCounter", `cnt_${id}`))
                return b
            },
            doSetValue(data) {
                var b = new Block()
                b.add(`cnt_${id},' = ${data};`)
                b.add(weaver.triggerLink(id, "onCounter", `cnt_${id}`))
                return b
            },
            Value(data) {
                return `cnt_${id}`
            }
        };
        
        this.init = ""
    }
}

module.exports = Counter
