'use strict'
var sprintf = require('sprintf-js')

var weaver = require('../../code-weaver')
var Block = require('../../generator-block')
var Data = require('../data')

var PORT_SPEED = 115200

class SerialConnection {

  constructor (id, props) {
    let speed = PORT_SPEED

    this.headers = []

    this.declarations = new Block([
`
#ifndef SERIAL_DECLARATIONS_ONCE
#define SERIAL_DECLARATIONS_ONCE

//#define MAX_TOPICS 12
#define SERIAL_BAUD ${speed}
#define SERIAL_BUFFER_SIZE 512

//char* topics[MAX_TOPICS];

PROGMEM char* const input1Topic = "/arduinodemo/i/1";
PROGMEM char* const input2Topic = "/arduinodemo/i/2";
PROGMEM char* const outButtonOnTopic  = "/arduinodemo/s/11";
PROGMEM char* const outButtonOffTopic = "/arduinodemo/s/12";
/*
char payload[SERIAL_BUFFER_SIZE];
int serialMessageSize = 0;
byte command = 0;
char* messageCursor = payload;
*/
int buf2size(byte size[2]) {
  return (((int)size[0])<<8) & size[1];
}

void size2buf(int size, byte (&buf)[2]) {
  buf[0] = (byte) ((size>>8) & 0xFF);
  buf[1] = (byte) (size & 0xFF);
}

void onSerialMessageRead(char* topic, byte* data, size_t dataSize) {
  if (0 == strcmp(topic, input1Topic)) {
    // Do onInput1
`,
    // TODO pass data as arg
    weaver.generateCall(id, 'onInput1'),
`
  } else if (0 == strcmp(topic, input2Topic)) {
    // Do onInput2
`,
    weaver.generateCall(id, 'onInput2'),
`
  }
}

inline void setDefaultSerialTimeout() {
  Serial.setTimeout(1000);
}

inline void doSendMessage(char* topic, byte* data, size_t dataSize) {
  writeMessage('$', topic, data, dataSize);
}

inline void subscribe(char* topic) {
  writeMessage('#', topic, NULL, 0);
}

void writeMessage(char messageType, char* topic, byte* data, size_t dataSize) {
  int len = strlen(topic);
  byte sizeBuf[2];
  size2buf(len + dataSize + 1, sizeBuf);
  Serial.write(sizeBuf, 2);
  Serial.write(messageType);
  Serial.write(topic, len);
  if (dataSize != 0 && data != NULL) {
    Serial.write(':');
    Serial.write(data, dataSize);
  }

  // block until 000 (ok) response.
  Serial.setTimeout(300);
  for (int i = 0; i < 3; ++i) {
    if (Serial.read() != 0) {
      // TODO handle error
      break;
    }
  }
  setDefaultSerialTimeout();
}

void tryReadSerialMessage() {
  // allocate on stack
  char payload[SERIAL_BUFFER_SIZE];
  int serialMessageSize = 0;
  byte command = 0;
  char* messageCursor = payload;

  // skip until all 3 bytes of header available
  if (Serial.available() >= 3) {
    memset(payload, 0, SERIAL_BUFFER_SIZE);
    
    byte sizeBuf[2];
    Serial.readBytes(sizeBuf, 2);
    serialMessageSize = buf2size(sizeBuf);
    command = (byte) Serial.read();
    
    messageCursor = payload;
    int toRead = serialMessageSize;
    //int retries = 0;
    while(toRead > 0) {
      int nRead = Serial.readBytes(messageCursor, toRead);
      messageCursor += nRead;
      toRead -= nRead;
      //++retries;
    }

    // send ok
    Serial.write(0);
    Serial.write(0);
    Serial.write(0);
    
    // begin processing
    if (serialMessageSize != 0) {
    // messagecursor to start of payload
      messageCursor = strchr(payload, ':');
      if (NULL != messageCursor) {
        *messageCursor = 0;
        // payload now points to a topic only (0-terminated char*)
        messageCursor += 1; // points to the start of the actual data, without topic
        size_t dataSize = serialMessageSize - (messageCursor - payload);
        
        onSerialMessageRead(payload, (byte*) messageCursor, dataSize);
      }
    }
  }
}
#endif //SERIAL_DECLARATIONS_ONCE
`
    ])

    this.calls = {
      // subscribe(topic, listenerFunctionName) {
      //   if (!topic || 'string' !== typeof topic) {
      //     throw new Error('topic', topic)
      //   }
      //   var lenEncodedCStr = encodeLen(topic.length)
      //   var commandLiteral = `"${lenEncodedCStr}#${topic}"`

      //   return new Block([
      //     `Serial.write(${commandLiteral});`
      //   ])
      // },

      // HARDCODE
      doButtonOn(data) {
        return doSendMessage('arduinodemo', 11, data)
      },
      doButtonOff(data) {
        return doSendMessage('arduinodemo', 12, data)
      }
    }

    this.init =
`
#ifndef SERIAL_SETUP_ONCE
#define SERIAL_SETUP_ONCE
  Serial.begin(SERIAL_BAUD);
  while (!Serial) {}
  // HARDCODE
  subscribe(input1Topic);
  subscribe(input2Topic);
#endif //SERIAL_SETUP_ONCE
`

    this.loop = 
`
  #ifndef SERIAL_LOOP_ONCE
  #define SERIAL_LOOP_ONCE
  tryReadSerialMessage();
  #endif //SERIAL_LOOP_ONCE
`
  }
}

function doSendMessage (fromProject, fromId, data) {
  var value = 'NULL'
  var len = 0
  var type = Data.TYPE_BYTEARRAY
  // TODO actually send data
  // if (data && data.value) {
  //   value = data.value
  // }
  return `doSendMessage("/${fromProject}/${type}/${fromId}", ${value}, ${len});`
}

function encodeLen(value) {
  var lenUpper = (topic.length >>> 8) & 0xff
  var lenLower = topic.length & 0xff
  //var lenEncodedCStr = `\\x${lenUpper.toString(16)}\\x${lenLower.toString(16)}`
  var encoded = sprintf("\\x%'02X\\x%'02X", lenUpper, lenLower)
  return encoded
}

module.exports = SerialConnection
