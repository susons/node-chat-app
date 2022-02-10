const path = require('path');
const http = require('http');
const Filter = require('bad-words')
const express = require('express');
const socketIo = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const {
    addUser,
    removeUser,
    getUser,
    getUsers,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    socket.on('join', ({ username, room }, callback) => {
        const { user, error } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', 'Wellcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the server!`));

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsers(user.room),
        });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        const filter = new Filter();

        if (filter.isProfane(message)) {
            socket.emit('message', generateMessage('Admin', 'profanity is not allowed'));
            callback()
            return;
        } else {
            io.to(user.room).emit('message', generateMessage(user.username, message));
            callback();
        }
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the room`));

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsers(user.room),
            });
        }

    });

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);
        //  socket.broadcast.emit
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`));
        callback();
    });
});


server.listen(port, () => {
    console.log(`server is up on prot ${port}!`)
})