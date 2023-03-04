const auth_middleware = require('../middlewares/auth.middleware')

module.exports = (io, TorGod) => {
  io.use(auth_middleware.authenticateTokenSocket)
  io.on('connection', function(socket) {
    console.log('A user connected', socket.user_id);
    wsClientList[socket.user_id] = socket
    
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });

    socket.on('add_torrent', (torrent_id) => {
      // TorGod.add_socket_to_torrent_room(socket, torrent_id)
      console.log("adding socket to room")
      socket.join(torrent_id)
      TorGod.add_torrent(torrent_id)
      // console.log("soket rooms",io.sockets.adapter.sids.get(socket.id))
      // console.log("all rooms",io.sockets.adapter.rooms)
    })

    socket.on('listen_torrent', (torrent_id) => {
      socket.join(torrent_id)
    })
  });
}
