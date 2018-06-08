
//服务器端，负责转发数据
var express = require('express');
var socket = require('socket.io');
var fs = require('fs');
var https = require('https');

// App setup
var app = express();

app.use(express.static('public'));
var server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(4000);

// var server = app.listen(4000, function () {
//     console.log('listening for requests on port 4000,');
// });

// Static files

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('chat', function (data) {
        console.log(data)
        //广播信息
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });

});
