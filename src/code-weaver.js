"use strict"
var _ = require("lodash")

// TODO move this all to a separate file
var modulesDictionaryNeuro = {
    "Input"          : "./generators/core/input",
    "Output"         : "./generators/core/output",
    "Timer"          : "./generators/core/timer",
    "Hub"            : "./generators/core/hub",
    "IndexToChannel" : "./generators/core/channel-index",
    "ChannelToIndex" : "./generators/core/index-channel",
    "Counter"        : "./generators/core/counter",
    "UART"           : "./generators/core/uart",
    "FormatStr"      : "./generators/core/format-str",
    "Memory"         : "./generators/core/memory",
    "iButton"        : "./generators/core/ibutton",
    "Relay"          : "./generators/core/relay",
    "DS18B20"        : "./generators/core/ds18b20"
}

var modulesDictionaryArduino101 = {
    // Inputs
    "ArduinoInput"          : "./generators/core-arduino/input",
    "Input"                 : "./generators/core-arduino/input",
    "Switch"                : "./generators/core-arduino/input",
    "Button"                : "./generators/core-arduino/input",
    "Door"                  : "./generators/core-arduino/input",
    "Fire"                  : "./generators/core-arduino/input",
    "Motion"                : "./generators/core-arduino/input",

    // Outputs
    "ArduinoOutput"         : "./generators/core-arduino/output",
    "Output"                : "./generators/core-arduino/output",
    "LED"                   : "./generators/core-arduino/output",
    "Fan"                   : "./generators/core-arduino/output",
    "Engine"                : "./generators/core-arduino/output",
    "MagneticLock"          : "./generators/core-arduino/output",

    "FieldEffectTransistor" : "./generators/core-arduino/output",

    "Timer"          : "./generators/core-arduino/timer-one",

    "HubEx"          : "./generators/core/hub",
    "Hub"            : "./generators/core/hub"
}

var modulesDictionaryArduinoUno = {
    // Inputs
    "ArduinoInput"          : "./generators/core-arduino/input",
    "Input"                 : "./generators/core-arduino/input",
    "Switch"                : "./generators/core-arduino/input",
    "Button"                : "./generators/core-arduino/input",
    "Door"                  : "./generators/core-arduino/input",
    "Fire"                  : "./generators/core-arduino/input",
    "Motion"                : "./generators/core-arduino/input",

    // Outputs
    "ArduinoOutput"         : "./generators/core-arduino/output",
    "Output"                : "./generators/core-arduino/output",
    "LED"                   : "./generators/core-arduino/output",
    "Fan"                   : "./generators/core-arduino/output",
    "Engine"                : "./generators/core-arduino/output",
    "MagneticLock"          : "./generators/core-arduino/output",

    "FieldEffectTransistor" : "./generators/core-arduino/output",

    "Timer"          : "./generators/core-arduino/timer-one",

    "HubEx"          : "./generators/core/hub",
    "Hub"            : "./generators/core/hub"
}

var rootModulesDictionary = {
    "Neuro-Ethernet" : "./generators/core/init-c",
    "arduino-101"    : "./generators/core-arduino/root-arduino",
    "arduino-uno"    : "./generators/core-arduino/root-arduino"
}

exports.boards = {
  arduino101: "arduino-101",
  arduinoUno: "arduino-uno"
}

var configuration
var loaded = false

exports.globals = {}
exports.modules = {}
exports.board = ''

exports.setProjectConfig = function (config) {
    configuration = config
    loaded = false
}

exports.loadModules = function () {
    exports.modules = {}
    exports.globals = {}

    // 0. Pre-configuration
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // If not set, assume Arduino-101
    var board = exports.board = configuration.Make || exports.boards.arduino101
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // 1. Board root module initialization step
    var rootModulePath = rootModulesDictionary[board]

    if (!rootModulePath) {
        throw new Error ("No root module found for project type '${board}'")
    }
    var RootModule = require(rootModulePath)
    exports.rootModule = new RootModule(exports)

    // 2. Board modules load step
    var modulesDictionary = getModulesDictionaryForBoard(board)
    configuration.elements.forEach(function(element) {
        console.log("Processing element '%s'", element.name)
        var modulePath = modulesDictionary[element.name]
        if (modulePath) {
            var Module = require(modulePath)
            if (Module) {
                exports.modules[element.id] = new Module(element.id, element.props)
            }
        } else {
            console.log("Generator module not found for " + element.name)
        }
    })

    loaded = true
}

exports.weave = function () {
    if (!loaded) {
        exports.loadModules()
    }
    // todo check if exports.rootModule exists
    var rootBlock = exports.rootModule.generate()
    return rootBlock.toString()
}

exports.generateCall = function (elementId, callName, data) {
    // console.log(elementId, callName, data)
    var module = exports.modules[elementId]
    if (module instanceof Object && module.calls && module.calls[callName] instanceof Function) {
        return module.calls[callName](data)
    } else {
        console.log("Warning! Couldn't generate a call for " + callName + " in " + elementId)
        return ""
    }
}

exports.triggerLink = function (elementId, linkName, data) {
    var element = getConfigElementById(elementId)
    if (!element) {
        let msg = `Element id:${elementId} not found.`
        console.log(msg)
        return "// " + msg
    }

    var link = _.find(element.links, (link) => (link.start === linkName) )
    if (!link) {
        console.log(`Event ${linkName} not found in element ${element.name} id:${element.id}.`)
        return `// ${linkName} not avail. in ${elementId}`
    }

    return function () {
        console.log(`call from ${elementId}, ${linkName} to ${link.toId}, ${link.toDot}, ${data}`)
        return exports.generateCall(link.toId, link.toDot, data)
    }
}

exports.getLink = function (elementId, linkName) {
    var element = getConfigElementById(elementId)
    if (!element) return null

    return _.find(element.links, (link) => (link.start === linkName) )
}

function getConfigElementById(elementId) {
    return _.find(configuration["elements"], (el) => el.id === elementId )
}

function getModulesDictionaryForBoard(board) {
  switch (board) {
    case exports.boards.arduino101:
      return modulesDictionaryArduino101
    case exports.boards.arduinoUno:
      return modulesDictionaryArduinoUno
    default:
      return {}
  }
}
