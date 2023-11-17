import { sigmoid } from "./utils.js"

class Neuron {
    constructor() {
        this.value = 0
        this.error = 0
    }
    activate() {
        this.value = sigmoid(this.value)
    }
}

export default Neuron