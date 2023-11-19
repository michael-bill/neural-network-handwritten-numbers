import Network from './network/network.js'

const resultLabel = document.getElementById("result-label")
const clearButton = document.getElementById("clear-button")
const slider = document.getElementById("brush-slider")
const canvas = document.getElementById("canvas-draw")
const ctx = canvas.getContext("2d")
const IMG_SIZE = 28
const PIXEL_SIZE = 10

let image = []
for (let i = 0; i < IMG_SIZE; i++) {
    image[i] = []
    for (let j = 0; j < IMG_SIZE; j++) {
        image[i][j] = 0
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    ctx.beginPath()
    for (let i = 0; i < IMG_SIZE; i++) {
        for (let j = 0; j < IMG_SIZE; j++) {
            let color = image[i][j] * 255
            ctx.fillStyle = `rgb(${color}, ${color}, ${color})`
            ctx.fillRect(i * PIXEL_SIZE, j * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
        }
    }
    ctx.closePath()
}

let painting = false

function mouseDown(event) {
    painting = true
}

let brushWeight = 0.5
function mouseMove(offsetX, offsetY) {
    if (painting) {
        let mx = Math.floor(offsetX / PIXEL_SIZE)
        let my = Math.floor(offsetY / PIXEL_SIZE)
        for (let i = 0; i < IMG_SIZE; i++) {
            for (let j = 0; j < IMG_SIZE; j++) {
                let dist = (i - mx) * (i - mx) + (j - my) * (j - my)
                if (dist < 1) dist = 1
                dist *= dist
                image[i][j] += (0.55 / dist) * brushWeight
                if (image[i][j] > 1) image[i][j] = 1
                if (image[i][j] < 0.005) image[i][j] = 0
            }
        }
        draw()
    }
}

function mouseUp(event) {
    painting = false
    let input = []
    for (let i = 0; i < IMG_SIZE; i++) {
        for (let j = 0; j < IMG_SIZE; j++) {
            input.push(image[j][i])
        }
    }
    network.setInput(input)
    network.forwardFeed()
    let res = network.getMaxNeuronIndexFromLastLayer()
    resultLabel.innerHTML = res
}

let network = new Network([784, 250, 100, 10])
network.loadWeightFromFile()

canvas.addEventListener("mousedown", mouseDown)
canvas.addEventListener("mouseup", mouseUp)
canvas.addEventListener("mousemove", function (event) {
    mouseMove(event.offsetX, event.offsetY)
})

canvas.addEventListener("touchstart", mouseDown)
canvas.addEventListener("touchend", mouseUp)
canvas.addEventListener("touchmove", function(event) {
    event.preventDefault()
    let rect = canvas.getBoundingClientRect();
    mouseMove(event.touches[0].clientX - rect.left, event.touches[0].clientY - rect.top)
})

clearButton.addEventListener("click", () => {
    image = []
    for (let i = 0; i < IMG_SIZE; i++) {
        image[i] = []
        for (let j = 0; j < IMG_SIZE; j++) {
            image[i][j] = 0
        }
    }
    draw()
    resultLabel.innerHTML = ''
})

slider.addEventListener("input", function() {
    brushWeight = parseFloat(slider.value);
});