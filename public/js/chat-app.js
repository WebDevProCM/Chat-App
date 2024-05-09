const socket =  io();
const userMessage = $("#messageText");
const form = $("form");
const sendMessageBtn = $("#sendMessage");
const sendLocationBtn = $("#sendLocation");
const messageBody = document.querySelector(".chat_body");

const roomData = Qs.parse(location.search, {ignoreQueryPrefix: true});

socket.emit("room", roomData, (error) =>{
    if(error){
        showError(error);
        return setTimeout(() =>{
            window.location.replace("/");
        }, 1000)
    }
})

socket.on("message", (message) =>{
    messageBody.insertAdjacentHTML("beforeend", generateMessageHTML(message));
});

socket.on("location", (location) =>{
    messageBody.insertAdjacentHTML("beforeend", generateLocationHTML(location));
});

form.on("submit", (event) =>{
    event.preventDefault();
    sendLocationBtn.disabled = true;
    sendMessageBtn.disabled = true;
    socket.emit("message", userMessage.val(), (error) =>{
        sendLocationBtn.disabled = false;
        sendMessageBtn.disabled = false;
        userMessage.val("");
        userMessage.focus();
        if(error){
            return showError(error);
        }

    })
})

sendLocationBtn.on("click", () =>{
    sendLocationBtn.disabled = true;
    sendMessageBtn.disabled = true;
    
    if(!navigator.geolocation){
        return showError("Browser doesn`t support");
    }

    navigator.geolocation.getCurrentPosition((location) =>{
        const cords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude 
        }
        socket.emit("location", cords, (error) =>{
            sendLocationBtn.disabled = false;
            sendMessageBtn.disabled = false;
            userMessage.val("");
            userMessage.focus();
            if(error){
                return showError(error);
            }   
        })
    });

});

const generateMessageHTML = (message) =>{
    return `
        <div class="message-div">
            <div class="message-div__body">
                <img src="/images/users/defaultDP.png" alt="user-icon">
                <div class="message-info">
                    <p class="user-name">${message.username}</p>
                    <p class="user-message"> ${message.message} </p>
                </div>
            </div>
            <p class="message-time">${message.date}</p>
        </div>
    `
}

const generateLocationHTML = (location) =>{
    const url = `https://www.google.com/maps?q=${location.message.latitude},${location.message.longitude}`;
    return `
        <div class="message-div">
            <div class="message-div__body">
                <img src="/images/users/defaultDP.png" alt="user-icon">
                <div class="message-info">
                    <p class="user-name">Smith</p>
                    <p class="user-message"> <a href=${url} target="_blank"> My location </a></p>
                </div>
            </div>
            <p class="message-time">${location.date}</p>
        </div>
    `
}