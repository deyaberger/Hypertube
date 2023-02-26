var srt2vtt = require('srt-to-vtt')
var fs      = require('fs')
const { readFile } = require('fs/promises')

var srtValidator = require('srt-validator').validator

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

async function content(path) {  
  return await readFile(path, 'utf8')
}

module.exports.convert_to_vtt = async (req, res, next) => {
  try {
    let paf = decodeURIComponent(req.url.replace(/^\/+/, ''));
    let converted_paf
    let url_rewrite = req.url
    paf = `./torrents/${paf}`

    if (!fs.existsSync(paf)) {
      return res.sendStatus(404)
    }

    if (fs.statSync(paf).size > 1000000) {
      console.log("TOO LARGE", fs.statSync(paf).size)
      return res.status(204).send({code: return_codes.FILE_TOO_LARGE})
    }

    if (paf.endsWith('.srt')) {
      converted_paf = paf.slice(0, -4)   + '.vtt'
      url_rewrite = req.url.slice(0, -4) + '.vtt'
      console.log('dest', converted_paf)
    }

    if (paf.endsWith('.vtt') || fs.existsSync(converted_paf)) {
      console.log("vtt already here")
      req.url = url_rewrite
      return next()
    }

    console.log("validating file")
    let errors = srtValidator(await content(paf))
    if (errors.length > 0) {
      console.log("errors", errors)
      return res.status(204).send({code: return_codes.CORRUPTED_SRT_FILE})
    }
    console.log("valid")

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
    if (e.code == 'ERR_STRING_TOO_LONG') {
      return res.status(204).send({code: return_codes.FILE_TOO_LARGE})
    }
    throw(e)
    res.status(400).send({code: return_codes.UNKNOWN_ERROR})
  }
}