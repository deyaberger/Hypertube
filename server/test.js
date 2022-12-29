// const axios = require('axios')
// const webtorrent = require('webtorrent')
// const client = new webtorrent()
var base32 = require('base32');

let magnet =  "magnet:?xt=urn:btih:EA17E6BE92962A403AC1C638D2537DCF1E564D26&dn=Avengers%3A%20Infinity%20War&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969"
let magneto = "magnet:?xt=urn:btih:220ACD315EF1C7A6C15A6C0D27E9FFAB3BB553E8&dn=Tiffany%20Haddish%3A%20She%20Ready%21%20From%20the%20Hood%20to%20Hollywood&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969"

var Client = require('node-torrent');
const client = new Client({downloadPath: "./torrents", logLevel: 'WARNING'})
var torrent = client.addTorrent(magnet);
var torrento = client.addTorrent(magneto);


function get_torrent(magnet) {
    var parsedUrl = require('url').parse(magnet, true),
    hash;
    
    var urns = parsedUrl.query.xt;
    if (!Array.isArray(urns)) {
        urns = [urns];
    }
    console.log(urns.length)
    urns.some(function(urn) {
        if (urn.match(/^urn:btih:/)) {
            hash = urn.substring(9);
            return true;
        }
    });
    var infoHash;
    if (hash.length === 40) {
        infoHash = new Buffer(hash, 'hex');
    } else {
        infoHash = new Buffer(base32.decode(hash), 'binary');
    }
    console.log(infoHash)
    return client.torrents[infoHash]
};

// torrent.on('complete', function() {
//     console.log('complete!');
// });

torrent.on('torrent:ready', function() {
    console.log("torrents", Object.keys(client.torrents))
    console.log("got", get_torrent(magnet))
    console.log("out")

});

// torrent.on('progress', function() {
//     console.log('Proge!');
// });
// console.log("waitign")
