const users = [];

// Join user to chat

userJoin = (id, username, room) => {
    const user = {id, username, room};

    users.push(user);

    return user;

}

getUser = (id) => {
    return users.find(user => user.id === id);

}
// user leaves chat
userLeave = (id) => {
    const i = users.findIndex(user => user.id === id);
    if(i != -1) {
        return users.splice(i, 1)[0];
    }
}
// Get room users
 getActiveUsers = (room) => {
    return users.filter(user => user.room === room);
 }
module.exports = {
    userJoin,
    getUser,
    userLeave,
    getActiveUsers
}