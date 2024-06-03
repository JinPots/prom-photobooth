const path = require('path')
const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')
let queue = []
var chokidar = require('chokidar');
let config = require('./config.json')
let folderChange = false


async function outputImage(input, type) {
    let timeCurrent = new Date().toLocaleString()
    console.log(`[ImgP] Processing an image (TYPE: ${type}) at ${timeCurrent}`)
    let outputPath, id = makeid(5)
    const canvas = createCanvas(2000, 1409)
    const ctx = canvas.getContext('2d')
    if (type != 1) {
        // imgs
        let currentPath = input[0].split('\\').slice(0, -1).join('\\')
        let temp1 = currentPath.split('\\')
        console.log(`[ImgP] Loading images for ID ${temp1[temp1.length-1]}`)
        let img1 = await loadImage(input[0])
        let img2 = await loadImage(input[1])
        let img3 = await loadImage(input[2])
        let img4 = await loadImage(input[3])

        for (let i = 0; i < 4; i++) {
            let x = i * 490
            ctx.drawImage(img4, x, 870, 450, 275)
            ctx.drawImage(img3, x, 580, 450, 275)
            ctx.drawImage(img2, x, 300, 450, 275)
            ctx.drawImage(img1, x, 20, 450, 275)
        }
        console.log(`[ImgP] Finished for ID ${temp1[temp1.length-1]}`)

        let newPath = path.join(config.done, `${type}`, `${temp1[temp1.length - 1]}_${id}`)
        fs.renameSync(currentPath, newPath)
        outputPath = path.join(config.output, `${folderChange ? "2" : "1"}`, `${type}_${id}_ID${temp1[temp1.length-1]}(${new Date().getHours()}${new Date().getMinutes()}).jpg`)
    } else {
        let tempPath2 = path.join(config.output, `${folderChange ? "2" : "1"}`, `${type}_${id}_ID_`)
        const chunkSize = 4;
        let tempArray = []
        let a = "[ImgP] Processing an image (TYPE: 1) for 4 IDs: "
        for (let i = 0; i < queue.length; i += chunkSize) {
            const chunk = queue.slice(i, i + chunkSize);
            tempArray.push(chunk)
            let b = chunk[0].split('\\')
            a += `${b[b.length-2]} `
        }
        for (let i = 0; i < 4; i++) {
            let img1 = await loadImage(tempArray[i][0])
            let img2 = await loadImage(tempArray[i][1])
            let img3 = await loadImage(tempArray[i][2])
            let img4 = await loadImage(tempArray[i][3])

            let x = i * 490
            ctx.drawImage(img4, x, 870, 450, 275)
            ctx.drawImage(img3, x, 580, 450, 275)
            ctx.drawImage(img2, x, 300, 450, 275)
            ctx.drawImage(img1, x, 20, 450, 275)
            let currentPath = tempArray[i][0].split('\\').slice(0, -1).join('\\')
            let temp1 = currentPath.split('\\')
            temp1[temp1.length - 3] = "done"
            let newPath = path.join(config.done, `${type}`, `${temp1[temp1.length - 1]}_${id}`)
            fs.renameSync(currentPath, newPath)
            tempPath2 = `${tempPath2}${temp1[temp1.length - 1]}_`
        }
        outputPath = `${tempPath2}(${new Date().getHours()}${new Date().getMinutes()}).jpg`
        queue = []
    }
    let backgroundImage = await loadImage(__dirname + "/bg.png")
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

    folderChange = !folderChange
    const out = fs.createWriteStream(__dirname + '/test.jpg')
    const out2 = fs.createWriteStream(outputPath)
    const stream = canvas.createJPEGStream()
    stream.pipe(out)
    stream.pipe(out2)
    out.on('finish', () => console.log('[MAIN] An Image was created at time: ' + timeCurrent))
}

async function main() {
    Type1Check()
    Type4Check()
    Type8Check()
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
    var watcher = chokidar.watch(path.join(config.input, "1"), { ignored: /^\./, persistent: true });
    watcher.on('add', function (pathToImg) {
        queue.push(path.join(pathToImg))
        if (queue.length == 16) { outputImage(queue, 1) }
    })
}
async function Type4Check() {
    var watcher = chokidar.watch(path.join(config.input, "4"), { ignored: /^\./, persistent: true });
    let tempArray4 = []
    watcher.on('add', function (pathToImg) {
        tempArray4.push(path.join(pathToImg))
        if (tempArray4.length == 4) { outputImage(tempArray4, 4); tempArray4 = [] }
    })
}
async function Type8Check() {
    var watcher = chokidar.watch(path.join(config.input, "8"), { ignored: /^\./, persistent: true });
    let tempArray8 = []
    watcher.on('add', function (pathToImg) {
        tempArray8.push(path.join(pathToImg))
        if (tempArray8.length == 4) { outputImage(tempArray8, 8); tempArray8 = [] }
    })
}



main()