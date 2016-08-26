class FieldEffectTransistor {

    constructor(moduleId, props) {
        this.headers = []
        this.declarations = []
        
        this.calls = {
            doOn(data) {
                return `Hi_GPIO_On(FE_TRANSISTOR_PORT, FE_TRANSISTOR_PIN);`
            },
            
            doOff(data) {
                return `Hi_GPIO_Off(FE_TRANSISTOR_PORT, FE_TRANSISTOR_PIN);`
            },
            
            doInvert(data) {
                return `Hi_GPIO_Invert(FE_TRANSISTOR_PORT, FE_TRANSISTOR_PIN);`
            },
            
            Status(data) {
                return `Hi_GPIO_ReadOutputDataBit(FE_TRANSISTOR_PORT, FE_TRANSISTOR_PIN)`
            },
        };
        
        this.init = "Hi_GPIO_InitOut(FE_TRANSISTOR_PORT, FE_TRANSISTOR_PIN, GPIO_Speed_2MHz);"
        
    }
}

module.exports = FieldEffectTransistor