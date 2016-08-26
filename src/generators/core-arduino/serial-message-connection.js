'use strict'
var sprintf = require('sprintf-js')

var weaver = require('../../code-weaver')
var Block = require('../../generator-block')
var Data = require('../data')

var PORT_SPEED = 115200

// TODO
// Rewrite by reading the buf until the message is complete.
// when message is read, stop reading from buf temporarily, and parse message.
// then start reading again
// pubsub:
// will accept a c function name
// the function should implement

class SerialConnection {

  constructor (id, props) {
    let speed = PORT_SPEED

    this.headers = []
    this.declarations = [
      `byte size_${id}[2]`,
      `int BytesToRead = 0`
      `byte command_${id}`,
      `char payload_${id}[2048];`,

      `int buf2size(byte[2] size) {`,
        `return (((int)size[0])<<8) & size[1];`,
      `}`,

      `void size2buf(int size, byte (*buf)[2]) {`,
        `buf[0] = (size >> 8) & 0xFF;`,
        `buf[1] = size & 0xFF;`,
      `}`,

      `byte[2] size2buf2(int size) {`,
        `byte buf[2]`,
        `buf[0] = (size >> 8) & 0xFF;`,
        `buf[1] = size & 0xFF;`,
        `return buf;`,
      `}`
    ]

    this.calls = {
      subscribe(topic, listenerFunctionName) {
        if (!topic || 'string' !== typeof topic) {
          throw new Error('topic', topic)
        }
        var lenEncodedCStr = encodeLen(topic.length)
        var commandLiteral = `"${lenEncodedCStr}#${topic}"`

        return new Block([
          `Serial.write(${commandLiteral});`
        ])
      },

      publish(topic, bytesData) {
        // TODO
      }
    }

    this.init = new Block([
      `Serial.begin(${speed});`
      ])

    this.loop = new Block([
      `int available = Serial.available();`,
      `if (available > 0) {`,
        `Serial.readBytes(size_${id}, 2);`,
        `int payloadSize = buf2size(size_${id})`,
        `command_${id} = (byte) Serial.read();`,
        `payload_${id} = Serial.readBytes(payload_${id}, payloadSize);`,
      `}`
    ])
  }
}

function encodeLen(value) {
  var lenUpper = (topic.length >>> 8) & 0xff
  var lenLower = topic.length & 0xff
  //var lenEncodedCStr = `\\x${lenUpper.toString(16)}\\x${lenLower.toString(16)}`
  var encoded = sprintf("\\x%'02X\\x%'02X", lenUpper, lenLower)
  return encoded
}

module.exports = SerialConnection
