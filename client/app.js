// app.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const { v4: uuidv4 } = require('uuid');

var socket = require('socket.io-client')('http://192.168.1.18:5000');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 350,
        height: 450,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Remove menu bar
    mainWindow.removeMenu()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// Event handlers
ipcMain.on("start-sharing", function(event, arg) {
    // Uncomment this to support private sharing
    /*var uuid = uuidv4(); // random string
    socket.emit('join', uuid); // join to a room
    event.reply('uuid', uuid); // send generated uuid to client UI*/

    let obj = {};
    obj.imgData = arg;
    // send object to server
    socket.emit('screen-data', JSON.stringify(obj));
})

ipcMain.on("stop-sharing", function(event, arg) {})