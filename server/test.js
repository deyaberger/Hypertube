// const axios = require('axios')

let magnet =  "magnet:?xt=urn:btih:EA17E6BE92962A403AC1C638D2537DCF1E564D26&dn=Avengers%3A%20Infinity%20War&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969"
let magneto = "magnet:?xt=urn:btih:220ACD315EF1C7A6C15A6C0D27E9FFAB3BB553E8&dn=Tiffany%20Haddish%3A%20She%20Ready%21%20From%20the%20Hood%20to%20Hollywood&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969"

var Client = require('torrent-client');
const client = new Client()
var torrent = client.add(magnet,{path: "./torrents",strategy  : "sequential" });
// var torrento = client.addTorrent(magneto);



// torrent.on('complete', function() {
//     console.log('complete!');
// });
// torrent.on('torrent:ready', function() {
//     console.log("torrents", Object.keys(client.torrents))
//     console.log("got", Object.keys(get_torrent(magnet)))
//     console.log("out")

// });

// torrent.on('progress', function() {
//     console.log('Proge!');
// });
// console.log("waitign")



// [
//     File {
//       path: 'torrents/Avengers Infinity War (2018) [BluRay] [720p] [YTS.AM]/Avengers.Infinity.War.2018.720p.BluRay.x264-[YTS.AM].mp4',
//       length: 1337259329,
//       offset: 0,
//       fd: 26,
//       busy: false
//     },
//     File {
//       path: 'torrents/Avengers Infinity War (2018) [BluRay] [720p] [YTS.AM]/www.YTS.AM.jpg',
//       length: 58132,
//       offset: 1337259329,
//       fd: 32,
//       busy: false
//     }
//   ]
//   <Buffer 03 f0 ae e2> <Buffer 03 f0 ae e2>
//   <Buffer 9f 8b 14 3c> <Buffer 9f 8b 14 3c>
//   <Buffer df 9c 08 fb> <Buffer df 9c 08 fb>
//   <Buffer 0b 9e 2e 27> <Buffer 0b 9e 2e 27>
//   node:events:368
//         throw er; // Unhandled 'error' event
//         ^
  
//   Error: read ECONNRESET
//       at TCP.onStreamRead (node:internal/stream_base_commons:220:20)
//   Emitted 'error' event on Socket instance at:
//       at emitErrorNT (node:internal/streams/destroy:157:8)
//       at emitErrorCloseNT (node:internal/streams/destroy:122:3)
//       at processTicksAndRejections (node:internal/process/task_queues:83:21) {
//     errno: -104,
//     code: 'ECONNRESET',
//     syscall: 'read'
//   }
//   ❯ node test.js
//   <Buffer 94 dc 0e 07> <Buffer 94 dc 0e 07>
//   <Buffer c3 dc a8 df> <Buffer c3 dc a8 df>
//   <Buffer c3 55 9e df> <Buffer c3 55 9e df>
//   <Buffer ef 1f 6b e9> <Buffer ef 1f 6b e9>
//   <Buffer 95 b0 de 9e> <Buffer 95 b0 de 9e>
//   <Buffer b7 20 69 f8> <Buffer b7 20 69 f8>
//   <Buffer da a6 1c 84> <Buffer da a6 1c 84>
//   <Buffer e5 95 bc 76> <Buffer e5 95 bc 76>
//   <Buffer 9b e8 78 5a> <Buffer 9b e8 78 5a>
//   <Buffer 9a 2f 47 df> <Buffer 9a 2f 47 df>
//   [
//     File {
//       path: 'torrents/Avengers Infinity War (2018) [BluRay] [720p] [YTS.AM]/Avengers.Infinity.War.2018.720p.BluRay.x264-[YTS.AM].mp4',
//       length: 1337259329,
//       offset: 0,
//       fd: 26,
//       busy: false
//     },
//     File {
//       path: 'torrents/Avengers Infinity War (2018) [BluRay] [720p] [YTS.AM]/www.YTS.AM.jpg',
//       length: 58132,
//       offset: 1337259329,
//       fd: 27,
//       busy: false
//     }
//   ]
  