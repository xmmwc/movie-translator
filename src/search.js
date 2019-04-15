import ioFactory from './io'
import { getMovie, setMovie } from './storage'
import config from './config'

const io = ioFactory('https://api.douban.com/v2/movie/')

export default async (name) => {
  if (config.useCache) {
    const movieFromCache = await getMovie(name)
    if (movieFromCache) {
      return movieFromCache
    }
  }
  try {
    console.log('重新查询电影信息')
    const data = await io.get('search', {
      count: 1,
      q: name
    })
    if (data.total > 0) {
      const movie = data.subjects[0]
      if (config.useCache) {
        await setMovie(name, movie).catch(e => {
          console.error('缓存电影失败:', e.message)
        })
      }
      return movie
    }
  } catch (e) {
    console.error('查询电影失败:', e.message)
  }
  return null
}
