var Block = require('../../generator-block')
var weaver = require('../../code-weaver')

class DS18B20 {
    constructor(moduleId, props) {
        this.headers = []
        this.declarations = [
			`int temperature${moduleId} = 0;`,
			`int timer_duration${moduleId} = ${props.Interval.value};`
		]
		
		this.functions = [
			new Block([
				`void ds18b20_status_callback${moduleId}(uint8_t s${moduleId}) {`,
					weaver.triggerLink(moduleId, "onStatus", `s${moduleId}`),
				`}`,
				
				`void ds18b20_result_callback${moduleId}(double t${moduleId}) {`,
					`temperature${moduleId} = t${moduleId};`,
					weaver.triggerLink(moduleId, "onResult", `t${moduleId}`),
				`}`,
				
				`void ds18b20_timer_task${moduleId}(vp) {`,
					`while(1) {`,
						`if(timer_duration${moduleId} != 0) {`,
							`delay_task(timer_duration${moduleId});`,
							`ds18b20_scan(${props.Port.value}_PORT, ${props.Port.value}_PIN, ds18b20_status_callback${moduleId}, ds18b20_result_callback${moduleId});`,
						`}`,
					`}`,
				`}`
			])
		]
        
        this.calls = {
            doGetTemp(data) {
				return `ds18b20_scan(${props.Port.value}_PORT, ${props.Port.value}_PIN, ds18b20_status_callback${moduleId}, ds18b20_result_callback${moduleId});`;
			},
			
			doInterval(data) {
				return `timer_duration${moduleId} = ${data};`;
			},
			
			Temp(data) {
				return `temperature${moduleId}`;
			}
        };
        
        this.init = `create_task(ds18b20_timer_task${moduleId})`
        
    }
}

module.exports = DS18B20