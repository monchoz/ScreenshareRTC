var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/public', express.static('public'));

// Setup server
app.get('/view', (req, res) => {
    res.sendFile(__dirname + '/display.html');
})

// Handle events
io.on('connection', (socket) => {
    // client calls the event to join a room
    socket.on('join', (roomId) => {
        socket.join(roomId);
        console.log(`New client joined the room: ${roomId}`);
    })

    // handle screen data
    socket.on('screen-data', (data) => {
        data = JSON.parse(data);
        let imgData = data.imgData;
        socket.broadcast.emit('screen-data', imgData);
    })
})

var serverPort = process.env.PORT || 5000;
http.listen(serverPort, () => {
    console.log(`Started on: ${serverPort}`);
})
