'use strict'
// import '../code-weaver' as weaver
// import '../generator-block' as Block
var weaver = require('../../code-weaver')
var Block = require('../../generator-block')
var Data = require('../data')

class Serial {
  constructor (id, props) {
    let speed = props.speed.value

    // let interval = props.Interval.value
    // let isEnabled = props.Enabled.value

    this.headers = []
    this.declarations = []

    this.functions = []

    this.calls = {
      doSendData(data) {
        var val = 0
        if (data) {
          val = data.value
        }
        return new Block([`Serial.write(${val});`])
      },
      onByteData() {}
    }

    this.init = new Block([`Serial.begin(${speed});`])

    this.loop = new Block([])
  }

}

module.exports = Serial
