const hbjs = require('handbrake-js')

mkvpaf = '../torrents/Your.Honor.US.S02E05.Parte.Quindici.ITA.ENG.1080p.AMZN.WEB-DL.DDP.H.264-MeM.GP.mkv'
dest = '../torrents/Your.Honor.US.S02E05.Parte.Quindici.ITA.ENG.1080p.AMZN.WEB-DL.DDP.H.264-MeM.GP.mp4'
hbjs.spawn({ input: mkvpaf, output: dest, optimize: true }).on('error', console.log).on('progress', progress => {console.log( 'Percent complete: %s, ETA: %s', progress.percentComplete, progress.eta)})