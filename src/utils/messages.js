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
}