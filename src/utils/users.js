const users = [];

// addUser, removeUser, getUser, getUsersInRoom;

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate data;
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    // check for existing users
    const existingUser = users.find(user => {
        if (user.room === room && user.username === username) return true;
    });

    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    // store user in session
    const user = { id, username, room };

    users.push(user);
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

const getUsers = (room) => {
    return users.filter(user => user.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsers,
}