# ScreenshareRTC
 Desktop screen sharing using WebRTC and NodeJS.

## On the client side:
 * Electron to build our client as a desktop application.
 * SocketIO client IO library help us to connect with our SocketIO server.
 * WebRTC through desktopCapturer using the navigator.mediaDevices.getUserMedia API.
 * Random strings generation using uuid

## On the server side:
* Setup an Express server with SocketIO to stablish real-time communication protocols with the client.
* Share screen only to selected users using rooms.
