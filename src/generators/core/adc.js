var Block = require('../../generator-block')
var weaver = require('../../code-weaver')

function generateTask(moduleId, port) {
    let block = new Block()
    block.add(`void adc_task${moduleId}(vp) {`)
        block.add(`while(1) {`)
            block.add(`if(timer_duration${moduleId} != 0) {`)
                block.add(`value${moduleId} = adc_read(AD_CH_${port});`)
                block.add(weaver.triggerLink(moduleId, "onGetValue", `value${moduleId}`))
            block.add(`}`)
        block.add(`}`)
    block.add(`}`)
    return block;
}

class ADC {
    constructor(moduleId, props) {
        this.headers = []
        this.declarations = [
			`int value${moduleId} = 0;`,
			`int timer_duration${moduleId} = ${this.props.Interval.value};`
		]
		
		this.functions = [
			generateTask(moduleId, props.Port.value)
		]
        
        this.calls = {
            doGetValue(data) {
				let block = new Block()
                block.add(`Hi_GPIO_On(FE_TRANSISTOR_PORT, FE_TRANSISTOR_PIN);`)
				block.add(weaver.triggerLink(moduleId, "onGetValue", `value${moduleId}`))
				return block
            },
			
			doInterval(data) {
				return `timer_duration${moduleId} = ${data};`
			},
			
			ADCValue(data) {
				return `value${moduleId}`
			}
        };
        
        this.init = new Block([
			`adc_init(TP_${props.Port.value});`
			`create_task(adc_task${moduleId});`
		])
        
    }
}

module.exports = ADC