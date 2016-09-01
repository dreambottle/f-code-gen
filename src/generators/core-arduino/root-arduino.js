'use strict'
var _ = require('lodash')
var weaver = require('../../code-weaver')
var Block = require('../../generator-block')

class RootArduinoModule {
  constructor () {
    this.includes = []
  }

  generate (props) {
    // header block
    var inclBlock = new Block()
    var headers = this.includes // potential bug if this module is used more that once
    _.each(weaver.modules, function (module, id) {
      if (module.headers !== undefined) {
        headers = headers.concat(module.headers)
      }
    })
    headers = _.uniq(headers)
    _.each(headers, function (header) {
      inclBlock.add('#include ' + header)
    })

    // declarations
    var declBlock = new Block()
    _.each(weaver.modules, function (m) {
      if (!(m.declarations instanceof Array)) m.declarations = [m.declarations]
      _.each(m.declarations, function (decl) {
        declBlock.add(decl)
      })
    })

    // functions
    var funcBlock = new Block()
    _.each(weaver.modules, function (m) {
      if (!(m.functions instanceof Array)) m.functions = [m.functions]
      _.each(m.functions, function (func) {
        funcBlock.add(func)
      })
    })

    // init
    var setupBlock = new Block()
    setupBlock.add('void setup() {')
    _.each(weaver.modules, function (m) {
      if (m.init) setupBlock.add(m.init)
    })
    setupBlock.add('}')

    // loop
    var loopBlock = new Block(['void loop() {'])
    _.each(weaver.modules, function (m) {
      if (m.loop) loopBlock.add(m.loop)
    })
    loopBlock.add('}')

    var rootBlock = new Block([
      inclBlock, '',
      declBlock, '',
      funcBlock, '',
      setupBlock, '',
      loopBlock])
    return rootBlock
  }
}

RootArduinoModule.defaultFileName = 'arduino-project.ino'

module.exports = RootArduinoModule
