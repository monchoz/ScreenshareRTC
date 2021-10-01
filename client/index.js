const ipcRenderer = require('electron').ipcRenderer;
const { desktopCapturer } = require('electron')

var interval;
var imageFormat = imageFormat || 'image/png'
// Create hidden video tag
var video = document.createElement('video');
video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';


window.onload = function () {
    ipcRenderer.on('uuid', (event, data) => {
        document.getElementById('code').innerHTML = data;
    })
}

// send event to start sharing to Electron
function startSharing() {
    document.getElementById("start").style.display = "none";
    document.getElementById("stop").style.display = "inline";
    document.body.appendChild(video);
    interval = setInterval(function () {
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
        for (const source of sources) {
            console.log(source.name);
            if (source.name === 'Entire Screen') {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source.id,
                                minWidth: 1280,
                                maxWidth: 4000,
                                minHeight: 720,
                                maxHeight: 4000
                            }
                        }
                    })
                    handleStream(stream)
                } catch (e) {
                    handleError(e)
                }
                return
            }
        }
    })
    },100)
}

function handleStream(stream) {
    video.srcObject = stream;
}

// Event connected to stream
video.onloadedmetadata = function () {
    // Set video ORIGINAL height (screenshot)
    video.style.height = this.videoHeight + 'px'; // videoHeight
    video.style.width = this.videoWidth + 'px'; // videoWidth

    video.play();

    // Create canvas
    var canvas = document.createElement('canvas');
    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;
    var ctx = canvas.getContext('2d');
    // Draw video on canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    ipcRenderer.send("start-sharing", canvas.toDataURL(imageFormat));
}

function handleError(e) {
    console.log(e)
}

// send event to top sharing to Electron
function stopSharing() {
    clearInterval(interval);
    document.getElementById("start").style.display = "inline";
    document.getElementById("stop").style.display = "none";
}