const fs = require("fs");

const generateMessage = (message, username) =>{
    return {
        message: message,
        username: username,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleString()
    }

}

const addUser = (name, room, id) =>{
    const file = loadFile();
    const usernameExistence = file.find((user) =>{
        return user.username === name && user.room == room
    });
    if(usernameExistence){
        return {error: "Username already in use!"}
    }

    const user = {
        id: id,
        username: name,
        room: room,
        time: new Date().toLocaleTimeString()
    }
    file.push(user);
    saveFile(file);
    return user;
}

const getUserById = (id) =>{
    const file = loadFile();
    const user = file.find((user) =>{
        return user.id === id;
    })
    if(!user){
        return {error: "User not found!"}
    }
    return user;
}

const getUserByRoom = (room) =>{
    const file = loadFile();
    const users = file.filter((user) =>{
        return user.room == room;
    })
    if(!users){
        return {error: "User not found!"}
    }
    return users;
}

const removeUser = (name, room) =>{
    let file = loadFile();
    file.find((user, index) =>{
        if(user.username === name && user.room == room){
            return file.splice(index, 1);
        }
    })
    saveFile(file);
}

const loadFile = () =>{
    const bufferFile = fs.readFileSync("./src/utilis/users.json");
    const stringFile = bufferFile.toString();
    const file = JSON.parse(stringFile);

    return file;
}

const saveFile = (file) =>{
    const jsonFile = JSON.stringify(file);
    fs.writeFileSync("./src/utilis/users.json", jsonFile);
}

module.exports = {
    generateMessage: generateMessage,
    addUser: addUser,
    getUserById: getUserById,
    getUserByRoom: getUserByRoom,
    removeUser: removeUser
};