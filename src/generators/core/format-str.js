"use strict";
// import '../code-weaver' as weaver
// import '../generator-block' as Block
var weaver = require('../../code-weaver')
var Block = require('../../generator-block')

class FormatStr {
    constructor(id, props) {

        let port = props.Port.value
        let mask = props.Mask.value
        let dataCount = props.DataCount.value
        let inputAsStr = props.InputAsString.value
        let mamAlloc = props.MemoryAllocation.value

        this.headers = []
        this.declarations = [`char* buf_${id}`]
        this.functions = []

        this.calls = {
            doFormatStr(data) {
                var b = new Block()
                b.add(`buf_${id} = (char*) pvPortMalloc(${memAlloc});`)
                
                var str = 'sprintf(buf_${id}, ${mask}'
                for(let i = 1; i <= dataCount; i++) {
                    str += ", " + generateData(i, data)
                }
                str += ');'
                b.add(str);
                
                b.add(weaver.triggerLink(id, "onFormatStr", `buf_${id}`))
                b.add(`vPortFree(buf_${id});`)
                return b
            },
            Result(data) {
                // ????
                return `buf_${id}`
            }
        };
        
        this.init = ""


        function generateData(i, data) {
            // fvar(t)
            // if(cgt.pt_get_link_point(cgt.pt_arr_data(i-1)) != 0) // If linked
            //   t = point("Str" + i)
            //   return(InputAsString ? read_str(t) : ((t == '')?" ":t))
            // else
            //   return(InputAsString ? read_str(dt) : ((dt == '')?" ":dt))
            // end

            // DUNNO IF THIS IS CORRECT:
            if (!!weaver.getLink(id, "Str" + i)) {
                return weaver.triggerLink(id, "Str" + i)
            } else {
                return data
            }
        }
    }
}

module.exports = FormatStr
