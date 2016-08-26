class Relay {

    constructor(moduleId, props) {
        this.headers = []
        this.declarations = []
        
        this.calls = {
            doOn(data) {
                return `Hi_GPIO_On(RELAY_PORT, RELAY_PIN);`
            },
            
            doOff(data) {
                return `Hi_GPIO_Off(RELAY_PORT, RELAY_PIN);`
            },
            
            doInvert(data) {
                return `Hi_GPIO_Invert(RELAY_PORT, RELAY_PIN);`
            },
            
            Status(data) {
                return `Hi_GPIO_ReadOutputDataBit(RELAY_PORT, RELAY_PIN)`
            },
        };
        
        this.init = "Hi_GPIO_InitOut(RELAY_PORT, RELAY_PIN, GPIO_Speed_2MHz);"
        
    }
}

module.exports = Relay