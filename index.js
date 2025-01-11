const path = require('path')
const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')
let queue = []
var chokidar = require('chokidar');
let config = require('./config.json')


async function outputImage(input) {
    let timeCurrent = new Date()
    console.log(`[ImgP] Processing an image at ${timeCurrent.toLocaleDateString()}`)
    let outputPath, id = makeid(5)
    const canvas = createCanvas(972, 2818)
    const ctx = canvas.getContext('2d')
    // imgs
    let currentPath = input[0].split('\\').slice(0, -1).join('\\')
    let temp1 = currentPath.split('\\')
    console.log(`[ImgP] Loading images for ID ${id}`)
    let img1 = await loadImage(input[0])
    let img2 = await loadImage(input[1])
    let img3 = await loadImage(input[2])
    let img4 = await loadImage(input[3])

    let x =30
    ctx.drawImage(img1, x, 38, 956, 538)
    ctx.drawImage(img2, x, 608, 956, 538)
    ctx.drawImage(img3, x, 1178, 956, 538)
    ctx.drawImage(img4, x, 1748, 956, 538)
    console.log(`[ImgP] Finished for ID ${id}`)

    let newPath = path.join(config.done, `${id}`)
    // fs.renameSync(currentPath, newPath)
    outputPath = path.join(config.output, `${new Date().getHours()}${new Date().getMinutes()}${id}.jpg`)
    let backgroundImage = await loadImage(__dirname + "/bg.png")
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

    const out = fs.createWriteStream(__dirname + '/test.jpg')
    const out2 = fs.createWriteStream(outputPath)
    const stream = canvas.createJPEGStream()
    stream.pipe(out)
    stream.pipe(out2)
    out2.on('finish', () => console.log('[MAIN] An Image was created at time: ' + timeCurrent.toLocaleDateString()))
}

async function main() {
    Type1Check()
    console.log("[MAIN] Started up Photobooth Image Processor at " + new Date().toLocaleString())
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}


async function Type1Check() {
    var watcher = chokidar.watch(path.join(config.cameraShooting), { ignored: /^\./, persistent: true });
    watcher.on('add', function (pathToImg) {
        queue.push(path.join(pathToImg))
        if (queue.length == 4) { outputImage(queue) }
    })
}

main()