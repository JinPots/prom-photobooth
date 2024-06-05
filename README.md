# Photobooth Image Processor
A **NodeJS** image handler for a Photobooth *( Life4Cuts Remake )*. 


This was made for **Prom Le Quy Don - Nha Trang 2024**. Configuration guide [click here](#how-to-config)

## Example image
![](<example.jpg?raw=true>)

# How to config
1. Clone or download [source code](https://github.com/JinPots/prom-photobooth/archive/refs/heads/master.zip)
2. Create a folder with this structure:
```
images/
├── input/
│   ├── 1
│   ├── 4
│   └── 8
├── output -- Image generated will be output here
├── done/
│   ├── 1
│   ├── 4
│   └── 8
└── cameraInput -- Images from Camera insert here
```

3. Change the path for folders in `config.json` file
4. Run `npm install` to install required dependencies

# How to use
1. Do the [config guide](#how-to-config)
2. Run `node index.js` for image processor (backend)
3. Run `node fileInput.js` for a interface to create new images.

```
? Type to shoot
❯ 1 -- Require 4 times shooting type 1 to create new image
  4
  8
```

```
? ID/Ticket ID: -- Input ID to seperate new image
```
