var srt2vtt = require('srt-to-vtt')
var fs      = require('fs')

const return_codes = require("../utils/return_codes");

module.exports.only_srt_or_vtt = (req, res, next) => {
  try {
    console.log("getting", req.url, typeof(req.url))
    if (req.url.endsWith('.srt') || req.url.endsWith('.vtt')) {
      next()
    }
    else {
      res.status(401).send({code: return_codes.ONLY_SRT_ALLOWED})
    }
  }
  catch (e) {
    throw(e)
    res.status(400).send({code: return_codes.UNKNOWN_ERROR})
  }
}

module.exports.convert_to_vtt = async (req, res, next) => {
  try {
    let paf = decodeURIComponent(req.url.replace(/^\/+/, ''));
    let converted_paf
    let url_rewrite = req.url
    paf = `./torrents/${paf}`
    console.log("converting", paf)

    if (paf.endsWith('.srt')) {
      converted_paf = paf.slice(0, -4) + '.vtt'
      url_rewrite = req.url.slice(0, -4) + '.vtt'
      console.log('dest', converted_paf)
    }

    if (paf.endsWith('.vtt') || fs.existsSync(converted_paf)) {
      console.log("vtt already here")
      req.url = url_rewrite
      return next()
    }

    console.log("converting")
    let stream = fs.createReadStream(paf)
    .pipe(srt2vtt())
    .pipe(fs.createWriteStream(converted_paf))

    stream.on('finish', () => {
      console.log("exists after convert", fs.existsSync(converted_paf))

      req.url = url_rewrite
      console.log("rewrote url to", req.url)
      next()
    })
  }
  catch (e) {
    throw(e)
    res.status(400).send({code: return_codes.UNKNOWN_ERROR})
  }
}