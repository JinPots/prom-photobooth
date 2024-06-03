const inquirer = require('@inquirer/prompts')
const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs')
const config = require('./config.json')
async function main() {
    let selection1 = await inquirer.select({
        message: 'New Picture or Exit',
        choices: [
            {
                name: 'New Picture',
                value: 'continue',
            },
            {
                name: 'Finish Session',
                value: 'exit',
            }
        ]
    })
    if (selection1 == "exit") return;

    let typeInput = await inquirer.select({
        message: "Type to shoot",
        choices: [
            { value: "1" },
            { value: "4" },
            { value: "8" }
        ]
    })

    let id = await inquirer.input({ message: "ID/Ticket ID: " })
    console.log('[MAIN] Waiting for pictures at Camera Folder...')
    var watcher = chokidar.watch(path.join(config.cameraShooting), { ignored: /0-9/, persistent: true });
    let imgs = []
    let folder = path.join(config.input, `${typeInput}`, `${id}`)
    fs.mkdirSync(folder)
    watcher.on('add', (pathToImg) => {
        let fileName2 = pathToImg.split('\\').pop()
        if (!fileName2.endsWith(".jpg")) return
        imgs.push(pathToImg)
        if (imgs.length == 4) {
            watcher.close()
            setTimeout(() => {
                console.log('[MAIN] Sending files to Image Processor...')
                for (let i = 0; i < imgs.length; i++) {
                    let fileName = imgs[i].split('\\').pop()
                    fs.renameSync(imgs[i], path.join(folder, fileName))
                }
            }, 400)
            main()
        }
    })
}

main()