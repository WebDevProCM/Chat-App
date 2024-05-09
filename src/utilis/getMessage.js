const generateMessage = (message) =>{
    return {
        message: message,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleString()
    }

}

module.exports = generateMessage;