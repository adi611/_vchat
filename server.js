

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

io.sockets.on('connection', socket => {
  socket.on('new-user', req => {
    users[socket.id] = req
    socket.join(users[socket.id].room);
    socket.to(users[socket.id].room).emit('user-connected', users[socket.id].name)
  })
  socket.on('send-chat-message', message => {
    socket.to(users[socket.id].room).emit('chat-message', { message: message, name: users[socket.id].name })
  })
  socket.on('disconnect', () => {
    if(users[socket.id]!=undefined){
      socket.leave(users[socket.id].room);
      socket.to(users[socket.id].room).emit('user-disconnected', users[socket.id].name)
    }
    
    
    delete users[socket.id]
  })
});
http.listen(PORT, function() {
  console.log("server started");
});
