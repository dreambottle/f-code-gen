'use strict'

var weaver = require('../../code-weaver')
var Block = require('../../generator-block')

var timerResolutionMillis = 1


/**
 * Timer one with a commmon Arduino TimerOne and CurieTimerOne libraries support
 * (Arduino 101 = Curie)
 */
class Timer {
  constructor (id, props) {
    let autostop = props.AutoStop.value
    let interval = props.Interval.value
    let isEnabled = props.Enabled.value
    let firstInit = !weaver.globals.timerLoop

    this.id = id

    if (weaver.board === weaver.boards.arduino101) {
      this.headers = ['<CurieTimerOne.h>']
    } else {
      this.headers = ['<TimerOne.h>']
    }
    this.declarations = [
      `int timer_interval_${id} = ${interval};`,
      `int timer_millis_${id} = ${interval};`,
      `int timer_count_${id} = ${autostop};`,
      // `int timer_count_default_${id} = ${autostop};`,
      `int is_timer_enabled_${id} = ${isEnabled};`
    ]

    this.functions = [this.generateTimerTaskFunction()]
    if (firstInit) {
      var timerFuncAndLoop = generateTimerCallbackAndLoop()
      this.functions.push(timerFuncAndLoop.func)
      // registers the global timer loop in the weaver. We will place countdown logic there. 
      weaver.globals.timerLoop = timerFuncAndLoop.loop
    }

    // this timer's countdown
    weaver.globals.timerLoop
    .add(`if (is_timer_enabled_${id}) { timer_millis_${id} -= millisPassed; }`)

    this.calls = {
      doStart(data) {
        return new Block([
          `timer_millis_${id} = ${interval};`,
          `timer_count_${id} = ${autostop};`,
          `is_timer_enabled_${id} = 1;`
        ])
      },
      doStop(data) {
        return new Block([
          `timer_millis_${id} = ${interval};`,
          `timer_count_${id} = 0;`,
          `is_timer_enabled_${id} = 0;`
        ])
      },
      Interval(data) {
        // read_int !!
        // func doInterval(_data)
        //   println(tim_drt,' = ',read_int(_data),';')
        // end
        return `timer_interval_${id} = ${data.value};`
      }
    }

    this.init = new Block()
    if (firstInit) {
      // initializes the TimerOne library (only once)
      if (weaver.board === weaver.boards.arduino101) {
        this.init.add(`CurieTimerOne.start(${timerResolutionMillis*1000}, &timerCallback);`)
      } else {
        this.init
        .add(`Timer1.initialize(${timerResolutionMillis*1000});`)
        .add(`Timer1.attachInterrupt(&timerCallback);`)
        // .add(`Timer1.start();`)
      }
    }

    // will do user logic in a regular loop
    this.loop = new Block([
      `timer_${id}_task();`
    ])
  }

  generateTimerTaskFunction () {
    let id = this.id
    let b = new Block()
    b.add(`void timer_${id}_task() {`)
      b.add(`if (is_timer_enabled_${id} && (timer_millis_${id} <= 0) ) {`)
        b.add(weaver.triggerLink(id, 'onEvent'))

        b.add(`if (timer_count_${id} == 1) {`)
          b.add(`is_timer_enabled_${id} = false;`)
          b.add(weaver.triggerLink(id, 'onAutoStop'))
        b.add(`} else if (timer_count_${id} > 1) {`)
          b.add(`--timer_count_${id};`)
        b.add('}')

        b.add(`timer_millis_${id} += timer_interval_${id};`)

      b.add(`}`)
    b.add('}')
    return b
  }

}

function generateTimerCallbackAndLoop () {
  let func = new Block(),
    loop = new Block()

  func.add(`void timerCallback() {`)
  // func.add('int newTicks = CurieTimerOne.rdRstTickCount();')
  // func.add(`int millisPassed = newTicks * ${timerResolutionMillis};`)
  func.add(`int millisPassed = ${timerResolutionMillis};`)
  func.add(loop)
  func.add('}')

  return {func, loop}
}

module.exports = Timer
