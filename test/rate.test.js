import { getMovieByRate } from '../src/list'

const movie = getMovieByRate([{
  name: 'black panther',
  year: '2018',
  res: '1080p',
  quality: 'bluray',
  codec: 'h264',
  sound: 'aac',
  author: 'rarbg',
  origin_title: 'Black.Panther.2018.1080p.BluRay.H264.AAC-RARBG',
  link:
    'magnet:?xt=urn:btih:8d7210eee5fbae2f35ad84779706d5626d0a34d8&dn=Black.Panther.2018.1080p.BluRay.H264.AAC-RARBG&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce',
  group_rate: 0,
  rating_average: 0
}])

console.log(movie)
