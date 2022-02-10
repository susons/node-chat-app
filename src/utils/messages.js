<<<<<<< HEAD
const moment = require('moment');

const generateMessage = (username, message) => ({
    username,
    text: message,
    created_at: moment().format('MM-DD-YY HH:MM:ss'),
});

const generateLocationMessage = (username, message) => ({
    username,
    url: message,
    created_at: moment().format('MM-DD-YY HH:MM:ss'),
});

module.exports = {
    generateMessage,
    generateLocationMessage
=======
const moment = require('moment');

const generateMessage = (username, message) => ({
    username,
    text: message,
    created_at: moment().format('MM-DD-YY HH:MM:ss'),
});

const generateLocationMessage = (username, message) => ({
    username,
    url: message,
    created_at: moment().format('MM-DD-YY HH:MM:ss'),
});

module.exports = {
    generateMessage,
    generateLocationMessage
>>>>>>> 3ae7402df9be7c61751413d76c4726eed427237c
}