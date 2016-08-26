"use strict";

var sprintf = require("sprintf-js").sprintf;

function OutputModule(moduleId, props) {
    var self = this;
    self.id = moduleId;
    self.props = props;

    self._port = props.Port.values.split(',')[props.Port.value];
    // console.log(self._port)

    self.includes = [];
    self.declarations = [];
    self.functions = [];

    self.init = sprintf("Hi_GPIO_InitOut(%s_PORT, %s_PIN, GPIO_Speed_2MHz);", self._port, self._port);

    self.calls = {
        doOn: function (data) {
            return sprintf('Hi_GPIO_On(%s_PORT, %s_PIN);', self._port, self._port);
        },
        doOff: function (data) {
            return sprintf('Hi_GPIO_Off(%s_PORT, %s_PIN);', self._port, self._port);
        },
        doInvert: function (data) {
            return sprintf('Hi_GPIO_Invert(%s_PORT, %s_PIN);', self._port, self._port);
        },
        Status: function (data) {
            // TODO: figure out to_type(...) meaning in .hws
            return sprintf('(char) Hi_GPIO_ReadOutputDataBit(%s_PORT, %s_PIN);', self.id, self._port, self._port);
        }
    };
    
}

module.exports = OutputModule;
