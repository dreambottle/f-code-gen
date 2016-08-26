"use strict";
var sprintf = require("sprintf-js").sprintf;
var weaver = require("../../code-weaver");
var Block = require("../../generator-block");

function generateVInputFunc(id, port) {
    var block = new Block();
    block.add(sprintf("void vInput_%d(uint8_t s) {", id));
        block.add('if(s) {');
        block.add(weaver.triggerLink(id, "onKeyOn"));
        block.add('} else {');
        block.add(weaver.triggerLink(id, "onKeyOff"));
        block.add('}');
    block.add('}');
    block.add(sprintf('Hi_QGPIO_In(vInputTask_%d, vInput_%d, Status_%d, %s_PORT, %s_PIN);', id, id, id, port, port));
    return block;
}

function Input(moduleId, props) {
    var self = this;
    self.id = moduleId;
    self.props = props;

    self._port = props.Port.values.split(',')[props.Port.value];

    this.headers = [];
    // Should we have a utility function for variable declarations?
    this.declarations = [
        sprintf("char sts_tgl_%d = 0;", self.id)
    ];
    this.functions = [
        generateVInputFunc(self.id, self._port)
    ];

    this.calls = {
        State: function () {
            // TODO: figure out to_type(...) meaning in .hws
            return sprintf('(char) sts_tgl_%d);', self.id);
        }
    };
    
    this.init = new Block([
        sprintf('Hi_GPIO_InitIn(%s_PORT, %s_PIN);', self._port, self._port),
        sprintf('CreateTask2(vInputTask_%d);', self.id)
        ]);

}

module.exports = Input;
