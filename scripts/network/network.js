import Neuron from './neuron.js';

class Network {
    constructor(numberOfNeuronsInLayers) {
        this.layers = numberOfNeuronsInLayers.length;
        this.neurons = [];
        this.weights = [];
        for (let i = 0; i < this.layers; i++) {
            this.neurons[i] = [];
            for (let j = 0; j < numberOfNeuronsInLayers[i]; j++) {
                this.neurons[i][j] = new Neuron();
            }
            if (i >= this.Layers - 1) continue;
            this.weights[i] = [];
            for (let j = 0; j < numberOfNeuronsInLayers[i]; j++) {
                this.weights[i][j] = [];
                for (let k = 0; k < numberOfNeuronsInLayers[i + 1]; k++) {
                    this.weights[i][j][k] = 0;
                }
            }
        }
    }

    setInput(values) {
        for (let i = 0; i < this.neurons[0].length; i++) {
            this.neurons[0][i].value = values[i];
        }
    }

    getMaxNeuronIndex(layerNumber) {
        let max = 0
        let maxIndex = 0
        for (let i = 0; i < this.neurons[layerNumber].length; i++) {
            if (this.neurons[layerNumber][i].value > max) {
                max = this.neurons[layerNumber][i].value
                maxIndex = i
            }
        }
        return maxIndex
    }

    getMaxNeuronIndexFromLastLayer() {
        return this.getMaxNeuronIndex(this.layers - 1)
    }

    forwardFeed() {
        for (let i = 1; i < this.layers; i++) {
            for (let j = 0; j < this.neurons[i].length; j++) {
                this.neurons[i][j].value = 0
                for (let k = 0; k < this.neurons[i - 1].length; k++) {
                    this.neurons[i][j].value += this.neurons[i - 1][k].value * this.weights[i - 1][k][j]
                }
                this.neurons[i][j].activate()
            }
        }
    }

    async loadWeightFromFile() {
        let data = await fetch( window.location.href + '/scripts/weights.txt').then(response => response.text())
        let textWeights = data.split(' ')
        let c = 0
        for (let i = 0; i < this.layers - 1; i++) {
            for (let j = 0; j < this.neurons[i].length; j++) {
                for (let k = 0; k < this.neurons[i + 1].length; k++) {
                    this.weights[i][j][k] = Number(textWeights[c].replace(',', '.'))
                    c++
                }
            }
        }
    }
}

export default Network