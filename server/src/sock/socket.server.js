const auth_middleware = require('../middlewares/auth.middleware')

module.exports = (io, TorGod) => {
  io.use(auth_middleware.authenticateTokenSocket)
  io.on('connection', function(socket) {
    console.log('A user connected', socket.user_id);
    wsClientList[socket.user_id] = socket

    socket.on('add_torrent', (torrent_id) => {
      try {
        socket.join(torrent_id)
        TorGod.handle_add_torrent_event(torrent_id)
        TorGod.bringNewcomerUpToDate(socket, torrent_id)
      }
      catch (e) {
        console.log("err in socket add torrent")
        throw(e)
        socket.emit()
      }
    })

    socket.on("disconnecting", () => {
      try {
        const rooms_iterator = socket.rooms[Symbol.iterator]();

        for (const item of rooms_iterator) { // Turn off torrents that no one is watchin
          if (item != socket.id) {
            if (io.sockets.adapter.rooms.get(item).size == 1) {
              TorGod.remove_torrent(item)
            }
          }
        }
      }
      catch (e) {
        console.log("error in disconnect torrent clean")
        throw(e)
      }
    });

    socket.on('disconnect', function () {
      console.log('A user disconnected');
    });
  });
}
