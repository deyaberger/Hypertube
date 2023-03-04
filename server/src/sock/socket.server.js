const auth_middleware = require('../middlewares/auth.middleware')

module.exports = (io, TorGod) => {
  io.use(auth_middleware.authenticateTokenSocket)
  io.on('connection', function(socket) {
    console.log('A user connected', socket.user_id);
    wsClientList[socket.user_id] = socket

    socket.on('add_torrent', (torrent_id) => {
      // TorGod.add_socket_to_torrent_room(socket, torrent_id)
      console.log("adding socket to room")
      socket.join(torrent_id)
      TorGod.handle_add_torrent_event(torrent_id)
      TorGod.bringNewcomerUpToDate(socket, torrent_id)
      // console.log("soket rooms",io.sockets.adapter.sids.get(socket.id))
      // console.log("all rooms",io.sockets.adapter.rooms)
    })

    socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
  });
}
