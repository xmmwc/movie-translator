import ioFactory from './io'
import {getMovie, setMovie} from './storage'

const io = ioFactory('https://api.douban.com/v2/movie/')

export default async name => {
  const movieFromCache = await getMovie(name)
  if (!movieFromCache) {
    try {
      const data = await io.get('search', {
        count: 1,
        q: name
      })
      if (data.total > 0) {
        const movie = data.subjects[0]
        await setMovie(name, movie).catch(e => {
          console.error('缓存电影失败:', e.message)
        })
        return movie
      }
    } catch (e) {
      console.error('查询电影失败:', e.message)
      return null
    }
  }
  return movieFromCache
}