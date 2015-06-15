// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var users = {};
var admin = null;
var numUsers = 0;

io.on('connection', function(socket) {
    var addedUser = false;
    var addedAdmin = false;


    socket.on('add user', function(type) {

        if (type == "device") {
            console.log("Socket", socket.id, "[device] has connected");

            users[socket.id] = socket;
            ++numUsers;
            addedUser = true;
        } else if (type == "admin") {
            console.log("Socket", socket.id, "[admin] has connected");
            admin = socket;
            addedAdmin = true;
        }

    });

    socket.on("button down", function(instrument, button){
        console.log(instrument, button)
      if(admin){
        admin.emit("button down",instrument, button);
      }
    })

    socket.on("button up", function(instrument, button){
        console.log(instrument, button)
      if(admin){
        admin.emit("button up", instrument, button);
      }
    })

    socket.on('disconnect', function() {

        console.log("Socket", socket.id, "has disconnected");

        if (addedUser) {
            delete users[socket.id];
            --numUsers;
        }
    });

});
