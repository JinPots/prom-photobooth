const path = require('path')
const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')
let queue = []
var chokidar = require('chokidar');


async function outputImage(input, type) {
    let timeCurrent = new Date().toLocaleString()
    console.log("Processing an image at " + timeCurrent)
    const canvas = createCanvas(2000, 1409)
    const ctx = canvas.getContext('2d')
    if (type != 1) {
        // imgs
        console.log(input)
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
        let currentPath = input[0].split('\\').slice(0, -1).join('\\')
        let temp1 = currentPath.split('\\')
        temp1[temp1.length - 3] = "done"
        let newPath = temp1.join('\\')
        fs.renameSync(currentPath, newPath)
    } else {
        const chunkSize = 4;
        let tempArray = []
        for (let i = 0; i < queue.length; i += chunkSize) {
            const chunk = queue.slice(i, i + chunkSize);
            tempArray.push(chunk)
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
            let newPath = temp1.join('\\')
            fs.renameSync(currentPath, newPath)
        }
    }
    // return;
    // background
    let backgroundImage = await loadImage(__dirname + "/bg.png")
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

    let time = new Date()
    const out = fs.createWriteStream(__dirname + '/test.jpg')
    const out2 = fs.createWriteStream(__dirname + `/imgs/output/${parseInt(type)}/${time.getHours()}_${time.getMinutes()}_${time.getSeconds()}.jpg`)
    const stream = canvas.createJPEGStream()
    stream.pipe(out)
    stream.pipe(out2)
    out.on('finish', () => console.log('An Image was created at time: ' + timeCurrent))
}

async function main() {
    Type1Check()
    Type4Check()
    Type8Check()
    // outputImage(queue, 1)
}



async function Type1Check() {
    var watcher = chokidar.watch('./imgs/input/1', { ignored: /^\./, persistent: true });
    watcher.on('add', function (pathToImg) {
        queue.push(path.join(__dirname, pathToImg))
        if (queue.length == 16) { outputImage(queue, 1) }
    })
}
async function Type4Check() {
    var watcher = chokidar.watch('./imgs/input/4', { ignored: /^\./, persistent: true });
    let tempArray4 = []
    watcher.on('add', function (pathToImg) {
        tempArray4.push(path.join(__dirname, pathToImg))
        if (tempArray4.length == 4) { outputImage(tempArray4, 4); tempArray4 = [] }
    })
}
async function Type8Check() {
    var watcher = chokidar.watch('./imgs/input/8', { ignored: /^\./, persistent: true });
    let tempArray8 = []
    watcher.on('add', function (pathToImg) {
        queue.push(path.join(__dirname, pathToImg))
        if (tempArray8.length == 4) { outputImage(tempArray8, 8); tempArray8 = [] }
    })
}
main()