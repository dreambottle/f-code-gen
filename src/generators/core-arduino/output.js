'use strict'
var weaver = require('../../code-weaver')
var Block = require('../../generator-block')

class Output {
  constructor (id, props) {
    var port = props.port || props.Port.values.split(',')[props.Port.value]

    this.headers = []
    this.declarations = [
      // `int pin_${port}_state_${id} = 0;`
    ]
    this.functions = []

    this.calls = {
      doOn: function (data) {
        return `digitalWrite(${port}, HIGH);`
      },
      doOff: function (data) {
        return `digitalWrite(${port}, LOW);`
      },
      doInvert: function (data) {
        return `digitalWrite(${port}, !digitalRead(${port}));`
      },
      Status: function (data) {
        return `digitalRead(${port})`
      }
    }

    this.init = new Block([
      `pinMode(${port}, OUTPUT);`
    ])

    this.loop = ''
  }
}

module.exports = Output
