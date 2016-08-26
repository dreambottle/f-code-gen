"use strict";

var weaver = require("../../code-weaver")
var Block = require("../../generator-block")

class Hub {
    constructor(id, props) {

        var inCount = props.InCount.value;

        this.calls = {}
        for (let i = 1; i <= inCount; i++) {
            this.calls[`doEvent${i}`] = function (data) {
                var block = new Block();
                var outCount = props.OutCount.value
                for (let j = 1; j <= outCount; j++) {
                    if (!!weaver.getLink(id, "onEvent" + j)) {
                        block.add(weaver.triggerLink(id, "onEvent" + j, data))
                    }
                }
                return block
            }
        }

    }
}

module.exports = Hub


// func doEvent(_data, _idx):any
//   fvar(i)    

//   if (cur_event > 0)
//     trace('Компонент Hub (doEvent' && cur_work && '): внимание - бесконечная рекурсия. Вызов doEvent' && (_idx + 1) && ' из события onEvent' && cur_event && ' пропущен!')
//     return(0)
//   end

//   cur_event = 0
//   cur_work = _idx + 1
//   for(i = 1; i <= _event_count_; i++)
//     cur_event = i
//     event("onEvent" + i, _data)
//   end
//   cur_work = 0
//   cur_event = 0

// end