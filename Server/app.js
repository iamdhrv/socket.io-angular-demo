const Express = require("express")();
var app = Express;
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

Http.listen(5000, () => {
    console.log("Listening at 5000....");
});

app.get('/', (req, res) => {
    res.send('<h1>Hey This is server for your chat</h1>');
  });

var message = {
    username: " ",
    message: " "
};

var numUser = 0;

Socketio.on("connection", socket => {
    socket.on("login", data => {
        console.log("logged in", data);
        socket.username = data
        numUser += 1;
        Socketio.emit("logged-in" , data);
        Socketio.emit("users", numUser);
    });
    socket.on("send", data => {

        message.message = data;
        Socketio.emit("message", {
            username: socket.username,
            message: data
        });
    });
    socket.on("lefted", (data) => {
        console.log(data ,"left");
        Socketio.emit("left", data);
        if(numUser > 0 ){
            --numUser;
        }
        Socketio.emit("users", numUser);
        
    })

});