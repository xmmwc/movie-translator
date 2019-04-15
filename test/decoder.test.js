import debug from 'debug'
import collectInfo from '../src/decoder'
const logDebug = debug('project:test')

const movies = [
  'Hotel.Artemis.2018.1080p.BluRay.x264.DTS-HD.MA.5.1-FGT',
  'Hotel.Artemis.2018.1080p.BluRay.REMUX.AVC.DTS-HD.MA.5.1-FGT',
  'Hotel.Artemis.2018.1080p.BluRay.AVC.DTS-HD.MA.5.1-FGT',
  'Hotel.Artemis.2018.1080p.BluRay.H264.AAC-RARBG',
  'Hotel.Artemis.2018.BRRip.XviD.AC3-XVID',
  'Hotel.Artemis.2018.720p.BRRip.XviD.AC3-XVID',
  'Hotel.Artemis.2018.720p.BluRay.H264.AAC-RARBG',
  'Hotel.Artemis.2018.BRRip.XviD.MP3-XVID',
  'Hotel.Artemis.2018.BDRip.x264-DiAMOND',
  'Hotel.Artemis.2018.720p.BluRay.x264-Replica',
  'Hotel.Transylvania.3.Summer.Vacation.2018.1080p.BluRay.x264.DTS-HD.MA.5.1-FGT',
  'Hotel.Transylvania.3.Summer.Vacation.2018.1080p.BluRay.REMUX.AVC.DTS-HD.MA.5.1-FGT',
  'Hotel.Transylvania.3.Summer.Vacation.2018.1080p.BluRay.AVC.DTS-HD.MA.5.1-FGT',
  'Hotel.Transylvania.3.Summer.Vacation.2018.720p.BluRay.H264.AAC-RARBG',
  'Hotel.Transylvania.3.Summer.Vacation.2018.BRRip.XviD.AC3-XVID',
  'Hotel.Transylvania.3.Summer.Vacation.2018.BDRip.x264-COCAIN',
  'Skyscraper.2018.1080p.WEB-DL.DD5.1.H264-FGT'
]

for (const movie of movies) {
  const movieInfo = collectInfo(movie)
  logDebug(movieInfo)
}
