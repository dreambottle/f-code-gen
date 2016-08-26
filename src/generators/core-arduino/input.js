"use strict";
var weaver = require("../../code-weaver");
var Block = require("../../generator-block");

class Input {
    constructor(id, props) {
        var port = props.port || props.Port.values.split(',')[props.Port.value]
        var intervalMs = 25 // 5 is fine too
        var keyOnSignal = "LOW"

        this.headers = ['"Bounce2.h"']
        this.declarations = [
            `Bounce input_debouncer_${id} = Bounce();`,
            `int input_${id};`
        ];
        this.functions = []

        this.calls = {
            State: function () {
                return `input_${id}`
            }
        };
        
        this.init = new Block([
            `pinMode(${port}, INPUT_PULLUP);`,
            `input_debouncer_${id}.attach(${port});`,
            `input_debouncer_${id}.interval(${intervalMs});`,
            `input_${id} = input_debouncer_${id}.read();`
            ]);

        this.loop = new Block([
            `// Input ${port} (id:${id})`,
            // `int new_input_${id} = digitalRead(${port});`,
            `input_debouncer_${id}.update();`,
            `int new_input_${id} = input_debouncer_${id}.read();`,
            `if (new_input_${id} != input_${id}) {`,
                `input_${id} = new_input_${id};`,
                `if (input_${id} == ${keyOnSignal}) {`,
                    weaver.triggerLink(id, "onKeyOn"),
                '} else {',
                    weaver.triggerLink(id, "onKeyOff"),
                '}',
            '}'
            ])
    }
}

module.exports = Input;
