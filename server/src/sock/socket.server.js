const auth_middleware = require('../middlewares/auth.middleware')

module.exports = (io, TorGod) => {
  io.use(auth_middleware.authenticateTokenSocket)
  io.on('connection', function(socket) {
    console.log('A user connected', socket.user_id);
    wsClientList[socket.user_id] = socket

    socket.on('add_torrent', (torrent_id) => {
      console.log("adding socket to room")
      socket.join(torrent_id)
      TorGod.handle_add_torrent_event(torrent_id)
      TorGod.bringNewcomerUpToDate(socket, torrent_id)
    })

    socket.on("disconnecting", () => {
      console.log("disconnecting", socket.id, socket.rooms); // the Set contains at least the socket ID
      const rooms_iterator = socket.rooms[Symbol.iterator]();

      for (const item of rooms_iterator) {
        if (item != socket.id) {
          console.log(item);
          console.log("get", io.sockets.adapter.rooms.get(item), io.sockets.adapter.rooms.get(item).size)
          if (io.sockets.adapter.rooms.get(item).size == 1) {
            TorGod.remove_torrent(item)
          }
        }
      }
      // console.log("all rooms",io.sockets.adapter.rooms)
    });

    socket.on('disconnect', function () {
      console.log('A user disconnected');
      // console.log("all rooms after",io.sockets.adapter.rooms)
    });
  });
}
