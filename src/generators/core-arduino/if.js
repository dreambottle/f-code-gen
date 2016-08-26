'use strict'
var weaver = require('../../code-weaver')
var Block = require('../../generator-block')

// TODO
class If {
  constructor (id, props) {
    var port = props.port || props.Port.values.split(',')[props.Port.value]
    var op0 = props.Op0.value || 0
    var op1 = props.Op1.value || 0

    this.headers = []
    this.declarations = []
    this.functions = []

    this.calls = {
      State: function () {
        return ``
      }
    }

    this.init = new Block([])

    this.loop = new Block([])
  }
}

module.exports = If
