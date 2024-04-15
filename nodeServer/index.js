const express = require('express');
const socketIo = require('socket.io');
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 8000;

const users = {};
app.use(express.static("."));


io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
