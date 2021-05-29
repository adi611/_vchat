

var PORT = process.env.PORT || 3000;
const express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
   res.sendFile(__dirname+'/index.html');
});
app.post('/', function(req, res) {
  res.sendFile(__dirname+'/chat.html');
});
const users = {}

io.on('connection', socket => {
  socket.on('new-user', req => {
    users[socket.id] = req
    io.in(users[socket.id].room).emit("current-users",users);
    socket.join(users[socket.id].room);
    socket.to(users[socket.id].room).emit('user-connected', users[socket.id].name)
    console.log(users);
    
  })
  socket.on('send-chat-message', message => {
    io.in(users[socket.id].room).emit("current-users",users);
    socket.to(users[socket.id].room).emit('chat-message', { message: message, name: users[socket.id].name })
  })
  socket.on('disconnect', () => {
    if(users[socket.id]!=undefined){
      const room = users[socket.id].room;
      socket.leave(room);
      socket.to(room).emit('user-disconnected', users[socket.id].name)
      delete users[socket.id]
      socket.to(room).emit("current-users",users);
    }
    
    
    
   
    console.log(users);
  })
});
http.listen(PORT, function() {
  console.log("server started");
});
