"use strict";
// import '../code-weaver' as weaver
// import '../generator-block' as Block
var weaver = require('../../code-weaver')
var Block = require('../../generator-block')

class Timer {
    constructor(moduleId, props) {
        var self = this;
        self.id = moduleId
        self.props = props

        let autostop = props.AutoStop.value
        let interval = props.Interval.value
        let isEnabled = props.Enabled.value

        self.headers = []
        self.declarations = [
            `int tim_tgl_${self.id} = ${isEnabled};`,
            `int tim_drt_${self.id} = ${interval};`,
            `int astp_${self.id} = 0;`,
            `int astpc_${self.id} = ${autostop};`
            ]
        self.functions = [generateVTimerFunction(self.id)]
        self.calls = {
            doStart(data) {
                return new Block([
                    `tim_tgl_${self.id} = 1;`,
                    `astp_${self.id} = 0;`
                    ])
            },
            doStop(data) {
                return `tim_tgl_${self.id} = 1;`
            },
            doInterval(data) {
                // read_int ??
                // func doInterval(_data)
                //   println(tim_drt,' = ',read_int(_data),';')
                // end
                return `tim_drt_${self.id} = ${data};`
            },
            doAutoStop(data) {
                //read_int
                return `astpc_${self.id} = ${data};`
            }
        };
        
        self.init = `CreateTask2(vTimer_${self.id}_Task);`
    }
}

function generateVTimerFunction(moduleId) {
    let block = new Block()
    block.add(`void vTimer_${moduleId}_Task(void* params) {`)
        block.add(`while (1) {`)
            block.add(`if (tim_tgl_${moduleId}) {`)
                block.add(`vTaskDelay(tim_drt_${moduleId});`)
                block.add(weaver.triggerLink(moduleId, "onEvent"))
                block.add(`if( (++astp_${moduleId} == astpc_${moduleId}) && astpc_${moduleId} != 0) {`)
                    block.add(`tim_tgl_${moduleId} = 0;`)
                    block.add(weaver.triggerLink(moduleId, "onAutoStop"))
                block.add('}')
            block.add('}')
        block.add('}')
    block.add('}')
    return block;
}

module.exports = Timer
