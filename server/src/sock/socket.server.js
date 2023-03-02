const auth_middleware = require('../middlewares/auth.middleware')

module.exports = (io) => {
  io.use(auth_middleware.authenticateTokenSocket)
  io.on('connection', function(socket) {
    console.log('A user connected', socket.user_id);
    wsClientList[socket.user_id] = socket
    
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });

    socket.on('listen_torrent', (torrent_id) => {
      socket.join(torrent_id)
    })
  });
}
