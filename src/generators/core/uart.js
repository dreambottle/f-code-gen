"use strict";
// import '../code-weaver' as weaver
// import '../generator-block' as Block
var weaver = require('../../code-weaver')
var Block = require('../../generator-block')

class Uart {
    constructor(moduleId, props) {

        // "UART1"
        let port = props.Port.value
        let mode = props.Mode.value
        let echo = props.Echo.value
        let speed = props.Speed.value

        // let interval = props.Interval.value
        // let isEnabled = props.Enabled.value

        this.headers = []
        this.declarations = []
        this.functions = []
        this.calls = {
            doSendData(data) {
                return `Hi_UART_SendStr(Hi_Port${moduleId}, data);`
            }
        };
        
        this.init = new Block()
        this.init.add(`Hi_QGPIO_Out2(GPIOC, GPIO_Pin_9);`)
        this.init.add(`Hi_UART_Init(Hi_${port}}, ${mode}, ${echo}, ${speed});`)

        if (!!weaver.getLink(moduleId, "onByteData")) {
            let b = new Module()
            b.add('void vUARTListener_${moduleId}(uint8_t c) {')
                b.add(weaver.triggerLink(moduleId, "onByteData", 'Hi_CharToStr(c)'))
            b.add('}')
            this.functions.push(b)

            this.init.add(`Hi_UART_AddListener(Hi_${port}}, vUARTListener_${moduleId});`)
        }

        if (!!weaver.getLink(moduleId, "onByteData")) {
            let b = new Module()
            b.add('void vUARTEntListener_${moduleId}(uint8_t* s) {')
                b.add(weaver.triggerLink(moduleId, "onData", "s"))
            b.add('}')
            this.functions.push(b)

            this.init.add(`Hi_UART_AddEntListener(Hi_${port}}, vUARTEntListener_${moduleId});`)
        }
    }
}

module.exports = Uart
