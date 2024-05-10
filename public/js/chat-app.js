const socket =  io();
const userMessage = $("#messageText");
const form = $(".message-form");
const sendMessageBtn = $("#sendMessage");
const sendLocationBtn = $("#sendLocation");
const messageBody = document.querySelector(".chat_body");
const sidebar = document.querySelector(".navbar-nav");

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

socket.on("sidebarData", (data) =>{
    let sidebarContent ="";
    data.forEach((roomData) =>{
        sidebarContent = sidebarContent + generateSidebarHTML(roomData);
    });
    sidebar.innerHTML = sidebarContent;
})

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

const generateSidebarHTML = (sidebarData) =>{
    return `
        <li class="nav-item">
            <div class="user-chat">
            <div class="user-chat-div">
                <img src="/images/users/defaultDP.png" alt="user-profile-picture">
                <h5>${sidebarData.username}</h5>
            </div>
            <p>Joined at ${sidebarData.time}</p>
            </div>
        </li>
    `
}

const searchContent = `<li class="nav-item search">
    <form class="d-flex" role="search">
    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" onkeyup="searchUser()">
    </form>
    </li>`

    // <button class="btn btn-outline-primary" type="submit">Search</button>